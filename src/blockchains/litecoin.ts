import { BitcoinBase } from './bitcoin-base'
import { litecoin } from '../network-configs'
import { Network, Blockchain } from '../types'

export class Litecoin extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.LTC,
            network: Network.MAINNET,
            path: "m/44'/2'/0'",
            config: litecoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.LTC,
            network: Network.TESTNET,
            path: "m/44'/1'/0'",
            config: litecoin.testnet,
        },
    }
    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
    }
}
