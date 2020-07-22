import { BitcoinBase } from './bitcoin-base'
import { Blockchain, Network } from '../types'
import { bitcoin } from '../network-configs'
import * as ethUtil from 'ethereumjs-util'
import { BIP32Interface } from 'bip32'

const ethTx = require('ethereumjs-tx').Transaction

export class Ethereum extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.ETHEREUM,
            network: Network.MAINNET,
            path: "m/44'/60'/0'/0/0",
            config: bitcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.ETHEREUM,
            network: Network.TESTNET,
            path: "m/44'/1'/0'/0/0",
            config: bitcoin.testnet,
        },
    }
    private net: Network

    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
        this.net = network
    }

    getPublicFromPrivate(privateKey: string): string {
        return ethUtil.addHexPrefix(
            super.getPublicFromPrivate(privateKey.replace('0x', ''), false),
        )
    }

    getPrivateKey(privateKey: BIP32Interface): string {
        if (privateKey.privateKey) {
            return ethUtil.bufferToHex(privateKey.privateKey)
        } else {
            throw new Error('Invalid private key')
        }
    }

    getPublicKey(publicKey: string): string {
        return ethUtil.addHexPrefix(publicKey)
    }

    getAddressFromPublic(publicKey: string): string {
        const ethPubkey = ethUtil.importPublic(
            Buffer.from(publicKey.replace('0x', ''), 'hex'),
        )
        const addressBuffer = ethUtil.publicToAddress(ethPubkey)
        const hexAddress = ethUtil.addHexPrefix(addressBuffer.toString('hex'))
        const checksumAddress = ethUtil.toChecksumAddress(hexAddress)
        const address = ethUtil.addHexPrefix(checksumAddress)
        return address
    }

    sign(data: string, privateKey: string, isTx = true): string {
        if (isTx) {
            const chain = this.net === Network.MAINNET ? 'mainnet' : 'ropsten'
            const transactionObject = JSON.parse(data)
            const txRaw = new ethTx(transactionObject, { chain: chain })
            const pk = Buffer.from(privateKey.replace('0x', ''), 'hex')
            txRaw.sign(pk)
            return `0x${txRaw.serialize().toString('hex')}`
        }

        const hash = ethUtil.hashPersonalMessage(Buffer.from(data))
        const sign = ethUtil.ecsign(
            hash,
            Buffer.from(privateKey.replace('0x', ''), 'hex'),
        )
        return JSON.stringify({
            r: sign.r.toString('hex'),
            s: sign.s.toString('hex'),
            v: sign.v,
        })
    }

    checkSign(_: string, __: string, sign: string): boolean {
        const signObject = JSON.parse(sign)

        return ethUtil.isValidSignature(
            parseInt(signObject.v),
            Buffer.from(signObject.r, 'hex'),
            Buffer.from(signObject.s, 'hex'),
        )
    }

    isValidAddress(address: string): boolean {
        return ethUtil.isValidAddress(address)
    }
}
