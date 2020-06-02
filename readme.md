# install

npm i git+ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/crypto-api-keys-lib

# Use example
```
import { Keys, Blockchain, Network } from "crypto-api-keys-lib";

const k = new Keys(Blockchain.BITCOIN, Network.MAINNET);

console.log(k.generateSeedPhrase(12));
```