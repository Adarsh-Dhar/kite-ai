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
 * The script deploys the contract and reports the configured treasury.
 */
contract DeployPredictionMarket is Script {

    // ─── Config ──────────────────────────────────────────────────────
    uint256 constant PLATFORM_FEE_BPS = 200; // 2%

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer    = vm.addr(deployerKey);
        address treasury    = vm.envOr("TREASURY_ADDRESS", deployer);

        console2.log("=================================================");
        console2.log(" KitePredictionMarket :- Deployment Script");
        console2.log("=================================================");
        console2.log("Deployer        :", deployer);
        console2.log("Treasury        :", treasury);
        console2.log("Chain ID        :", block.chainid);
        console2.log("Platform fee    :", PLATFORM_FEE_BPS, "bps");
        console2.log("=================================================");

        vm.startBroadcast(deployerKey);

        // ── 1. Deploy contract ────────────────────────────────────────
        KitePredictionMarket pm = new KitePredictionMarket(PLATFORM_FEE_BPS, treasury);
        console2.log("Contract deployed at:", address(pm));

        vm.stopBroadcast();

        // ── 2. Summary ────────────────────────────────────────────────
        console2.log("=================================================");
        console2.log(" Deployment complete!");
        console2.log("-------------------------------------------------");
        console2.log(" Contract  :", address(pm));
        console2.log(" Owner     :", pm.owner());
        console2.log(" Fee       :", pm.platformFeeBps(), "bps");
        console2.log(" Treasury  :", pm.treasuryAddress());
        console2.log(" Service   :", pm.serviceFee(), "wei");
        console2.log(" Markets   :", pm.marketCount());
        console2.log("=================================================");
        console2.log(" Verify on KiteScan:");
        console2.log("   https://testnet.kitescan.ai/address/", address(pm));
        console2.log("=================================================");
    }
}
