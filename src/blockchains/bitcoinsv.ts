import { BitcoinBase } from './bitcoin-base'
import { bitcoinsv } from '../network-configs'
import { Network, Blockchain } from '../types'
import { signBSV } from 'bitcoinjs-lib'

export interface UnsignedInput {
    txId?: string
    hex?: string
    n?: number
    sum?: string
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

    async sign(data: string, keysMap: string): Promise<string> {
        let dataObj: TransactionForSign, privateKeys: string[]
        try {
            dataObj = JSON.parse(data)
            const parsedKeysMap: Record<string, string> = JSON.parse(keysMap)
            privateKeys = Object.values(parsedKeysMap)
        } catch (e) {
            throw new Error(`data must be a JSON string: ${e.toLocaleString()}`)
        }
        const inputs: Array<{
            txId: string
            address: string
            amount: number
            script: string
            index: number
        }> = dataObj.inputs.map((input, index) => {
            if (
                input.scriptPubKeyHex === undefined ||
                input.txId === undefined ||
                input.sum === undefined
            ) {
                return null
            }
            return {
                txId: input.txId,
                index,
                script: input.scriptPubKeyHex,
                address: input.address,
                amount: parseFloat(input.sum),
            }
        })
        const outputs: Array<{
            address: string
            amount: number
        }> = dataObj.outputs.map(output => {
            if (output.amount === undefined || output.address === undefined) {
                return null
            }
            return {
                address: output.address,
                amount: parseFloat(output.amount),
            }
        })
        const transaction = {
            inputs,
            outputs,
            sum: parseFloat(dataObj.sum),
            fee: parseFloat(dataObj.fee),
            keyPairs: privateKeys.map(key => ({ privateKey: key })),
        }
        return signBSV(transaction)
    }
}
