import HDKey from 'hdkey';
import { payments, ECPair } from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import createHash from 'create-hash';
import { PathCursor } from './keys.types';

const defaultPath = "m/44'/0'/0'/0/0";

const getIndexes = (skip: number, limit: number): number[] => {
  if (skip < 0) {
    throw Error('Skip must be greater or equal than zero');
  }

  if (limit < 1) {
    throw Error('Limit must be greater than zero');
  }

  return Array.from({ length: limit }, (v, k) => k + skip + 1);
};

const preparePath = (path: string): string => {
  const parts = path.split('/');
  parts.pop();
  parts.push('{index}');

  return parts.join('/');
};

const getHardenedPath = (path: string): string => {
  const parts = path
    .split('/')
    .filter(part => part === 'm' || part.indexOf("'") != -1);
    
  return parts.join('/');
};

const deriveRecursive = (
  derived: bip32.BIP32Interface,
  parts: number[],
): bip32.BIP32Interface => {
  if (parts.length) {
    const [part, ...leftParts] = parts;
    return deriveRecursive(derived.derive(part), leftParts);
  }

  return derived;
};

export const derivateFromPrivate = (
  masterPrivateKey: string,
  cursor: PathCursor,
) => {
  const wallet = bip32.fromBase58(masterPrivateKey);
  const indexes = getIndexes(cursor.skip, cursor.limit);
  const path = preparePath(cursor.path || defaultPath);

  return indexes.map(index => {
    const currentPath = path.replace('{index}', index.toString());
    const derived = wallet.derivePath(currentPath);

    return {
      path: currentPath,
      address: payments.p2pkh({ pubkey: derived.publicKey }).address,
      publicKey: derived.publicKey.toString('hex'),
      privateKey: derived.toWIF(),
    };
  });
};

export const derivateFromPublic = (
  masterPublicKey: string,
  cursor: PathCursor,
) => {
  const wallet = bip32.fromBase58(masterPublicKey);
  const indexes = getIndexes(cursor.skip, cursor.limit);
  const path = preparePath(cursor.path || defaultPath);

  return indexes.map(index => {
    const currentPath = path.replace('{index}', index.toString());
    const pathParts = currentPath
      .replace(getHardenedPath(path), '')
      .split('/')
      .filter(part => part)
      .map(part => parseInt(part));

    const derived = deriveRecursive(wallet, pathParts);

    return {
      path: currentPath,
      address: payments.p2pkh({ pubkey: derived.publicKey }).address,
      publicKey: derived.publicKey.toString('hex'),
    };
  });
};

export const sign = (data: string, privateKey: string): string => {
  const key = ECPair.fromWIF(privateKey);
  const hash = createHash('sha256')
    .update(data)
    .digest('hex');

  return key.sign(Buffer.from(hash, 'hex')).toString('hex');
};

export const checkSign = (
  publicKey: string,
  data: string,
  sign: string,
): boolean => {
  const key = ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'));
  const hash = createHash('sha256')
    .update(data)
    .digest('hex');

  return key.verify(Buffer.from(hash, 'hex'), Buffer.from(sign, 'hex'));
};

export function getMasterAddressFromSeed(seed: string, path?: string) {
  const hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
  const hdnode = hdkey.derive(getHardenedPath(path || defaultPath));

  return {
    masterPrivateKey: hdkey.toJSON().xpriv,
    masterPublicKey: hdnode.toJSON().xpub,
  };
}

export const getPublicFromPrivate = (privateKey: string): string => {
  const key = ECPair.fromWIF(privateKey);
  return key.publicKey.toString('hex');
};

export const getAddressFromPublic = (
  publicKey: string,
  format?: string, // 'base58' | 'bech32' = 'base58'
): string => {
  
  if (format && format === 'bech32') {
    return payments.p2wpkh({ pubkey: Buffer.from(publicKey, 'hex') }).address;
  }

  return payments.p2pkh({ pubkey: Buffer.from(publicKey, 'hex') }).address;
};
