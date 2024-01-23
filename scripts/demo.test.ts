import {e2eProvider} from "../src/config";
import {BI} from "@ckb-lumos/bi";
import { randomSecp256k1Account} from "../src/utils";


describe('Demo', function () {
   
    it.skip("account deposit", async () => {
        let alice = "ckt1qqqtutmp28zrn3um5stwsv0jezcq762k575cz9wwre4zrlr5yz3xxqgymutf09y5vvhckx2darryt2m6xlv686kdqq20q247";
        await e2eProvider.claimCKB({claimer: alice, amount: BI.from(300000 * 10 ** 8)});
        console.log(`bob:${randomSecp256k1Account().address}`)
    })

});

// curl -X POST -H "Content-Type: application/json" -H "Accept: application/json" -d'{
//     "id": 42,
//     "jsonrpc": "2.0",
//     "method": "get_transaction",
//     "params": [
//       "0x4bef2c93a613420243f6a316445c93db5ceaf587236f159bc0f5f6f4d9f9675e"
//     ]
//   }' http://127.0.0.1:8128