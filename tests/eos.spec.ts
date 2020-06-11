
import * as assert from 'assert';
import * as sinon from 'sinon';
import { describe, it, after, before } from 'mocha';
import { Keys } from '../src/lib';
import { Network, Blockchain } from '../src/types'
import { EOS } from '../src/blockchains/eos';

describe('Lib/EOS', () => {
  const instance = new Keys(Blockchain.EOS, Network.MAINNET);
  describe('#getDataFromSeed/generateSeedPhrase', () => {
    const seed = instance.generateSeedPhrase(12);
    const actual = instance.getDataFromSeed(seed['seedPhrase']);
    it(`should be return \`${seed['seedPhrase']}\` seedPhrase`, () => {
      assert.strictEqual(actual['seedPhrase'], seed['seedPhrase']);
    });

    it(`should be return \`${seed['masterPublicKey']}\` masterPublicKey`, () => {
      assert.strictEqual(actual['masterPublicKey'], seed['masterPublicKey']);
    });

    it(`should be return \`${seed['masterPrivateKey']}\ masterPrivateKey`, () => {
      assert.strictEqual(actual['masterPrivateKey'], seed['masterPrivateKey']);
    });
  });

  describe('#getDefaultPaths', () => {
    const actualPaths = instance.getDefaultPaths();
    it('should return exact paths', () => {
      const expectedPaths = [{
        blockchain: 'eos',
        network: 'mainnet',
        path: 'm/44\'/194\'/0\'/0/0'
      },
      {
        blockchain: 'eos',
        network: 'testnet',
        path: 'm/44\'/1\'/0\'/0/0'
      }];
      assert.deepEqual(actualPaths, expectedPaths);
    });
  });

  describe('#checkSeedPhrase', () => {
    const seedPhrase = 'error usual erupt time awkward piano tomorrow web special series tumble intact';
    const actual = instance.checkSeedPhrase(seedPhrase);
    it('should return `true`', () => {
      assert.strictEqual(actual, true);
    });
  });

  describe('#derivateKeys', () => {
    let spy;
    let actual;
    before((done) => {
      spy = sinon.spy(EOS.prototype, 'derivateFromPrivate');
      const cursor = {
        skip: 1,
        limit: 1
      }
      const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K4GDgGdjc6v946MMpyzHtzyGfSxRPBBPQnUEpoCiSSDKAppRm3jKACyWp3gfVtSK9UcDZ1PetByXmYZ1agFerj9dtcG7KSUc' }
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
          path: "m/44'/194'/0'/0/2",
          address: 'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy',
          publicKey: 'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy',
          privateKey: '5KauJcw5Xh5MazAqcwPBL5gXMP9eZQE8YLqTH2Q9xscLhvdHHSF'
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
          ['xprv9s21ZrQH143K4GDgGdjc6v946MMpyzHtzyGfSxRPBBPQnUEpoCiSSDKAppRm3jKACyWp3gfVtSK9UcDZ1PetByXmYZ1agFerj9dtcG7KSUc',
          { limit: 1, skip: 1 }]`, () => {
        assert.deepEqual(spy.args[0], ['xprv9s21ZrQH143K4GDgGdjc6v946MMpyzHtzyGfSxRPBBPQnUEpoCiSSDKAppRm3jKACyWp3gfVtSK9UcDZ1PetByXmYZ1agFerj9dtcG7KSUc',
        { limit: 1, skip: 1 }]);
      });
    });
  })

  describe('#derivateKeys/errorHandling', () => {
    const cursor = {
      skip: 1,
      limit: 1
    };
    const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K4GDgGdjc6v946MMpyzHtzyGfSxRPBBPQnUEpoCiSSDKAppRm3jKACyWp3gfVtSK9UcDZ1PetByXmYZ1agFerj9dtcG7KSUc' }
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
    const privateKey = '5KauJcw5Xh5MazAqcwPBL5gXMP9eZQE8YLqTH2Q9xscLhvdHHSF';
    const actual = instance.sign('fake_data', privateKey);
    it('should be return `SIG_K1_KeurYw2XHnXHpi6HpyHGzCz43ucBa5x9JP56ZeYHYLN92WhmZ9nrvyGxisCCkxrNoeAhMwrJxZCkXtuGEmrp9f4tR7HdGo`', () => {
      assert.strictEqual(actual, 'SIG_K1_KeurYw2XHnXHpi6HpyHGzCz43ucBa5x9JP56ZeYHYLN92WhmZ9nrvyGxisCCkxrNoeAhMwrJxZCkXtuGEmrp9f4tR7HdGo');
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
    const privateKey = '5KauJcw5Xh5MazAqcwPBL5gXMP9eZQE8YLqTH2Q9xscLhvdHHSF';
    const actual = instance.getPublicFromPrivate(privateKey);
    it(`should be return EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy`, () => {
      assert.strictEqual(actual, 'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy');
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
    const publicKey = 'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy';
    const actual = instance.getAddressFromPublic(publicKey);
    it(`should be return EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy`, () => {
      assert.strictEqual(actual, 'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy');
    });
  });

  describe('#checkSign', () => {
    const actual = instance.checkSign('EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy', 'fake_data', 'SIG_K1_KeurYw2XHnXHpi6HpyHGzCz43ucBa5x9JP56ZeYHYLN92WhmZ9nrvyGxisCCkxrNoeAhMwrJxZCkXtuGEmrp9f4tR7HdGo');
    it('should be return `true`', () => {
      assert.strictEqual(actual, true);
    });
    try {
      instance.checkSign('EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy', 'fake_data', 'invalid_sign');
    } catch (ex) {
      it('should be throw an error with following message `Expecting signature like: SIG_K1_base58signature..`', () => {
        assert.strictEqual(ex.message, 'Expecting signature like: SIG_K1_base58signature..');
      });
    }
  });
})