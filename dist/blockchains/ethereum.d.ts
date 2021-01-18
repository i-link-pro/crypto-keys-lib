import { BitcoinBase } from './bitcoin-base';
import { Blockchain, Network } from '../types';
import { BIP32Interface } from 'bip32';
export declare class Ethereum extends BitcoinBase {
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
    private net;
    constructor(network: Network);
    getPublicFromPrivate(privateKey: string): string;
    getPrivateKey(privateKey: BIP32Interface): string;
    getPublicKey(publicKey: string): string;
    getAddressFromPublic(publicKey: string): string;
    sign(data: string, privateKey: string, isTx?: boolean): Promise<string>;
    checkSign(_: string, __: string, sign: string): boolean;
    isValidAddress(address: string): boolean;
}
