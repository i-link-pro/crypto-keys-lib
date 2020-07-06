# install

npm i git+ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/crypto-api-keys-lib

# Use example
```
import { Keys, Blockchain, Network } from "crypto-api-keys-lib";

const k = new Keys(Blockchain.BITCOIN, Network.MAINNET);

console.log(k.generateSeedPhrase(12));
```

# Encryption example
```
import { Keys } from "crypto-api-keys-lib";

const encTest = async () => {
    const password = '123'
    const encrypted = await Keys.encrypt('encrypt test', password)
    const decrypted = await Keys.decrypt(encrypted, password)
    console.log({ encrypted, decrypted })
}

encTest()
```

# Derivation example
```
import { Keys, Blockchain, Network } from "crypto-api-keys-lib";

const keys = new Keys(Blockchain.BITCOIN, Network.MAINNET)
const seed = keys.generateSeedPhrase(12)

console.log({ seed })

if (seed && !(seed instanceof Error)) {
    const dkeys = keys.derivateKeys(
        { masterPublicKey: seed.masterPublicKey },
        { skip: 0, limit: 3, path: "m/44'/0'/0'/0/3" },
    )
    console.log({ dkeys })
}
```
