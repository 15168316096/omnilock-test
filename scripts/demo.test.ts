import {e2eProvider} from "../src/config";
import {BI} from "@ckb-lumos/bi";
import { randomSecp256k1Account} from "../src/utils";


describe('Demo', function () {
   
    it("account deposit", async () => {
        let alice = "ckt1qq8kc5rek2ftsr8pd96cr6cs4fnwx8sk6pg599ykv239pydwr6etsqgrdqdv7ec5svjnv8hqz5rzh2e4888trmwjqq606st4";
        await e2eProvider.claimCKB({claimer: alice, amount: BI.from(300000 * 10 ** 8)});
        console.log(`bob:${randomSecp256k1Account().address}`)
    })

});