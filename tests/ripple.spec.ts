
import * as assert from 'assert';
import * as sinon from 'sinon';
import { describe, it, after, before } from 'mocha';
import { Keys } from '../src/lib';
import { Network, Blockchain } from '../src/types'
import { Ripple } from '../src/blockchains/ripple';

describe('Lib/Ripple', () => {
  const instance = new Keys(Blockchain.RIPPLE, Network.MAINNET);
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
        blockchain: 'ripple',
        network: 'mainnet',
        path: 'm/44\'/144\'/0\'/0/0'
      },
      {
        blockchain: 'ripple',
        network: 'testnet',
        path: 'm/44\'/1\'/0\'/0/0'
      }];
      assert.deepEqual(actualPaths, expectedPaths);
    });
  });

  describe('#checkSeedPhrase', () => {
    const seedPhrase: string = 'wolf extra expand cause vocal worth cricket era board word ability limit';
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
      spy = sinon.spy(Ripple.prototype, 'derivateFromPrivate');
      const cursor = {
        skip: 1,
        limit: 1
      }
      const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K3Wy2r1A79bJVQ23n6qFwNtM6F8egcamUeZkcy1AXYg4p1oQ1TSfCrzTZFRcDgosskwcgKB1BGTuBqfQG9CquUX7F9VrPzey' }
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
          path: "m/44'/144'/0'/0/2",
          address: 'XVmKGwrZEEmhss7XR5YqPygAmaeWoBzKhWYovtE1tZp9Fet',
          publicKey: '02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05',
          privateKey: 'L2fDxPGkZTRoasvqbUJDyf5XwHRqLGFGXUhXpinXKY1fPtzkVuM1'
        }
      ]
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
          ['xprv9s21ZrQH143K3Wy2r1A79bJVQ23n6qFwNtM6F8egcamUeZkcy1AXYg4p1oQ1TSfCrzTZFRcDgosskwcgKB1BGTuBqfQG9CquUX7F9VrPzey',
          { limit: 1, skip: 1 }]`, () => {
        assert.deepEqual(spy.args[0], ['xprv9s21ZrQH143K3Wy2r1A79bJVQ23n6qFwNtM6F8egcamUeZkcy1AXYg4p1oQ1TSfCrzTZFRcDgosskwcgKB1BGTuBqfQG9CquUX7F9VrPzey',
        { limit: 1, skip: 1 }]);
      });
    });
  })

  describe('#derivateKeys/errorHandling', () => {
    const cursor = {
      skip: 1,
      limit: 1
    };
    const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K2aSeenTNZ5iYEUVzvzTriKKtTWmUN2VhHW7Az2xDW3gNZ5cSHxAfZZQNp1nfKECfJKBeA8Ne9zzS5fiUHqwDt6SfiKyq9cY' }
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
    const privateKey = 'L2fDxPGkZTRoasvqbUJDyf5XwHRqLGFGXUhXpinXKY1fPtzkVuM1';
    const actual = instance.sign('fake_data', privateKey);
    it('should be return `30440220110A823EC57DE58D2BBFE34E4FE3464BFFD2997E952C00E534B5AF3B92FF51A80220112C3B818AA2BDDEA761236B4A23FBB741071407E56A6C7B1CBD6F93CF36FB08`', () => {
      assert.strictEqual(actual, '30440220110A823EC57DE58D2BBFE34E4FE3464BFFD2997E952C00E534B5AF3B92FF51A80220112C3B818AA2BDDEA761236B4A23FBB741071407E56A6C7B1CBD6F93CF36FB08');
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
    const privateKey = 'L2fDxPGkZTRoasvqbUJDyf5XwHRqLGFGXUhXpinXKY1fPtzkVuM1';
    const actual = instance.getPublicFromPrivate(privateKey);
    it(`should be return 02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05`, () => {
      assert.strictEqual(actual, '02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05');
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
    const publicKey = '02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05';
    const actual = instance.getAddressFromPublic(publicKey);
    it(`should be return XVmKGwrZEEmhss7XR5YqPygAmaeWoBzKhWYovtE1tZp9Fet`, () => {
      assert.strictEqual(actual, 'XVmKGwrZEEmhss7XR5YqPygAmaeWoBzKhWYovtE1tZp9Fet');
    });
    try {
      instance.getAddressFromPublic('Invalid_Public_Key'); // check behavior in case of invalid public Key
    } catch (ex) {
      it('should be throw an error with following message `Invalid character in Invalid_Public_Key`', () => {
        assert.strictEqual(ex.message, 'Invalid character in Invalid_Public_Key');
      });
    }
  });

  describe('#checkSign', () => {
    const actual = instance.checkSign('02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05', 'fake_data', '30440220110A823EC57DE58D2BBFE34E4FE3464BFFD2997E952C00E534B5AF3B92FF51A80220112C3B818AA2BDDEA761236B4A23FBB741071407E56A6C7B1CBD6F93CF36FB08');
    it('should be return `true`', () => {
      assert.strictEqual(actual, true);
    });
    try {
      instance.checkSign('02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05', 'fake_data', 'invalid_sign');
    } catch (ex) {
      it('should be throw an error with following message `Signature without r or s`', () => {
        assert.strictEqual(ex.message, 'Signature without r or s');
      });
    }
  });
})