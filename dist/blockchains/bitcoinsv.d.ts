import { BitcoinBase } from './bitcoin-base';
import { Network, Blockchain } from '../types';
export interface UnsignedInput {
    txId?: string;
    hex?: string;
    n?: number;
    sum?: string;
    address: string;
    type?: string;
    scriptPubKeyHex?: string;
    json?: string;
}
export interface UnsignedOutput {
    address?: string;
    amount?: string;
}
export interface TransactionForSign {
    sum: string;
    fee: string;
    inputs: UnsignedInput[];
    outputs: UnsignedOutput[];
    json?: string;
}
export declare class BitcoinSV extends BitcoinBase {
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
    sign(data: string, keysMap: string): Promise<string>;
}
