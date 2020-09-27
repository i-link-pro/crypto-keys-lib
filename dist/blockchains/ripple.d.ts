import { BitcoinBase } from './bitcoin-base';
import { Network, Blockchain } from '../types';
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
    getAddressFromPublic(publicKey: string, format?: string): string;
    sign(data: string, privateKey: string): Promise<string>;
    checkSign(publicKey: string, data: string, sign: string): boolean;
    isValidAddress(address: string): boolean;
}
