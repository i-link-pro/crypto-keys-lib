import { BitcoinBase } from './bitcoin-base'
import { Network, Blockchain } from './keys.types'
import { bitcoin } from './network-configs'
import * as eosUtil from 'eosjs-ecc'
import { BIP32Interface } from 'bip32'

export class EOS extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.EOS,
            network: Network.MAINNET,
            path: "m/44'/194'/0'/0/0",
            config: bitcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.EOS,
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

    getPublicFromPrivate(privateKey: string): string {        
        return eosUtil.privateToPublic(privateKey)
    }

    getPrivateKey(privateKey: BIP32Interface): string {
        return eosUtil.PrivateKey(privateKey.privateKey).toWif()
    }

    getPublicKey(publicKey: string): string {
        return eosUtil.PublicKey(Buffer.from(publicKey, 'hex')).toString()
    }

    getAddressFromPublic(publicKey: string): string {
        return publicKey
    }
}
