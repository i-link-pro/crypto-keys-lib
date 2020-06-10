
import * as assert from 'assert';
import { describe, it } from 'mocha';
import { Keys } from '../src/lib';
import { Network, Blockchain } from '../src/types'
import { BitcoinBase } from '../src/blockchains/bitcoin-base';
import { TEST_VECTORS } from './fixtures/vectors';


describe('BitcoinBase', () => {
  const instance = new BitcoinBase(Network.TESTNET);
  describe('getMasterAddressFromSeed', () => {
    TEST_VECTORS.forEach((vector) => {
      const actual = instance.getMasterAddressFromSeed(vector.seed);
      it(`should be generate correct public key ${vector.masterPublicKey}`, () => {
        assert.strictEqual(actual['masterPublicKey'], vector.masterPublicKey);
      });
      it(`should be generate correct private key ${vector.masterPrivateKey}`, () => {
        assert.strictEqual(actual['masterPrivateKey'], vector.masterPrivateKey);
      });
    })
  });
})

describe('Lib', () => {
  const instance = new Keys(Blockchain.BITCOIN, Network.MAINNET);
  describe('getDataFromSeed/generateSeedPhrase', () => {
    const seed = instance.generateSeedPhrase(12);
    const actual = instance.getDataFromSeed(seed['seedPhrase']);
    it(`should be return ${seed['seedPhrase']}`, () => {
      assert.strictEqual(actual['seedPhrase'], seed['seedPhrase']);
    });

    it(`should be return ${seed['seedPhrase']}`, () => {
      assert.strictEqual(actual['masterPublicKey'], seed['masterPublicKey']);
    });

    it(`should be return ${seed['masterPrivateKey']}`, () => {
      assert.strictEqual(actual['masterPrivateKey'], seed['masterPrivateKey']);
    });
  });

  describe('getDefaultPaths', () => {
    const actualPaths = instance.getDefaultPaths();
    it('should return exact paths', () => {
      const expectedPaths = [{
        blockchain: 'bitcoin',
        network: 'mainnet',
        path: 'm/44\'/0\'/0\'/0/0'
      },
      {
        blockchain: 'bitcoin',
        network: 'testnet',
        path: 'm/44\'/1\'/0\'/0/0'
      }];
      assert.deepEqual(actualPaths, expectedPaths);
    });
  });

  describe('checkSeedPhrase', () => {
    const seedPhrase = 'crouch congress lake quantum smoke play glove firm pony capital wise cream';
    const actual = instance.checkSeedPhrase(seedPhrase);
    it('should return `true`', () => {
      assert.strictEqual(actual, true);
    });
  });

  describe('derivateKeys', () => {
    const cursor = {
      skip: 1,
      limit: 1
    }
    const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U' }
    const actual = instance.derivateKeys(masterPrivateKey, cursor);
    const expected = [
      {
        path: "m/44'/0'/0'/0/2",
        address: '1Nb924nRs93gWVeFnaKH1EE8uLqWGfdkXE',
        publicKey: '02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38',
        privateKey: 'L58PscmN5Ee1u2t4oCvZNq1YF9rtuwe19CospGwygyBfd3aH7zYy'
      }
    ];
    it(`should be return correct ${expected[0]['path']} path`, () => {
      assert.strictEqual(actual[0]['path'], expected[0]['path']);
    });

    it(`should be return correct ${expected[0]['address']} address`, () => {
      assert.strictEqual(actual[0]['address'], expected[0]['address']);
    });

    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
      assert.strictEqual(actual[0]['publicKey'], expected[0]['publicKey']);
    });

    it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
      assert.strictEqual(actual[0]['privateKey'], expected[0]['privateKey']);
    });
  });

  describe('sign', () => {
    const masterPrivateKey = 'L58PscmN5Ee1u2t4oCvZNq1YF9rtuwe19CospGwygyBfd3aH7zYy';
    const actual = instance.sign('fake_data', masterPrivateKey);
    it(`should be return 8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f`, () => {
      assert.strictEqual(actual, '8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f');
    });
  });

  describe('getPublicFromPrivate', () => {
    const masterPrivateKey = 'L58PscmN5Ee1u2t4oCvZNq1YF9rtuwe19CospGwygyBfd3aH7zYy';
    const actual = instance.getPublicFromPrivate(masterPrivateKey);
    it(`should be return 02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38`, () => {
      assert.strictEqual(actual, '02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38');
    });
  });

  describe('getAddressFromPublic', () => {
    const publicKey = '02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38';
    const actual = instance.getAddressFromPublic(publicKey);
    it(`should be return 1Nb924nRs93gWVeFnaKH1EE8uLqWGfdkXE`, () => {
      assert.strictEqual(actual, '1Nb924nRs93gWVeFnaKH1EE8uLqWGfdkXE');
    });
  });

  describe('checkSign', () => {
    const actual = instance.checkSign('02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38', 'fake_data', '8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f');
    it('should be return `true`', () => {
      assert.strictEqual(actual, true);
    });
  });
})