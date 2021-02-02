import { BitcoinBase } from './bitcoin-base';
import { Network, Blockchain } from '../types';
import * as bip32 from 'bip32';
export declare class Ripple extends BitcoinBase {
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
    protected getPrivateKey(privateKey: bip32.BIP32Interface): string;
    getAddressFromPublic(publicKey: string, format?: string): string;
    sign(data: string, privateKey: string, isTx: boolean): Promise<string>;
    checkSign(publicKey: string, data: string, sign: string): boolean;
    isValidAddress(address: string): boolean;
}
