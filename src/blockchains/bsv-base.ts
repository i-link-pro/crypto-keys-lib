import { BitcoinBase } from './bitcoin-base'
import { Network } from '../types'
import { signBSV } from 'bitcoinjs-lib'

export interface UnsignedInput {
    txId: string
    hex?: string
    n?: number
    value?: string
    address: string
    type?: string
    scriptPubKeyHex?: string
    json?: string
    amount: number
    index: number
    script: string
}

export interface UnsignedOutput {
    address: string
    amount: number
}

export interface TransactionForSign {
    sum: string
    fee: string
    inputs: UnsignedInput[]
    outputs: UnsignedOutput[]
    json?: string
}

export class BitcoinSvBase extends BitcoinBase {
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
        const inputs: Array<UnsignedInput> = dataObj.inputs.map(input => {
            if (
                input.scriptPubKeyHex === undefined ||
                input.txId === undefined ||
                input.value === undefined ||
                input.n === undefined
            ) {
                throw new Error(`Wrong input: ${JSON.stringify(input)}`)
            }
            return {
                txId: input.txId,
                index: input.n,
                script: input.scriptPubKeyHex,
                address: input.address,
                amount: parseFloat(input.value),
            }
        })
        const outputs: Array<UnsignedOutput> = dataObj.outputs.map(output => {
            if (output.amount === undefined || output.address === undefined) {
                throw new Error(`Wrong output: ${JSON.stringify(output)}`)
            }
            return {
                address: output.address,
                amount: parseFloat(output.amount.toString()),
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
