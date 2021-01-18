import { Network, Blockchain } from '../types';
import { BitcoinSvBase } from './bsv-base';
export declare class BitcoinCash extends BitcoinSvBase {
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
}
