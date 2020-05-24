import * as bip39 from 'bip39';

export const validateMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic);
};

export const mnemonicToSeedHex = (mnemonic: string, password?: string) => {
  return bip39.mnemonicToSeedSync(mnemonic, password).toString('hex');
};

export const generateMnemonic = (length: 12 | 24, lang = 'english') => {
  let strength = 128;
  if (length === 24) {
    strength = 256;
  } else if (length !== 12) {
    throw new Error('Wrong mnemonic length');
  }
  bip39.setDefaultWordlist(lang);
  const mnemonic = bip39.generateMnemonic(strength);
  return mnemonic;
};
