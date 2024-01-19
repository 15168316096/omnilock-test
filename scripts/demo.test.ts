import {e2eProvider} from "../src/config";
import {BI} from "@ckb-lumos/bi";
import { randomSecp256k1Account} from "../src/utils";


describe('Demo', function () {
   
    it("account deposit", async () => {
        let alice = "ckt1qp2qx4cmeet327mzx2828k5tqhmtextks0m8kfk0504hf6xwfmmxvqgrdqdv7ec5svjnv8hqz5rzh2e4888trmwjqqshxa4q";
        await e2eProvider.claimCKB({claimer: alice, amount: BI.from(300000 * 10 ** 8)});
        console.log(`bob:${randomSecp256k1Account().address}`)
    })

});