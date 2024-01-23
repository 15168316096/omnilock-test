# Omnilock-Test

## Scripts

```bash
# Build Script
npm run build:script
# Description: Run the build script using `prepare_scripts.sh` with the `-x` option.

# Build Lumos
npm run build:lumos
# Description: Build Lumos using `prepare_lumos.sh` with the `-x` option.

# Start Node
npm run node:start
# Description: Start CKB node on devnet using `npx ts-node scripts/start_ckb.ts`.

# Deploy Contract
npm run contract:deploy
# Description: Deploy Omnilock contract on devnet using `npx ts-node scripts/deploy_omnilock.ts`.

# End-to-End Test for Ethereum
npm run e2e:testeth
# Description: Run end-to-end tests for Ethereum with MetaMask using `e2e-test.sh`.

# End-to-End Test for Bitcoin
npm run e2e:testbitcoin-unisat
# Description: Run end-to-end tests for Bitcoin with Unisat using `e2e-test.sh`.

# End-to-End Test for Bitcoin
npm run e2e:testbitcoin-okxwallet
# Description: Run end-to-end tests for Bitcoin with Okxwallet using `e2e-test.sh`.

# End-to-End Test for Bitcoin
npm run e2e:testtron-okxwallet
# Description: Run end-to-end tests for Tron with Okxwallet using `e2e-test.sh`.