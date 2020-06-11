
import * as assert from 'assert';
import * as sinon from 'sinon';
import { describe, it, after, before } from 'mocha';
import { Keys } from '../src/lib';
import { Network, Blockchain } from '../src/types'
import { BitcoinCash } from '../src/blockchains/bitcoin-cash';

describe('Lib/BitcoinCash', () => {
  const instance = new Keys(Blockchain.BITCOIN_CASH, Network.MAINNET);
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
        blockchain: 'bitcoin_cash',
        network: 'mainnet',
        path: 'm/44\'/145\'/0\'/0/0'
      },
      {
        blockchain: 'bitcoin_cash',
        network: 'testnet',
        path: 'm/44\'/1\'/0\'/0/0'
      }];
      assert.deepEqual(actualPaths, expectedPaths);
    });
  });

  describe('#checkSeedPhrase', () => {
    const seedPhrase = 'oyster catch balcony fury end cotton soda quality collect maid artist essay';
    const actualPositive: boolean | Error = instance.checkSeedPhrase(seedPhrase);
    it('should return `true`', () => {
      assert.strictEqual(actualPositive, true);
    });
    const actualNegative: boolean | Error = instance.checkSeedPhrase('invalid');
    it('should return `false`', () => {
      assert.strictEqual(actualNegative, false);
    });
  });

  describe('#derivateKeys', () => {
    let spy;
    let actual;
    before((done) => {
      spy = sinon.spy(BitcoinCash.prototype, 'derivateFromPrivate');
      const cursor = {
        skip: 1,
        limit: 1
      }
      const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K2Hp25mLf4h83JiNCHdX8BwAZcSLiDZopCxZq6t59oZJHFfeGB9mv6kxMkg6C5nNLafSkyAqkQXcurfr1dVcnG4jio4SAK1p' }
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
          path: "m/44'/145'/0'/0/2",
          address: 'bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0',
          publicKey: '037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467',
          privateKey: 'Kwk5LVAQBpckqhBnmiHTgYxvNKhZs3U1L9QAn7sbvSc8Ez1F1iPc'
        }
      ]
      it(`should be return correct \`${expected[0]['path']}\` path`, () => {
        assert.strictEqual(actual[0]['path'], expected[0]['path']);
      });

      it(`should be return correct \`${expected[0]['address']}\` address`, () => {
        assert.strictEqual(actual[0]['address'], expected[0]['address']);
      });

      it(`should be return correct \`${expected[0]['publicKey']}\` publicKey`, () => {
        assert.strictEqual(actual[0]['publicKey'], expected[0]['publicKey']);
      });

      it(`should be return correct \`${expected[0]['privateKey']}\` privateKey`, () => {
        assert.strictEqual(actual[0]['privateKey'], expected[0]['privateKey']);
      });

      it(`should be call  \`{derivateFromPrivate} function \`1\` time`, () => {
        assert.strictEqual(spy.callCount, 1);
      });

      it(`should be call {derivateFromPrivate} function with following args 
          ['xprv9s21ZrQH143K2Hp25mLf4h83JiNCHdX8BwAZcSLiDZopCxZq6t59oZJHFfeGB9mv6kxMkg6C5nNLafSkyAqkQXcurfr1dVcnG4jio4SAK1p',
          { limit: 1, skip: 1 }]\``, () => {
        assert.deepEqual(spy.args[0], ['xprv9s21ZrQH143K2Hp25mLf4h83JiNCHdX8BwAZcSLiDZopCxZq6t59oZJHFfeGB9mv6kxMkg6C5nNLafSkyAqkQXcurfr1dVcnG4jio4SAK1p',
        { limit: 1, skip: 1 }]);
      });
    });
  })

  describe('#derivateKeys/errorHandling', () => {
    const cursor = {
      skip: 1,
      limit: 1
    };
    const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K3HUKu4RWfCYy7K5ZvtvLqHvXpSxdF9Bwe7W3AD3hB3Yaj8AsLfvjNK3jfjsmnGnxDsedZCZmiTy9ngS6DiomecHwnEipEMy' }
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
    const privateKey = 'Kwk5LVAQBpckqhBnmiHTgYxvNKhZs3U1L9QAn7sbvSc8Ez1F1iPc';
    const actual = instance.sign('fake_data', privateKey);
    it('should be return `88f5749a9e8aa4f54988ad7924508061032fe612dabcc041bded2626c51594c51aa0f1c30834b339120cb925c2d7dee50eda7f9d281a922bc2c9f2f692fff278`', () => {
      assert.strictEqual(actual, '88f5749a9e8aa4f54988ad7924508061032fe612dabcc041bded2626c51594c51aa0f1c30834b339120cb925c2d7dee50eda7f9d281a922bc2c9f2f692fff278');
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
    const privateKey = 'Kwk5LVAQBpckqhBnmiHTgYxvNKhZs3U1L9QAn7sbvSc8Ez1F1iPc';
    const actual = instance.getPublicFromPrivate(privateKey);
    it(`should be return 037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467`, () => {
      assert.strictEqual(actual, '037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467');
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
    const publicKey = '037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467';
    const actual = instance.getAddressFromPublic(publicKey);
    it(`should be return bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0`, () => {
      assert.strictEqual(actual, 'bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0');
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
    const actual = instance.checkSign('037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467', 'fake_data', '88f5749a9e8aa4f54988ad7924508061032fe612dabcc041bded2626c51594c51aa0f1c30834b339120cb925c2d7dee50eda7f9d281a922bc2c9f2f692fff278');
    it('should be return `true`', () => {
      assert.strictEqual(actual, true);
    });
    try {
      instance.checkSign('037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467', 'fake_data', 'invalid_sign');
    } catch (ex) {
      it('should be throw an error with following message `Expected Signature`', () => {
        assert.strictEqual(ex.message, 'Expected Signature');
      });
    }
  });
})