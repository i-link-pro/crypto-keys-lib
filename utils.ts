import * as bip39 from "bip39";
import createHash from "create-hash";

export const validateMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic);
};

export const mnemonicToSeedHex = (mnemonic: string) => {
  return bip39.mnemonicToSeedSync(mnemonic).toString('hex');
};

export const lpad = (str: string, padString: string, length: number) => {
  while (str.length < length) {
    str = padString + str;
  }

  return str;
};

export const binaryToByte = (bin: any) => {
  return parseInt(bin, 2);
};

export const deriveChecksumBits = (entropyBuffer: any) => {
  var ENT = entropyBuffer.length * 8;
  var CS = ENT / 32;
  var hash = createHash("sha256").update(entropyBuffer).digest();

  return bytesToBinary([].slice.call(hash)).slice(0, CS);
};

export const bytesToBinary = (bytes: any) => {
  return bytes
    .map((x: any) => {
      return lpad(x.toString(2), "0", 8);
    })
    .join("");
};

export const generateMnemonic = (length: number) => {
  let strength = 128;
  if (length === 24) {
    strength = 256;
  } else if (length !== 12) {
    throw new Error("Wrong mnemonic length");
  }
  const mnemonic = bip39.generateMnemonic(strength);
  return mnemonic;
};