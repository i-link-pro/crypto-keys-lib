import { BitcoinBase } from './bitcoin-base';
import { Network, Blockchain } from '../types';
export declare class BitcoinCash extends BitcoinBase {
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
    isValidAddress(address: string): boolean;
    sign(data: string, keysMap: string): Promise<string>;
}
