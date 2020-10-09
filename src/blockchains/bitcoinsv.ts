import { BitcoinBase } from './bitcoin-base'
import { bitcoinsv } from '../network-configs'
import { Network, Blockchain } from '../types'
import { signBSV } from 'bitcoinjs-lib'

export interface UnsignedInput {
    txId?: string
    hex?: string
    n?: number
    value?: string
    address: string
    type?: string
    scriptPubKeyHex?: string
    json?: string
}

export interface UnsignedOutput {
    address?: string
    amount?: string
}

export interface TransactionForSign {
    sum: string
    fee: string
    inputs: UnsignedInput[]
    outputs: UnsignedOutput[]
    json?: string
}

export class BitcoinSV extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.BITCOIN_SV,
            network: Network.MAINNET,
            path: "m/44'/236'/0'",
            config: bitcoinsv.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.BITCOIN_SV,
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
