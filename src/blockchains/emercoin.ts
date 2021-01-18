import { BitcoinBase } from './bitcoin-base'
import { emercoin } from '../network-configs'
import { Network, Blockchain } from '../types'
import addressValidator from 'wallet-address-validator'

export class Emercoin extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.EMC,
            network: Network.MAINNET,
            path: "m/44'/6'/0'",
            config: emercoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.EMC,
            network: Network.TESTNET,
            path: "m/44'/6'/0'",
            config: emercoin.testnet,
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
            addressValidator.validate(address, 'EMC') ||
            addressValidator.validate(address, 'EMC', 'testnet')
        )
    }
}
