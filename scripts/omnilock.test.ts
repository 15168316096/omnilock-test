import {e2eProvider} from "../src/config";
import {BI} from "@ckb-lumos/bi";
import { randomSecp256k1Account} from "../src/utils";
import { helpers, Script, commons } from "../lumos/packages/lumos";
import {capacityOf, transfer} from "./lib";

import {config} from  "../lumos/packages/lumos";

export const CONFIG = JSON.parse(JSON.stringify(config.predefined.LINA));
// CONFIG.SCRIPTS.OMNILOCK.TX_HASH = "0xb50ef6f2e9138f4dbca7d5280e10d29c1a65e60e8a574c009a2fa4e4107e0750";
CONFIG.SCRIPTS.OMNILOCK.TX_HASH = "0xc76edf469816aa22f416503c38d0b533d2a018e253e379f134c3985b3472c842";    
// export const CONFIG = JSON.parse(JSON.stringify(
//     {"PREFIX":"ckt","SCRIPTS":{"SECP256K1_BLAKE160":{"HASH_TYPE":"type","CODE_HASH":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","TX_HASH":"0x285534355563245f03ce01246412a58d13031d1b55b18fee79366fe4f23b67a8","INDEX":"0x0","DEP_TYPE":"depGroup"},"SECP256K1_BLAKE160_MULTISIG":{"CODE_HASH":"0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8","HASH_TYPE":"type","TX_HASH":"0x285534355563245f03ce01246412a58d13031d1b55b18fee79366fe4f23b67a8","INDEX":"0x1","DEP_TYPE":"depGroup","SHORT_ID":1},"DAO":{"HASH_TYPE":"type","CODE_HASH":"0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e","TX_HASH":"0xb4703781f4b89dabe8ae7784b77234cc5a731e7e357985ceff77875e0982bd56","INDEX":"0x2","DEP_TYPE":"code"},"SUDT":{"CODE_HASH":"0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4","HASH_TYPE":"type","TX_HASH":"0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769","INDEX":"0x0","DEP_TYPE":"code"},"ANYONE_CAN_PAY":{"CODE_HASH":"0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356","HASH_TYPE":"type","TX_HASH":"0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6","INDEX":"0x0","DEP_TYPE":"depGroup","SHORT_ID":2},"OMNILOCK":{"CODE_HASH":"0x00be2f6151c439c79ba416e831f2c8b00f6956a7a98115ce1e6a21fc7420a263","HASH_TYPE":"type","TX_HASH":"0x425d469ac88d45546d55c51620c3457b8905a58a06b921d99dc4dd6319857b76","INDEX":"0x0","DEP_TYPE":"code"}}}
// ))
// use testnet config
config.initializeConfig(CONFIG);

describe('omnilock-test', function () {
   
    it.skip("eos", async () => {
        const omniLockScript = commons.omnilock.createOmnilockScript({
            auth: { flag: "EOS", content: "" },
        });

        const omniAddr = helpers.encodeToAddress(omniLockScript);
        console.log(`omniAddr:${omniAddr}`)

        const txHash = await transfer({ amount: "111111111111", from: omniAddr, to: "ckb1qrgqep8saj8agswr30pls73hra28ry8jlnlc3ejzh3dl2ju7xxpjxqgqq9j3kmq0jfu02ar9q8l65lxu9qlpppnr4yxtmhj3"})
        console.log(`txHash:${txHash}`);
    })

    it.skip("dogecoin", async () => {
        const dogeAddr = "D8GYB1Z26WM7gLWjwgjVUkTCbACF5WZmR1";
        const omniLockScript = commons.omnilock.createOmnilockScript({
            auth: { flag: "DOGECOIN", address: dogeAddr },
        });

        const omniAddr = helpers.encodeToAddress(omniLockScript);
        console.log(`omniAddr:${omniAddr}`)

        const txHash = await transfer({ amount: "20000000000", from: omniAddr, to: "ckb1qrgqep8saj8agswr30pls73hra28ry8jlnlc3ejzh3dl2ju7xxpjxqgqq9j3kmq0jfu02ar9q8l65lxu9qlpppnr4yxtmhj3"})
        console.log(`txHash:${txHash}`);
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