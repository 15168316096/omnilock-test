import React, { useEffect, useState } from "react";
import { helpers, Script, config, commons } from "@ckb-lumos/lumos";
import ReactDOM from "react-dom";
import { asyncSleep, capacityOf, ethereum, transfer } from "./lib";

// use devnet config
config.initializeConfig(config.predefined.AGGRON4);
config.createConfig(
    {
        "PREFIX":"ckt",
        "SCRIPTS":{
            "SECP256K1_BLAKE160":{
                "HASH_TYPE":"type",
                "CODE_HASH":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "TX_HASH":"0x3490882b8e7f7a84b0406686f13df3a9187af4356522f3a959133bf9026e8ef1",
                "INDEX":"0x0",
                "DEP_TYPE":"depGroup"
            },
            "SECP256K1_BLAKE160_MULTISIG":{
                "CODE_HASH":"0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8",
                "HASH_TYPE":"type",
                "TX_HASH":"0x3490882b8e7f7a84b0406686f13df3a9187af4356522f3a959133bf9026e8ef1",
                "INDEX":"0x1",
                "DEP_TYPE":"depGroup",
                "SHORT_ID":1
            },
            "DAO":{
                "HASH_TYPE":"type",
                "CODE_HASH":"0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                "TX_HASH":"0xbd0b3a9f0e53722baa7706ffe126da9019fb567a932ac8df095e36219c4e5d2d",
                "INDEX":"0x2",
                "DEP_TYPE":"code"
            },
            "SUDT":{
                "CODE_HASH":"0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4",
                "HASH_TYPE":"type",
                "TX_HASH":"0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769",
                "INDEX":"0x0",
                "DEP_TYPE":"code"
            },
            "ANYONE_CAN_PAY":{
                "CODE_HASH":"0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356",
                "HASH_TYPE":"type",
                "TX_HASH":"0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6",
                "INDEX":"0x0",
                "DEP_TYPE":"depGroup",
                "SHORT_ID":2
            },
            "OMNILOCK":{
                "CODE_HASH":"0xf329effd1c475a2978453c8600e1eaf0bc2087ee093c3ee64cc96ec6847752cb",
                "HASH_TYPE":"type",
                "TX_HASH":"0x27b62d8be8ed80b9f56ee0fe41355becdb6f6a40aeba82d3900434f43b1c8b60",
                "INDEX":"0x0",
                "DEP_TYPE":"code"
            },
            "OMNI_LOCK":{
                "CODE_HASH":"0x015ca600ba496342fdb6cb6cd686be22bf8994a2598ddae67a09c979d6e1297a",
                "HASH_TYPE":"type",
                "TX_HASH":"0x33142aa75bb3f1976c444e4c1741597779ff6fafb40455b2dffae9804f93dcd7",
                "INDEX":"0x0",
                "DEP_TYPE":"code"
            }
        }
    }
)
export function App() {
  const [ethAddr, setEthAddr] = useState("");
  const [omniAddr, setOmniAddr] = useState("");
  const [omniLock, setOmniLock] = useState<Script>();
  const [balance, setBalance] = useState("-");

  const [transferAddr, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [isSendingTx, setIsSendingTx] = useState(false);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    asyncSleep(100).then(() => {
      if (ethereum.selectedAddress) connectToMetaMask();
      ethereum.addListener("accountsChanged", connectToMetaMask);
    });
  }, []);

  function connectToMetaMask() {
    ethereum
      .enable()
      .then(([ethAddr]: string[]) => {
        const omniLockScript = commons.omnilock.createOmnilockScript({ auth: { flag: "ETHEREUM", content: ethAddr } });

        const omniAddr = helpers.encodeToAddress(omniLockScript);

        setEthAddr(ethAddr);
        setOmniAddr(omniAddr);
        setOmniLock(omniLockScript);

        return omniAddr;
      })
      .then((omniAddr) => capacityOf(omniAddr))
      .then((balance) => setBalance(balance.div(10 ** 8).toString() + " CKB"));
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

  if (!ethereum) return <div>MetaMask is not installed</div>;
  if (!ethAddr) return <button onClick={connectToMetaMask}>Connect to MetaMask</button>;

  return (
    <div>
      <ul>
        <li>Ethereum Address: {ethAddr}</li>
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
        <input id="address" type="text" onChange={(e) => setTransferAddress(e.target.value)} placeholder="ckt1..." />
        <br />
        <label htmlFor="amount">Amount</label>
        &nbsp;
        <input id="amount" type="text" onChange={(e) => setTransferAmount(e.target.value)} placeholder="shannon" />
        <br />
        <button onClick={onTransfer} disabled={isSendingTx}>
          Transfer
        </button>
        <p>Tx Hash: {txHash}</p>
      </div>
    </div>
  );
}

const app = document.getElementById("root");
ReactDOM.render(<App />, app);
