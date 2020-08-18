import { payments, ECPair } from 'bitcoinjs-lib'
import * as bip32 from 'bip32'
import createHash from 'create-hash'
import {
    PathCursor,
    Blockchain,
    Network,
    Path,
    KeysWithPath,
    MasterKeys,
} from '../types'
import { getIndexes, preparePath, getHardenedPath } from '../utils'
import { bitcoin, Network as NetworkConfig } from '../network-configs'
import {
    isValidBech32Address,
    isValidBase58Address,
    decodeBase58,
    decodeBech32,
} from './address-utils'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lib = require('bitcoinjs-lib')

export class BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.BITCOIN,
            network: Network.MAINNET,
            path: "m/44'/0'/0'",
            config: bitcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.BITCOIN,
            network: Network.TESTNET,
            path: "m/44'/1'/0'",
            config: bitcoin.testnet,
        },
    }
    protected defaultPath: string
    protected networkConfig: NetworkConfig

    constructor(network: Network) {
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
    }

    getPaths(): Path[] {
        return Object.values(this.networks).map(path => ({
            blockchain: path.blockchain,
            network: path.network,
            path: path.path,
        }))
    }

    deriveRecursive(
        derived: bip32.BIP32Interface,
        parts: number[],
    ): bip32.BIP32Interface {
        if (parts.length) {
            const [part, ...leftParts] = parts
            return this.deriveRecursive(derived.derive(part), leftParts)
        }
        return derived
    }

    protected getPrivateKey(privateKey: bip32.BIP32Interface): string {
        return privateKey.toWIF()
    }

    protected getPublicKey(publicKey: string): string {
        return publicKey
    }

    derivateFromPrivate(
        masterPrivateKey: string,
        cursor: PathCursor,
    ): KeysWithPath[] {
        const wallet = bip32.fromBase58(masterPrivateKey, this.networkConfig)
        const indexes = getIndexes(cursor.skip, cursor.limit)
        const path = preparePath(cursor.path || this.defaultPath)

        return indexes.map(index => {
            const currentPath = path.replace('{index}', index.toString())
            const derived = wallet.derivePath(currentPath)

            return {
                path: currentPath,
                address: this.getAddressFromPublic(
                    this.getPublicKey(derived.publicKey.toString('hex')),
                ),
                publicKey: this.getPublicKey(derived.publicKey.toString('hex')),
                privateKey: this.getPrivateKey(derived),
            }
        })
    }

    derivateFromPublic(
        masterPublicKey: string,
        cursor: PathCursor,
    ): KeysWithPath[] {
        const wallet = bip32.fromBase58(masterPublicKey, this.networkConfig)
        const indexes = getIndexes(cursor.skip, cursor.limit)
        const path = preparePath(cursor.path || this.defaultPath)

        return indexes.map(index => {
            const currentPath = path.replace('{index}', index.toString())
            const pathParts = currentPath
                .replace(getHardenedPath(path), '')
                .split('/')
                .filter(part => part)
                .map(part => parseInt(part))

            const derived = this.deriveRecursive(wallet, pathParts)

            return {
                path: currentPath,
                address: this.getAddressFromPublic(
                    this.getPublicKey(derived.publicKey.toString('hex')),
                ),
                publicKey: this.getPublicKey(derived.publicKey.toString('hex')),
            }
        })
    }

    sign(data: string, privateKey: string, isTx = true): string {
        if (isTx) {
            const dataObj = JSON.parse(data)
            const mapPrivateKeys = JSON.parse(privateKey)
            let signedHex = ''
            const tx = new lib.Psbt({ network: this.networkConfig })
            for (const input of dataObj.inputs) {
                if (input.type.includes('witness')) {
                    tx.addInput({
                        hash: input.txId,
                        index: input.n,
                        witnessUtxo: {
                            script: Buffer.from(input.scriptPubKeyHex, 'hex'),
                            value: +input.value,
                        },
                    })
                } else {
                    tx.addInput({
                        hash: input.txId,
                        index: input.n,
                        nonWitnessUtxo: Buffer.from(input.hex, 'hex'),
                    })
                }
            }
            for (const output of dataObj.outputs) {
                tx.addOutput({
                    address: output.address,
                    value: +output.amount,
                })
            }

            for (const [index, input] of dataObj.inputs.entries()) {
                const keyPair = lib.ECPair.fromWIF(
                    mapPrivateKeys[input.address],
                    this.networkConfig,
                )
                tx.signInput(index, keyPair)
                tx.validateSignaturesOfInput(index)
            }
            tx.finalizeAllInputs()
            signedHex = tx.extractTransaction().toHex()
            return signedHex
        }

        const key = ECPair.fromWIF(privateKey, this.networkConfig)
        const hash = createHash('sha256')
            .update(data)
            .digest('hex')

        return key.sign(Buffer.from(hash, 'hex')).toString('hex')
    }

    checkSign(publicKey: string, data: string, sign: string): boolean {
        const key = ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'), {
            network: this.networkConfig,
        })
        const hash = createHash('sha256')
            .update(data)
            .digest('hex')

        return key.verify(Buffer.from(hash, 'hex'), Buffer.from(sign, 'hex'))
    }

    getMasterAddressFromSeed(seed: string, path?: string): MasterKeys {
        const hdkey = bip32.fromSeed(
            Buffer.from(seed, 'hex'),
            this.networkConfig,
        )

        const hdnode = hdkey.derivePath(
            getHardenedPath(path || this.defaultPath),
        )

        return {
            masterPrivateKey: hdkey.toBase58(),
            masterPublicKey: hdkey.neutered().toBase58(),
            masterAccountPrivateKey: hdnode.toBase58(),
            masterAccountPublicKey: hdnode.neutered().toBase58(),
        }
    }

    getPublicFromPrivate(privateKey: string, isWIF = true): string {
        let key
        if (isWIF) {
            key = ECPair.fromWIF(privateKey, this.networkConfig)
        } else {
            key = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
        }
        return key.publicKey.toString('hex')
    }

    getAddressFromPublic(
        publicKey: string,
        format?: string, // 'base58' | 'bech32' = 'base58'
    ): string {
        if (format && format === 'bech32') {
            return (
                payments.p2wpkh({
                    pubkey: Buffer.from(publicKey, 'hex'),
                    network: this.networkConfig,
                }).address ?? ''
            )
        }

        return (
            payments.p2pkh({
                pubkey: Buffer.from(publicKey, 'hex'),
                network: this.networkConfig,
            }).address ?? ''
        )
    }

    isValidAddress(address: string, format?: string): boolean {
        if (!address) {
            return false
        }

        if (!format) {
            return this.isValidAddress(address, this.getFormat(address))
        } else {
            if (format.toLowerCase() === 'bech32') {
                return isValidBech32Address(address)
            } else if (format.toLowerCase() === 'base58') {
                return isValidBase58Address(address)
            } else {
                return false
            }
        }
    }

    getFormat(address: string): string {
        if (decodeBase58(address)) {
            return 'base58'
        }

        if (decodeBech32(address)) {
            return 'bech32'
        }

        throw new Error('Invalid address')
    }
}
