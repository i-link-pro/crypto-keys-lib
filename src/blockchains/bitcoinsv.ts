import { bitcoinsv } from '../network-configs'
import { Network, Blockchain } from '../types'
import { BitcoinSvBase } from './bsv-base'

export class BitcoinSV extends BitcoinSvBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.BSV,
            network: Network.MAINNET,
            path: "m/44'/236'/0'",
            config: bitcoinsv.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.BSV,
            network: Network.TESTNET,
            path: "m/44'/1'/0'",
            config: bitcoinsv.testnet,
        },
    }
    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
    }
}
