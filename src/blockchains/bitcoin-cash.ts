import { BitcoinBase } from './bitcoin-base'
import { bitcoin } from '../network-configs'
import { Network, Blockchain } from '../types'
import {
    toCashAddress,
    toBitpayAddress,
    isValidAddress as IsValidBCHAddress,
} from 'bchaddrjs'
import { signBSV } from 'bitcoinjs-lib'
import { TransactionForSign } from './bitcoinsv'

export class BitcoinCash extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.BITCOIN_CASH,
            network: Network.MAINNET,
            path: "m/44'/145'/0'",
            config: bitcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.BITCOIN_CASH,
            network: Network.TESTNET,
            path: "m/44'/1'/0'",
            config: bitcoin.testnet,
        },
    }
    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
    }
    getAddressFromPublic(
        publicKey: string,
        format?: string, // legacy | bitpay | cashaddr = cashaddr
    ): string {
        const legacy = super.getAddressFromPublic(publicKey)
        let address = toCashAddress(legacy)
        if (format === 'legacy') {
            address = legacy
        }
        if (format === 'bitpay') {
            address = toBitpayAddress(address)
        }
        return address
    }

    isValidAddress(address: string): boolean {
        return IsValidBCHAddress(address)
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
        }> = dataObj.inputs.map(input => {
            if (
                input.scriptPubKeyHex === undefined ||
                input.txId === undefined ||
                input.value === undefined ||
                input.n === undefined
            ) {
                throw new Error(`Wrong input: ${JSON.stringify(input)}`);
            }
            return {
                txId: input.txId,
                index: input.n,
                script: input.scriptPubKeyHex,
                address: input.address,
                amount: parseFloat(input.value),
            }
        })
        const outputs: Array<{
            address: string
            amount: number
        }> = dataObj.outputs.map(output  => {
            if (output.amount === undefined || output.address === undefined) {
                throw new Error(`Wrong output: ${JSON.stringify(output)}`);
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
