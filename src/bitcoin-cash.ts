import { BitcoinBase } from './bitcoin-base'
import { bitcoin } from './network-configs'
import { Network, Blockchain } from './keys.types'

export class BitcoinCash extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.BITCOIN_CASH,
            network: Network.MAINNET,
            path: "m/44'/145'/0'/0/0",
            config: bitcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.BITCOIN_CASH,
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
}
