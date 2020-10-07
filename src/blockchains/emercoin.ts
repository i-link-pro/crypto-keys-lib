import { BitcoinBase } from './bitcoin-base'
import { emercoin } from '../network-configs'
import { Network, Blockchain } from '../types'
import { TransactionBuilder,Transaction, ECPair} from 'bitcoinjs-lib'

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

    async sign(data: string, privateKey: string, isTx: boolean = true): Promise<string> {

        let dataObj
        let mapPrivateKeys
        try {
            dataObj = JSON.parse(data)
            mapPrivateKeys = JSON.parse(privateKey)
        } catch (err) {
            throw new Error('Invalid data or key, must be json string')
        }
        let signedHex = ''

        const finalTx = Transaction.fromHex(dataObj.inputs[0].hex, this.networkConfig)
        const txb = TransactionBuilder.fromTransaction(finalTx)
        const keyPair2 = ECPair.fromWIF(
            mapPrivateKeys[dataObj.inputs[0].address],
            this.networkConfig,
        )
        //console.log(9999,keyPair2)

        return signedHex;
    }
}
