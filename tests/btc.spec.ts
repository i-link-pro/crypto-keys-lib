
import * as assert from 'assert';
import * as sinon from 'sinon';
import { describe, it, after, before } from 'mocha';
import { Keys } from '../src/lib';
import { Network, Blockchain } from '../src/types'
import { BitcoinBase } from '../src/blockchains/bitcoin-base';
import { TEST_VECTORS } from './fixtures/vectors';


describe('BitcoinBase', () => {
  const instance = new BitcoinBase(Network.TESTNET);
  describe('#getMasterAddressFromSeed', () => {
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

describe('Lib/bitcoin', () => {
  const instance = new Keys(Blockchain.BITCOIN, Network.MAINNET);
  describe('#getDataFromSeed/generateSeedPhrase', () => {
    const seed = instance.generateSeedPhrase(12);
    const actual = instance.getDataFromSeed(seed['seedPhrase']);
    it(`should be return \`${seed['seedPhrase']}\` seedPhrase`, () => {
      assert.strictEqual(actual['seedPhrase'], seed['seedPhrase']);
    });

    it(`should be return \`${seed['masterPublicKey']}\` masterPublicKey`, () => {
      assert.strictEqual(actual['masterPublicKey'], seed['masterPublicKey']);
    });

    it(`should be return \`${seed['masterPrivateKey']}\` masterPrivateKey`, () => {
      assert.strictEqual(actual['masterPrivateKey'], seed['masterPrivateKey']);
    });
  });

  describe('#getDefaultPaths', () => {
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

  describe('#checkSeedPhrase', () => {
    const seedPhrase = 'crouch congress lake quantum smoke play glove firm pony capital wise cream';
    const actual = instance.checkSeedPhrase(seedPhrase);
    it('should return `true`', () => {
      assert.strictEqual(actual, true);
    });
  });

  describe('#derivateKeys', () => {
    let spy;
    let actual;
    before((done) => {
      spy = sinon.spy(BitcoinBase.prototype, 'derivateFromPrivate');
      const cursor = {
        skip: 1,
        limit: 1
      }
      const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U' }
      actual = instance.derivateKeys(masterPrivateKey, cursor);
      done();
    })
    after((done): void => {
      sinon.restore();
      done();
    })
      context('positive result', () => {
      const expected: [{ path: string, address: string, publicKey: string, privateKey: string }] = [
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

      it(`should be call {derivateFromPrivate} function 1 time`, () => {
        assert.strictEqual(spy.callCount, 1);
      });

      it(`should be call {derivateFromPrivate} function with following args 
          ['xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U',
          { limit: 1, skip: 1 }]`, () => {
        assert.deepEqual(spy.args[0], ['xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U',
        { limit: 1, skip: 1 }]);
      });
    });
  })

  describe('#derivateKeys/errorHandling', () => {
    const cursor = {
      skip: 1,
      limit: 1
    };
    const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U' }
    try {
      instance.derivateKeys({ masterPrivateKey: 'invalidKey' }, cursor); // check behavior in case of non-base58 charackter
    } catch (ex) {
      it('should be throw an error with following message `Non-base58 character`', () => {
        assert.strictEqual(ex.message, 'Non-base58 character');
      });
    }
    try {
      cursor.limit = -1;
      instance.derivateKeys(masterPrivateKey, cursor); // check behavior in case of negative limit
    } catch (ex) {
      it('should be throw an error with following message `Limit must be greater than zero`', () => {
        assert.strictEqual(ex.message, 'Limit must be greater than zero');
      });
    }
  });

  describe('#sign', () => {
    const masterPrivateKey = 'L58PscmN5Ee1u2t4oCvZNq1YF9rtuwe19CospGwygyBfd3aH7zYy';
    const actual = instance.sign('fake_data', masterPrivateKey);
    it(`should be return 8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f`, () => {
      assert.strictEqual(actual, '8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f');
    });
    try {
      instance.sign('fake_data', 'Invalid_Private_Key'); // check behavior in case of invalid private Key
    } catch (ex) {
      it('should be throw an error with following message `Non-base58 character`', () => {
        assert.strictEqual(ex.message, 'Non-base58 character');
      });
    }
  });

  describe('#getPublicFromPrivate', () => {
    const masterPrivateKey = 'L58PscmN5Ee1u2t4oCvZNq1YF9rtuwe19CospGwygyBfd3aH7zYy';
    const actual = instance.getPublicFromPrivate(masterPrivateKey);
    it(`should be return 02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38`, () => {
      assert.strictEqual(actual, '02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38');
    });
    try {
      instance.getPublicFromPrivate('Invalid_Private_Key'); // check behavior in case of invalid private Key
    } catch (ex) {
      it('should be throw an error with following message `Non-base58 character`', () => {
        assert.strictEqual(ex.message, 'Non-base58 character');
      });
    }
  });

  describe('#getAddressFromPublic', () => {
    const publicKey = '02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38';
    const actual = instance.getAddressFromPublic(publicKey);
    it(`should be return 1Nb924nRs93gWVeFnaKH1EE8uLqWGfdkXE`, () => {
      assert.strictEqual(actual, '1Nb924nRs93gWVeFnaKH1EE8uLqWGfdkXE');
    });
    try {
      instance.getAddressFromPublic('Invalid_Public_Key'); // check behavior in case of invalid public Key
    } catch (ex) {
      it('should be throw an error with following message `Expected property "pubkey" of type ?isPoint, got Buffer`', () => {
        assert.strictEqual(ex.message, 'Expected property "pubkey" of type ?isPoint, got Buffer');
      });
    }
  });

  describe('#checkSign', () => {
    const actualPositive = instance.checkSign('02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38', 'fake_data', '8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f');
    it('should be return `true`', () => {
      assert.strictEqual(actualPositive, true);
    });
    try {
      instance.checkSign('Invalid_Public_Key', 'fake_data', '8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f'); // check behavior in case of invalid public Key
    } catch (ex) {
      it('should be throw an error with following message `Expected isPoint, got Buffer`', () => {
        assert.strictEqual(ex.message, 'Expected isPoint, got Buffer');
      });
    }
    try {
      instance.checkSign('02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38', 'fake_data', 'invalid_sign');
    } catch (ex) {
      it('should be throw an error with following message `Expected Signature`', () => {
        assert.strictEqual(ex.message, 'Expected Signature');
      });
    }
  });
})