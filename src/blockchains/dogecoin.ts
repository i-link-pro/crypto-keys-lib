import { BitcoinBase } from './bitcoin-base'
import { dogecoin } from '../network-configs'
import { Network, Blockchain } from '../types'

export class Dogecoin extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.DOGECOIN,
            network: Network.MAINNET,
            path: "m/44'/2'/0'",
            config: dogecoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.DOGECOIN,
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
}
