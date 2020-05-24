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
} from "./keys.types";

import { generateMnemonic, validateMnemonic, mnemonicToSeedHex } from "./utils";
import { getAddressFromSeed } from "./bitcoin";

export class Keys implements IKeys {
  constructor(blockchain: Blockchain, network: Network) {
    // Load params from dicts
  }

  generateSeedPhrase(
    wordCount: number,
    lang?: SeedDictionaryLang,
    password?: string
  ): SeedWithKeys | Error {
    const seedPhrase = generateMnemonic(wordCount);
    const seed = mnemonicToSeedHex(seedPhrase);
    const keys = getAddressFromSeed(seed);
    return {
      seedPhrase,
      seed,
      ...keys,
    };
  }
  getDataFromSeed(seedPhrase: string): SeedWithKeys | Error {
    throw Error("not implemented");
  }
  derivateKeys(
    from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
    pathCursor: PathCursor
  ): [KeysWithPath] | Error {
    throw Error("not implemented");
  }
  sign(data: string, privateKey: PrivateKey): string | Error {
    throw Error("not implemented");
  }
  getPublicFromPrivate(privateKey: PrivateKey): PublicKey | Error {
    throw Error("not implemented");
  }
  getAddressFromPublic(publicKey: PublicKey, format?: string): Address | Error {
    throw Error("not implemented");
  }
  checkSign(publicKey: PublicKey, data: string, sign: string): boolean | Error {
    throw Error("not implemented");
  }
  checkSeedPhrase(seedPhrase: string): boolean | Error {
    return validateMnemonic(seedPhrase);
  }
  getDefaultPaths(): [Path] {
    return [
      {
        blockchain: Blockchain.BITCOIN,
        network: Network.MAINNET,
        path: "m/44'/0'/0'/0/1",
      },
    ];
  }
}


