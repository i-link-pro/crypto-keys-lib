import { BitcoinBase } from './bitcoin-base'
import { Network, Blockchain } from './keys.types'
import { bitcoin } from './network-configs'
import * as ethUtil from 'ethereumjs-util'
import { BIP32Interface } from 'bip32'
import createHash from 'create-hash'

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
    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
    }

    getPublicFromPrivate(privateKey: string): string {
        return ethUtil.addHexPrefix(
            super.getPublicFromPrivate(privateKey.replace('0x', ''), false),
        )
    }

    getPrivateKey(privateKey: BIP32Interface): string {
        return ethUtil.bufferToHex(privateKey.privateKey)
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

    sign(data: string, privateKey: string): string {
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

    checkSign(publicKey: string, data: string, sign: string): boolean {
        const signObject = JSON.parse(sign)

        return ethUtil.isValidSignature(
            parseInt(signObject.v),
            Buffer.from(signObject.r, 'hex'),
            Buffer.from(signObject.s, 'hex'),
        )
    }
}
