import { BitcoinBase } from './bitcoin-base'
import { Network, Blockchain } from '../types'
import { bitcoin } from '../network-configs'
import * as rippleKeyPair from 'ripple-keypairs'
import * as rippleUtil from 'ripple-address-codec'
import createHash from 'create-hash'
import { ECPair } from 'bitcoinjs-lib'

export class Ripple extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.RIPPLE,
            network: Network.MAINNET,
            path: "m/44'/144'/0'",
            config: bitcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.RIPPLE,
            network: Network.TESTNET,
            path: "m/44'/1'/0'",
            config: bitcoin.testnet,
        },
    }
    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
    }

    // format: classic | xaddress = xaddress
    getAddressFromPublic(publicKey: string, format?: string): string {
        const classicAddress = rippleKeyPair.deriveAddress(publicKey)
        if (format === 'classic') {
            return classicAddress
        }
        const xAddress = rippleUtil.classicAddressToXAddress(
            classicAddress,
            false,
            false,
        )
        if (xAddress === undefined) {
            throw new Error('Unknown error deriving address')
        }
        return xAddress
    }

    // todo: rewrite sign https://github.com/xpring-eng/xpring-common-js/blob/master/src/XRP/signer.ts#L20
    async sign(data: string, privateKey: string): Promise<string> {
        const key = ECPair.fromWIF(privateKey, this.networkConfig)
        const hash = createHash('sha256')
            .update(data)
            .digest('hex')
        if (key.privateKey) {
            return rippleKeyPair.sign(hash, key.privateKey.toString('hex'))
        } else {
            throw Error('Invalid private key')
        }
    }

    checkSign(publicKey: string, data: string, sign: string): boolean {
        const hash = createHash('sha256')
            .update(data)
            .digest('hex')
        return rippleKeyPair.verify(hash, sign, publicKey)
    }

    isValidAddress(address: string): boolean {
        return (
            rippleUtil.isValidXAddress(address) ||
            rippleUtil.isValidClassicAddress(address)
        )
    }
}
