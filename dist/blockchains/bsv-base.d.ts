import { BitcoinBase } from './bitcoin-base';
import { Network } from '../types';
export interface UnsignedInput {
    txId: string;
    hex?: string;
    n?: number;
    value?: string;
    address: string;
    type?: string;
    scriptPubKeyHex?: string;
    json?: string;
    amount: number;
    index: number;
    script: string;
}
export interface UnsignedOutput {
    address: string;
    amount: number;
}
export interface TransactionForSign {
    sum: string;
    fee: string;
    inputs: UnsignedInput[];
    outputs: UnsignedOutput[];
    json?: string;
}
export declare class BitcoinSvBase extends BitcoinBase {
    constructor(network: Network);
    sign(data: string, keysMap: string): Promise<string>;
}
