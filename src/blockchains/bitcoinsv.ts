import { BitcoinBase } from './bitcoin-base'
import { bitcoinsv } from '../network-configs'
import { Network, Blockchain } from '../types'

export class BitcoinSV extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.BITCOIN_SV,
            network: Network.MAINNET,
            path: "m/44'/236'/0'/0/0",
            config: bitcoinsv.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.BITCOIN_SV,
            network: Network.TESTNET,
            path: "m/44'/1'/0'/0/0",
            config: bitcoinsv.testnet,
        },
    }
    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
    }
}
