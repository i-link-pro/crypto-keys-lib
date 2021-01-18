import { BitcoinBase } from './bitcoin-base'
import { dashcoin } from '../network-configs'
import { Network, Blockchain } from '../types'
import addressValidator from 'wallet-address-validator'

export class Dashcoin extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.DASH,
            network: Network.MAINNET,
            path: "m/44'/5'/0'",
            config: dashcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.DASH,
            network: Network.TESTNET,
            path: "m/44'/1'/0'",
            config: dashcoin.testnet,
        },
    }
    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
    }
    isValidAddress(address: string, format?: string): boolean {
        if (!address) {
            return false
        }
        return addressValidator.validate(address, 'DASH')
    }
}
