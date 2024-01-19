import {BI, Cell, commons, config, helpers, Indexer, RPC} from "../../lumos/packages/lumos";
import {blockchain, bytes, bytify, hexify} from "../../lumos/packages/lumos/codec";

// const CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
const CKB_RPC_URL = "http://127.0.0.1:8128";
const rpc = new RPC(CKB_RPC_URL);
const indexer = new Indexer(CKB_RPC_URL);

// const cfg = JSON.parse(JSON.stringify(config.predefined.AGGRON4));
// cfg.SCRIPTS.OMNILOCK.TX_HASH =
//     "0x48de4df235706540efc4896f52d56c8f684147154bb9fa55da29383079fb7c1f";
// config.initializeConfig(cfg);

// config.initializeConfig(config.predefined.AGGRON4);
const CONFIG = JSON.parse(JSON.stringify(
    {"PREFIX":"ckt","SCRIPTS":{"SECP256K1_BLAKE160":{"HASH_TYPE":"type","CODE_HASH":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","TX_HASH":"0x3f539cd727bf841c932a02dc02eb341ebafc6492ef8550ca037af57112881f12","INDEX":"0x0","DEP_TYPE":"depGroup"},"SECP256K1_BLAKE160_MULTISIG":{"CODE_HASH":"0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8","HASH_TYPE":"type","TX_HASH":"0x3f539cd727bf841c932a02dc02eb341ebafc6492ef8550ca037af57112881f12","INDEX":"0x1","DEP_TYPE":"depGroup","SHORT_ID":1},"DAO":{"HASH_TYPE":"type","CODE_HASH":"0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e","TX_HASH":"0xe83f6932ea168b578269f4da36e9e43f586b2411e5f0be4451df50c7694a4350","INDEX":"0x2","DEP_TYPE":"code"},"SUDT":{"CODE_HASH":"0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4","HASH_TYPE":"type","TX_HASH":"0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769","INDEX":"0x0","DEP_TYPE":"code"},"ANYONE_CAN_PAY":{"CODE_HASH":"0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356","HASH_TYPE":"type","TX_HASH":"0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6","INDEX":"0x0","DEP_TYPE":"depGroup","SHORT_ID":2},"OMNILOCK":{"CODE_HASH":"0x5403571bce57157b62328ea3da8b05f6bc997683f67b26cfa3eb74e8ce4ef666","HASH_TYPE":"type","TX_HASH":"0x71fd543eee4babe5eff11c9d7de090865d2c0819cd781966afff821ac4a648ef","INDEX":"0x0","DEP_TYPE":"code"}}}
    ));
config.initializeConfig(CONFIG);

// prettier-ignore
interface TronRpc {
    (payload: { method: 'tron_requestAccounts' }): Promise<string>;
}

// prettier-ignore
export interface Provider {
    connect: TronRpc;
    ready?: boolean;
}

// @ts-ignore
export const tron =  window.okxwallet.tronLink as Provider;

export async function getAccount():Promise<string> {
    await tron.connect;
    // @ts-ignore
    return tron.tronWeb.defaultAddress.base58;
}

export function hexStringToByteArray(hexString: string): number[] {
    const byteArray: number[] = [];

    for (let i = 0; i < hexString.length; i += 2) {
        byteArray.push(parseInt(hexString.substr(i, 2), 16));
    }

    return byteArray;
}

export async function signMessage(
    message: string,
): Promise<string> {
    //@ts-ignore
    if (window.okxwallet.tronLink.ready) {
        const tronweb = window.okxwallet.tronLink.tronWeb;
        try {
            const signedString = await tronweb.trx.sign(message.replace(/^0x/, ''));
            // const signedString = await tronweb.trx.sign("0".repeat(32) + message);
            return signedString;
        } catch (error) {
            // handle error
        }
    }
}


export function asyncSleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Options {
    from: string;
    to: string;
    amount: string;
}
const SECP_SIGNATURE_PLACEHOLDER = hexify(
    new Uint8Array(
        commons.omnilock.OmnilockWitnessLock.pack({
            signature: new Uint8Array(65).buffer,
        }).byteLength
    )
);

export async function transfer(options: Options): Promise<string> {
    // const CONFIG = config.getConfig();
    let tx = helpers.TransactionSkeleton({});
    const fromScript = helpers.parseAddress(options.from);
    const toScript = helpers.parseAddress(options.to);

    // additional 0.001 ckb for tx fee
    // the tx fee could calculated by tx size
    // this is just a simple example
    const neededCapacity = BI.from(options.amount).add(100000);
    let collectedSum = BI.from(0);
    const collectedCells: Cell[] = [];
    const collector = indexer.collector({ lock: fromScript, type: "empty" });
    for await (const cell of collector.collect()) {
        collectedSum = collectedSum.add(cell.cellOutput.capacity);
        collectedCells.push(cell);
        if (BI.from(collectedSum).gte(neededCapacity)) break;
    }

    if (collectedSum.lt(neededCapacity)) {
        throw new Error(`Not enough CKB, expected: ${neededCapacity}, actual: ${collectedSum} `);
    }

    const transferOutput: Cell = {
        cellOutput: {
            capacity: BI.from(options.amount).toHexString(),
            lock: toScript,
        },
        data: "0x",
    };

    const changeOutput: Cell = {
        cellOutput: {
            capacity: collectedSum.sub(neededCapacity).toHexString(),
            lock: fromScript,
        },
        data: "0x",
    };

    tx = tx.update("inputs", (inputs) => inputs.push(...collectedCells));
    tx = tx.update("outputs", (outputs) => outputs.push(transferOutput, changeOutput));
    tx = tx.update("cellDeps", (cellDeps) =>
        cellDeps.push(
            // omni lock dep
            {
                outPoint: {
                    txHash: CONFIG.SCRIPTS.OMNILOCK.TX_HASH,
                    index: CONFIG.SCRIPTS.OMNILOCK.INDEX,
                },
                depType: CONFIG.SCRIPTS.OMNILOCK.DEP_TYPE,
            },
            // SECP256K1 lock is depended by omni lock
            {
                outPoint: {
                    txHash: CONFIG.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
                    index: CONFIG.SCRIPTS.SECP256K1_BLAKE160.INDEX,
                },
                depType: CONFIG.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE,
            }
        )
    );

    const witness = hexify(blockchain.WitnessArgs.pack({ lock: SECP_SIGNATURE_PLACEHOLDER }));

    // fill txSkeleton's witness with placeholder
    for (let i = 0; i < tx.inputs.toArray().length; i++) {
        tx = tx.update("witnesses", (witnesses) => witnesses.push(witness));
    }

    tx = commons.omnilock.prepareSigningEntries(tx, { config: CONFIG });
    console.log(`message:${tx.signingEntries.get(0).message}`);
    let result = await signMessage(tx.signingEntries.get(0).message);
    // let v = Number.parseInt(result.slice(-2), 16);
    // if (v >= 27) v -= 27;
    // result =
    //     '0x' +
    //     '03' +
    //     result.slice(2, -2) +
    //     v.toString(16).padStart(2, '0');
    console.log(`${result}`);
    const signedWitness = hexify(
        blockchain.WitnessArgs.pack({
            lock: commons.omnilock.OmnilockWitnessLock.pack({
                signature: bytify(result).buffer,
            }),
        })
    );
    console.log(`wintness:${signedWitness}`);

    tx = tx.update("witnesses", (witnesses) => witnesses.set(0, signedWitness));

    const signedTx = helpers.createTransactionFromSkeleton(tx);
    const txHash = await rpc.sendTransaction(signedTx, "passthrough");

    return txHash;
}

export async function capacityOf(address: string): Promise<BI> {
    const collector = indexer.collector({
        lock: helpers.parseAddress(address),
    });

    let balance = BI.from(0);
    for await (const cell of collector.collect()) {
        balance = balance.add(cell.cellOutput.capacity);
    }

    return balance;
}
