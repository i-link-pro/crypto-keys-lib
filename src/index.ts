import { Keys } from './lib';
import {
  Blockchain,
  Network,
  SeedDictionaryLang,
  SeedWithKeys,
} from './keys.types';

const keys = new Keys(Blockchain.BITCOIN, Network.MAINNET);
const privKey = 'Kx44mfmTaidMc4Kq1tmWJ3vV1ZjkoXPDnRKdFm2wWhb3LzjD2Vyp';
const adr = '1D3LsaTayUt9rzUgq1NTxRTuCfHjsN3tU3';
const path = "m/44'/0'/0'/0/0";
const publicKey =
  '022ab8756aff2712b9a81dfe51d53507ef199a1f8c5cc35ce9aee699a2507e9ddd';

// const sign = keys.sign('atata', privKey);
// console.log(keys.sign('atata', privKey));
// if (typeof sign === 'string') {
//   console.log(keys.checkSign(publicKey, 'atata', sign));
// }
// const seedWithKeys = keys.generateSeedPhrase(12);
// console.log(keys.checkSeedPhrase(seedWithKeys['seedPhrase']));
// console.log(keys.getPublicFromPrivate(privKey));
// console.log(keys.getAddressFromPublic(publicKey));
// console.log(keys.getAddressFromPublic(publicKey, 'bech32'));
// console.log(keys.generateSeedPhrase(12));
// console.log(keys.generateSeedPhrase(24));
// console.log(keys.generateSeedPhrase(24, SeedDictionaryLang.ITALIAN));
// console.log(keys.generateSeedPhrase(24, SeedDictionaryLang.ITALIAN, '123'));

const seedWithKeys = keys.generateSeedPhrase(12);
console.log(
  keys.derivateKeys(
    { seedPhrase: (seedWithKeys as SeedWithKeys).seedPhrase },
    { skip: 3, limit: 1, path },
  ),
);

console.log(
  keys.derivateKeys(
    { masterPrivateKey: (seedWithKeys as SeedWithKeys).masterPrivateKey },
    { skip: 3, limit: 1, path },
  ),
);

console.log(
  keys.derivateKeys(
    { masterPublicKey: (seedWithKeys as SeedWithKeys).masterPublicKey },
    { skip: 3, limit: 1, path },
  ),
);
