import React, { useEffect, useState, StrictMode } from "react";
import { helpers, Script, config, commons } from "../../lumos/packages/lumos";
import {createRoot} from "react-dom/client";
import {asyncSleep, capacityOf, transfer, tron, getAccount} from "./lib";

// const cfg = JSON.parse(JSON.stringify(config.predefined.AGGRON4));
// cfg.SCRIPTS.OMNILOCK.TX_HASH =
//     "0x48de4df235706540efc4896f52d56c8f684147154bb9fa55da29383079fb7c1f";
// config.initializeConfig(cfg);

// config.initializeConfig(config.predefined.AGGRON4);
const cfg = JSON.parse(JSON.stringify(
    {"PREFIX":"ckt","SCRIPTS":{"SECP256K1_BLAKE160":{"HASH_TYPE":"type","CODE_HASH":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","TX_HASH":"0x3f539cd727bf841c932a02dc02eb341ebafc6492ef8550ca037af57112881f12","INDEX":"0x0","DEP_TYPE":"depGroup"},"SECP256K1_BLAKE160_MULTISIG":{"CODE_HASH":"0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8","HASH_TYPE":"type","TX_HASH":"0x3f539cd727bf841c932a02dc02eb341ebafc6492ef8550ca037af57112881f12","INDEX":"0x1","DEP_TYPE":"depGroup","SHORT_ID":1},"DAO":{"HASH_TYPE":"type","CODE_HASH":"0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e","TX_HASH":"0xe83f6932ea168b578269f4da36e9e43f586b2411e5f0be4451df50c7694a4350","INDEX":"0x2","DEP_TYPE":"code"},"SUDT":{"CODE_HASH":"0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4","HASH_TYPE":"type","TX_HASH":"0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769","INDEX":"0x0","DEP_TYPE":"code"},"ANYONE_CAN_PAY":{"CODE_HASH":"0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356","HASH_TYPE":"type","TX_HASH":"0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6","INDEX":"0x0","DEP_TYPE":"depGroup","SHORT_ID":2},"OMNILOCK":{"CODE_HASH":"0x585d340e9299addaf9c38d21d058e95718de762bba64bc677474821b3b7136c4","HASH_TYPE":"type","TX_HASH":"0x48de4df235706540efc4896f52d56c8f684147154bb9fa55da29383079fb7c1f","INDEX":"0x0","DEP_TYPE":"code"}}}
));
config.initializeConfig(cfg);

const App: React.FC = () => {
    const [tronAddr, setTronAddr] = useState("");
    const [omniAddr, setOmniAddr] = useState("");
    const [omniLock, setOmniLock] = useState<Script>();
    const [balance, setBalance] = useState("-");

    const [transferAddr, setTransferAddress] = useState("");
    const [transferAmount, setTransferAmount] = useState("");

    const [isSendingTx, setIsSendingTx] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        asyncSleep(300).then(() => {
           tron.connect;
        });
    }, []);

    function connectToWallet() {
        getAccount().then((tronAddr: string)  => {
                const omniLockScript = commons.omnilock.createOmnilockScript({
                    auth: { flag: "TRON", address: tronAddr },
                });

                const omniAddr = helpers.encodeToAddress(omniLockScript);
                console.log(omniAddr);
                setTronAddr(tronAddr);
                setOmniAddr(omniAddr);
                setOmniLock(omniLockScript);

                return omniAddr;
            })
            .then((omniAddr) => capacityOf(omniAddr))
            .then((balance) => {
                setBalance(balance.div(10 ** 8).toString() + " CKB");
                setConnected(true); // 连接成功后切换到已连接状态
            })
    }

    function onTransfer() {
        if (isSendingTx) return;
        setIsSendingTx(true);

        transfer({ amount: transferAmount, from: omniAddr, to: transferAddr })
            .then(setTxHash)
            .catch((e) => {
                console.log(e);
                alert(e.message || JSON.stringify(e));
            })
            .finally(() => setIsSendingTx(false));
    }


    return (
        <div>
            {connected ? (
                <div>
                    <ul>
                        <li>Tron Address: {tronAddr}</li>
                        <li>Nervos Address(Omni): {omniAddr}</li>
                        <li>
                            Current Omni lock script:
                            <pre>{JSON.stringify(omniLock, null, 2)}</pre>
                        </li>
                        <li>Balance: {balance}</li>
                    </ul>

                    <div>
                        <h2>Transfer to</h2>
                        <label htmlFor="address">Address</label>&nbsp;
                        <input
                            id="address"
                            type="text"
                            onChange={(e) => setTransferAddress(e.target.value)}
                            placeholder="ckt1..."
                        />
                        <br />
                        <label htmlFor="amount">Amount</label>
                        &nbsp;
                        <input
                            id="amount"
                            type="text"
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="shannon"
                        />
                        <br />
                        <button onClick={onTransfer} disabled={isSendingTx}>
                            Transfer
                        </button>
                        <p>Tx Hash: {txHash}</p>
                    </div>
                </div>
            ) : (
                <button onClick={connectToWallet}>Connect to okxwallet</button>
            )}
        </div>
    );
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);