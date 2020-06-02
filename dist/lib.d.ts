import { IKeys, Blockchain, Network, SeedDictionaryLang, SeedWithKeys, FromSeedPhrase, FromMasterPublicKey, FromMasterPrivateKey, PathCursor, KeysWithPath, PrivateKey, PublicKey, Address, Path } from './types';
export declare class Keys implements IKeys {
    private lib;
    constructor(blockchain: Blockchain, network: Network);
    private getMasterFromSeed;
    private isSeed;
    private isMasterPrivate;
    generateSeedPhrase(wordCount: 12 | 24, lang?: SeedDictionaryLang, path?: string, password?: string): SeedWithKeys | Error;
    getDataFromSeed(seedPhrase: string, path?: string, password?: string): SeedWithKeys | Error;
    derivateKeys(from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey, pathCursor: PathCursor): KeysWithPath[] | Error;
    sign(data: string, privateKey: PrivateKey): string | Error;
    getPublicFromPrivate(privateKey: PrivateKey): PublicKey | Error;
    getAddressFromPublic(publicKey: PublicKey, format?: string): Address | Error;
    checkSign(publicKey: PublicKey, data: string, sign: string): boolean | Error;
    checkSeedPhrase(seedPhrase: string): boolean | Error;
    getDefaultPaths(): Path[];
}
