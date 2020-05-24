import {
  IKeys,
  Blockchain,
  Network,
  SeedDictionaryLang,
  SeedWithKeys,
  FromSeedPhrase,
  FromMasterPublicKey,
  FromMasterPrivateKey,
  PathCursor,
  KeysWithPath,
  PrivateKey,
  PublicKey,
  Address,
  Path,
} from './keys.types';

import { generateMnemonic, validateMnemonic, mnemonicToSeedHex } from './utils';
import {
  getMasterAddressFromSeed,
  getPublicFromPrivate,
  getAddressFromPublic,
  sign,
  checkSign,
  derivateFromPrivate,
  derivateFromPublic,
} from './bitcoin';

export class Keys implements IKeys {
  constructor(blockchain: Blockchain, network: Network) {
    // Load params from dicts
  }

  private getMasterFromSeed(seedPhrase: string, path?: string, password?: string) {
    const seed = mnemonicToSeedHex(seedPhrase, password);
    const keys = getMasterAddressFromSeed(seed, path);
    return {
      seedPhrase,
      seed,
      ...keys,
    };
  }

  private isSeed(
    from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
  ): from is FromSeedPhrase {
    return (from as FromSeedPhrase).seedPhrase !== undefined;
  }

  private isMasterPrivate(
    from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
  ): from is FromMasterPrivateKey {
    return (from as FromMasterPrivateKey).masterPrivateKey !== undefined;
  }

  generateSeedPhrase(
    wordCount: 12 | 24,
    lang: SeedDictionaryLang = SeedDictionaryLang.ENGLISH,
    path?: string,
    password?: string,
  ): SeedWithKeys | Error {
    const seedPhrase = generateMnemonic(wordCount, lang);
    
    return this.getMasterFromSeed(seedPhrase, path, password);
  }

  getDataFromSeed(seedPhrase: string, path?: string, password?: string): SeedWithKeys | Error {
    return this.getMasterFromSeed(seedPhrase, path, password);
  }

  derivateKeys(
    from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
    pathCursor: PathCursor,
  ): KeysWithPath[] | Error {

    if (this.isSeed(from)) {
      const seedData = this.getMasterFromSeed(from.seedPhrase, from.password);
    
      return derivateFromPrivate(seedData.masterPrivateKey, pathCursor);
    } else if (this.isMasterPrivate(from)) {
    
      return derivateFromPrivate(from.masterPrivateKey, pathCursor);
    } else {
    
      return derivateFromPublic(from.masterPublicKey, pathCursor);
    }
  }

  sign(data: string, privateKey: PrivateKey): string | Error {
    return sign(data, privateKey);
  }

  getPublicFromPrivate(privateKey: PrivateKey): PublicKey | Error {
    return getPublicFromPrivate(privateKey);
  }

  getAddressFromPublic(publicKey: PublicKey, format?: string): Address | Error {
    return getAddressFromPublic(publicKey, format);
  }

  checkSign(publicKey: PublicKey, data: string, sign: string): boolean | Error {
    return checkSign(publicKey, data, sign);
  }

  checkSeedPhrase(seedPhrase: string): boolean | Error {
    return validateMnemonic(seedPhrase);
  }

  getDefaultPaths(): Path[] {
    return [
      {
        blockchain: Blockchain.BITCOIN,
        network: Network.MAINNET,
        path: "m/44'/0'/0'/0/0",
      },
    ];
  }
}
