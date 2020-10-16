import { BitcoinBase } from './bitcoin-base'
import { emercoin } from '../network-configs'
import { Network, Blockchain } from '../types'
import { TransactionBuilder, Transaction, ECPair } from 'bitcoinjs-lib'

export class Emercoin extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.EMERCOIN,
            network: Network.MAINNET,
            path: "m/44'/6'/0'",
            config: emercoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.EMERCOIN,
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
}
