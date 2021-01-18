import { BitcoinBase } from './bitcoin-base'
import { dogecoin } from '../network-configs'
import { Network, Blockchain } from '../types'
import addressValidator from 'wallet-address-validator'

export class Dogecoin extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.DOGE,
            network: Network.MAINNET,
            path: "m/44'/3'/0'",
            config: dogecoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.DOGE,
            network: Network.TESTNET,
            path: "m/44'/1'/0'",
            config: dogecoin.testnet,
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
        return (
            addressValidator.validate(address, 'DOGE') ||
            addressValidator.validate(address, 'DOGE', 'testnet')
        )
    }
}
