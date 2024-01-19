import React, { useEffect, useState, StrictMode } from "react";
import { helpers, Script, config, commons } from "../../lumos/packages/lumos";
import {createRoot} from "react-dom/client";
import {asyncSleep, capacityOf, transfer, tron, getAccount} from "./lib";

const cfg = JSON.parse(JSON.stringify(config.predefined.AGGRON4));
cfg.SCRIPTS.OMNILOCK.CODE_HASH ="0xe004391c16b67df98f66cda6cc779ab7c56fb78744ec935862e8e06555ddd1c0";
cfg.SCRIPTS.OMNILOCK.TX_HASH = "0x7fe38dc4b416eddc3f2fa0f75133da8082bd893df04823033d16f53eb8bc6c90";
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