
import * as assert from 'assert';
import * as sinon from 'sinon';
import { describe, it, after, before } from 'mocha';
import { Keys } from '../src/lib';
import { Network, Blockchain } from '../src/types'
import { BitcoinSV } from '../src/blockchains/bitcoinsv';

describe('Lib/BitcoinSV', () => {
  const instance = new Keys(Blockchain.BITCOIN_SV, Network.MAINNET);
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
        blockchain: 'bitcoin_sv',
        network: 'mainnet',
        path: 'm/44\'/236\'/0\'/0/0'
      },
      {
        blockchain: 'bitcoin_sv',
        network: 'testnet',
        path: 'm/44\'/1\'/0\'/0/0'
      }];
      assert.deepEqual(actualPaths, expectedPaths);
    });
  });

  describe('#checkSeedPhrase', () => {
    const seedPhrase = 'quiz skirt rail empower fruit habit narrow address mind harbor quiz verb';
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
      spy = sinon.spy(BitcoinSV.prototype, 'derivateFromPrivate');
      const cursor = {
        skip: 1,
        limit: 1
      }
      const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K3bESDm6VzuysGU5SE5SasdExKzL6PvBAJGwHFPVL6THi8PxG994bdmLedRGj2abd5BuLzaWvGVounBsFwmqPGiGpcygApuP' }
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
          path: "m/44'/236'/0'/0/2",
          address: '15hhhQ9hiy8p4evXpT2BwZZ7W7i65T19MV',
          publicKey: '0382097c4888ac330e7248e96bd45a180d03525b0d69a0cb46fdfd4070a7d2ea77',
          privateKey: 'L5iKsuPCE27Gq1HpztakBmM6ACUyuh4tRV4Vd92EMvaRoLWwN2w2'
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
          ['xprv9s21ZrQH143K3bESDm6VzuysGU5SE5SasdExKzL6PvBAJGwHFPVL6THi8PxG994bdmLedRGj2abd5BuLzaWvGVounBsFwmqPGiGpcygApuP',
          { limit: 1, skip: 1 }]`, () => {
        assert.deepEqual(spy.args[0], ['xprv9s21ZrQH143K3bESDm6VzuysGU5SE5SasdExKzL6PvBAJGwHFPVL6THi8PxG994bdmLedRGj2abd5BuLzaWvGVounBsFwmqPGiGpcygApuP',
        { limit: 1, skip: 1 }]);
      });
    });
  })

  describe('#derivateKeys/errorHandling', () => {
    const cursor = {
      skip: 1,
      limit: 1
    };
    const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K39tiX5u6qsvmLPcitnTdwKPtbErXAQEHG5an2tQbk5kMDz8F9aB4YCmCC14UvAiukX4zd59SYbCZMAfQAD9vzMHUep5X6Wi' }
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
    const privateKey = 'L5iKsuPCE27Gq1HpztakBmM6ACUyuh4tRV4Vd92EMvaRoLWwN2w2';
    const actual = instance.sign('fake_data', privateKey);
    it('should be return `566ac601ed26a65b05e1bb21367e83aafbd688ebceecaf222e65938a6da4a18c692c6df1a8ba3af9e49d67b57f621bab8bbeea97b1d5ced18dc252ec6f83214d`', () => {
      assert.strictEqual(actual, '566ac601ed26a65b05e1bb21367e83aafbd688ebceecaf222e65938a6da4a18c692c6df1a8ba3af9e49d67b57f621bab8bbeea97b1d5ced18dc252ec6f83214d');
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
    const privateKey = 'L5iKsuPCE27Gq1HpztakBmM6ACUyuh4tRV4Vd92EMvaRoLWwN2w2';
    const actual = instance.getPublicFromPrivate(privateKey);
    it(`should be return 0382097c4888ac330e7248e96bd45a180d03525b0d69a0cb46fdfd4070a7d2ea77`, () => {
      assert.strictEqual(actual, '0382097c4888ac330e7248e96bd45a180d03525b0d69a0cb46fdfd4070a7d2ea77');
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
    const publicKey = '0382097c4888ac330e7248e96bd45a180d03525b0d69a0cb46fdfd4070a7d2ea77';
    const actual = instance.getAddressFromPublic(publicKey);
    it(`should be return 15hhhQ9hiy8p4evXpT2BwZZ7W7i65T19MV`, () => {
      assert.strictEqual(actual, '15hhhQ9hiy8p4evXpT2BwZZ7W7i65T19MV');
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
    const actual = instance.checkSign('0382097c4888ac330e7248e96bd45a180d03525b0d69a0cb46fdfd4070a7d2ea77', 'fake_data', '566ac601ed26a65b05e1bb21367e83aafbd688ebceecaf222e65938a6da4a18c692c6df1a8ba3af9e49d67b57f621bab8bbeea97b1d5ced18dc252ec6f83214d');
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