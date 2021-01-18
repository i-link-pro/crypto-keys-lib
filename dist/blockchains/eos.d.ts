import { BitcoinBase } from './bitcoin-base';
import { Network, Blockchain } from '../types';
import { BIP32Interface } from 'bip32';
export declare class EOS extends BitcoinBase {
    protected networks: {
        mainnet: {
            blockchain: Blockchain;
            network: Network;
            path: string;
            config: import("../network-configs").Network;
        };
        testnet: {
            blockchain: Blockchain;
            network: Network;
            path: string;
            config: import("../network-configs").Network;
        };
    };
    constructor(network: Network);
    getPublicFromPrivate(privateKey: string): string;
    getPrivateKey(privateKey: BIP32Interface): string;
    getPublicKey(publicKey: string): string;
    getAddressFromPublic(publicKey: string): string;
    sign(data: string, privateKey: string, isTx: any): Promise<string>;
    checkSign(publicKey: string, data: string, sign: string): boolean;
    isValidAddress(address: string): boolean;
}
