import { Network, Blockchain } from '../types';
import { BitcoinSvBase } from './bsv-base';
export declare class BitcoinSV extends BitcoinSvBase {
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
}
