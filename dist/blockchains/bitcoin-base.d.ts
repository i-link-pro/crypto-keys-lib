import * as bip32 from 'bip32';
import { PathCursor, Blockchain, Network, Path } from '../types';
import { Network as NetworkConfig } from '../network-configs';
export declare class BitcoinBase {
    protected networks: {
        mainnet: {
            blockchain: Blockchain;
            network: Network;
            path: string;
            config: NetworkConfig;
        };
        testnet: {
            blockchain: Blockchain;
            network: Network;
            path: string;
            config: NetworkConfig;
        };
    };
    protected defaultPath: string;
    protected networkConfig: NetworkConfig;
    constructor(network: Network);
    getPaths(): Path[];
    deriveRecursive(derived: bip32.BIP32Interface, parts: number[]): bip32.BIP32Interface;
    protected getPrivateKey(privateKey: bip32.BIP32Interface): string;
    protected getPublicKey(publicKey: string): string;
    derivateFromPrivate(masterPrivateKey: string, cursor: PathCursor): {
        path: string;
        address: string;
        publicKey: string;
        privateKey: string;
    }[];
    derivateFromPublic(masterPublicKey: string, cursor: PathCursor): {
        path: string;
        address: string;
        publicKey: string;
    }[];
    sign(data: string, privateKey: string): string;
    checkSign(publicKey: string, data: string, sign: string): boolean;
    getMasterAddressFromSeed(seed: string, path?: string): {
        masterPrivateKey: string;
        masterPublicKey: string;
    };
    getPublicFromPrivate(privateKey: string, isWIF?: boolean): string;
    getAddressFromPublic(publicKey: string, format?: string): string;
}