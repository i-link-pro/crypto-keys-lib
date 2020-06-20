import HDKey from 'hdkey'
import { payments, ECPair } from 'bitcoinjs-lib'
import * as bip32 from 'bip32'
import createHash from 'create-hash'
import { PathCursor, Blockchain, Network, Path } from '../types'
import { getIndexes, preparePath, getHardenedPath } from '../utils'
import { bitcoin, Network as NetworkConfig } from '../network-configs'

export class BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.BITCOIN,
            network: Network.MAINNET,
            path: "m/44'/0'/0'/0/0",
            config: bitcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.BITCOIN,
            network: Network.TESTNET,
            path: "m/44'/1'/0'/0/0",
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

    derivateFromPrivate(masterPrivateKey: string, cursor: PathCursor) {
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

    derivateFromPublic(masterPublicKey: string, cursor: PathCursor) {
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

    sign(data: string, privateKey: string): string {
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

    getMasterAddressFromSeed(
        seed: string,
        path?: string,
    ): {
        masterPrivateKey: string
        masterPublicKey: string
    } {
        const hdkey = HDKey.fromMasterSeed(
            Buffer.from(seed, 'hex'),
            this.networkConfig.bip32,
        )
        // const hdnode = hdkey.derive(getHardenedPath(path || this.defaultPath))

        return {
            masterPrivateKey: hdkey.toJSON().xpriv,
            masterPublicKey: hdkey.toJSON().xpub,
            // masterPublicKey: hdnode.toJSON().xpub,
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
}
