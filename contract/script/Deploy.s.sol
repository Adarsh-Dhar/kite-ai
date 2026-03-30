// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/PredictionMarket.sol";

/**
 * @title  DeployPredictionMarket
 * @notice Foundry deployment script for KiteAI Testnet (chainId 2368).
 *
 * Usage:
 *   forge script script/Deploy.s.sol:DeployPredictionMarket \
 *     --rpc-url https://rpc-testnet.gokite.ai \
 *     --broadcast \
 *     --private-key $PRIVATE_KEY \
 *     -vvvv
 *
 * After deployment the script also seeds three example markets.
 */
contract DeployPredictionMarket is Script {

    // ─── Config ──────────────────────────────────────────────────────
    uint256 constant PLATFORM_FEE_BPS  = 200;   // 2%
    uint256 constant INITIAL_LIQUIDITY = 0.05 ether; // per seed market
    uint256 constant MARKET_DURATION   = 7 days;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer    = vm.addr(deployerKey);

        console2.log("=================================================");
        console2.log(" KitePredictionMarket :- Deployment Script");
        console2.log("=================================================");
        console2.log("Deployer        :", deployer);
        console2.log("Chain ID        :", block.chainid);
        console2.log("Platform fee    :", PLATFORM_FEE_BPS, "bps");
        console2.log("=================================================");

        vm.startBroadcast(deployerKey);

        // ── 1. Deploy contract ────────────────────────────────────────
        KitePredictionMarket pm = new KitePredictionMarket(PLATFORM_FEE_BPS);
        console2.log("Contract deployed at:", address(pm));

        // ── 2. Seed example markets ───────────────────────────────────
        //    Oracle = deployer for testnet convenience.
        //    In production use a multisig or Chainlink oracle.

        uint256 deadline = block.timestamp + MARKET_DURATION;

        uint256 m0 = pm.createMarket{value: INITIAL_LIQUIDITY}(
            "Will BTC exceed $120,000 USD by end of 2025?",
            "Crypto",
            deployer,
            deadline
        );
        console2.log("Market 0 created (BTC $120k):", m0);

        uint256 m1 = pm.createMarket{value: INITIAL_LIQUIDITY}(
            "Will Ethereum complete the Pectra upgrade in Q2 2025?",
            "Crypto",
            deployer,
            deadline
        );
        console2.log("Market 1 created (ETH Pectra):", m1);

        uint256 m2 = pm.createMarket{value: INITIAL_LIQUIDITY}(
            "Will the KiteAI mainnet launch before July 2025?",
            "KiteAI",
            deployer,
            deadline
        );
        console2.log("Market 2 created (KiteAI mainnet):", m2);

        vm.stopBroadcast();

        // ── 3. Summary ────────────────────────────────────────────────
        console2.log("=================================================");
        console2.log(" Deployment complete!");
        console2.log("-------------------------------------------------");
        console2.log(" Contract  :", address(pm));
        console2.log(" Owner     :", pm.owner());
        console2.log(" Fee       :", pm.platformFeeBps(), "bps");
        console2.log(" Markets   :", pm.marketCount());
        console2.log("=================================================");
        console2.log(" Verify on KiteScan:");
        console2.log("   https://testnet.kitescan.ai/address/", address(pm));
        console2.log("=================================================");
    }
}
