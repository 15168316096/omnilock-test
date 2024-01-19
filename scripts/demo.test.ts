import {e2eProvider} from "../src/config";
import {BI} from "@ckb-lumos/bi";
import { randomSecp256k1Account} from "../src/utils";


describe('Demo', function () {
   
    it("account deposit", async () => {
        let alice = "ckt1qpv96dqwj2v6mkhecwxjr5zca9t33hnk9waxf0r8w36gyxemwymvgqgrdqdv7ec5svjnv8hqz5rzh2e4888trmwjqqmdkdew";
        await e2eProvider.claimCKB({claimer: alice, amount: BI.from(300000 * 10 ** 8)});
        console.log(`bob:${randomSecp256k1Account().address}`)
    })

});