import { BitcoinBase } from './bitcoin-base';
import { Network, Blockchain } from '../types';
export declare class Emercoin extends BitcoinBase {
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
    isValidAddress(address: string, format?: string): boolean;
}
