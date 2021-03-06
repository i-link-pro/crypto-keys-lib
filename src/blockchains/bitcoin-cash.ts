import { bitcoin } from '../network-configs'
import { Network, Blockchain } from '../types'
import {
    toCashAddress,
    toBitpayAddress,
    isValidAddress as IsValidBCHAddress,
} from 'bchaddrjs'
import { BitcoinSvBase } from './bsv-base'

export class BitcoinCash extends BitcoinSvBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.BCH,
            network: Network.MAINNET,
            path: "m/44'/145'/0'",
            config: bitcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.BCH,
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
    getAddressFromPublic(
        publicKey: string,
        format?: string, // legacy | bitpay | cashaddr = cashaddr
    ): string {
        const legacy = super.getAddressFromPublic(publicKey)
        let address = toCashAddress(legacy)
        if (format === 'legacy') {
            address = legacy
        }
        if (format === 'bitpay') {
            address = toBitpayAddress(address)
        }
        return address
    }

    isValidAddress(address: string): boolean {
        return IsValidBCHAddress(address)
    }
}
