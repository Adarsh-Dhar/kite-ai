// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {KitePredictionMarket} from "../src/PredictionMarket.sol";

/**
 * @title  PredictionMarketTest
 * @notice Full unit + integration test suite for KitePredictionMarket.
 *
 * Run with:   forge test -vvv
 * Coverage:   forge coverage
 */
contract PredictionMarketTest is Test {

    // ─────────────────────────────────────────────────────────────────
    //  Fixtures
    // ─────────────────────────────────────────────────────────────────
    receive() external payable {}

    KitePredictionMarket public pm;

    address owner   = address(this);
    address treasury = makeAddr("treasury");
    address oracle  = makeAddr("oracle");
    address alice   = makeAddr("alice");
    address bob     = makeAddr("bob");
    address carol   = makeAddr("carol");

    uint256 constant INITIAL_LIQUIDITY = 1 ether;
    uint256 constant FEE_BPS           = 200; // 2%
    uint256 constant DEADLINE_OFFSET   = 7 days;

    function setUp() public {
        pm = new KitePredictionMarket(FEE_BPS, treasury);

        // Fund participants
        vm.deal(alice, 100 ether);
        vm.deal(bob,   100 ether);
        vm.deal(carol, 100 ether);
        vm.deal(owner, 100 ether);
        vm.deal(treasury, 0 ether);
    }

    // ─────────────────────────────────────────────────────────────────
    //  Helpers
    // ─────────────────────────────────────────────────────────────────

    function _createDefaultMarket() internal returns (uint256 marketId) {
        marketId = pm.createMarket{value: INITIAL_LIQUIDITY + pm.serviceFee()}(
            "Will BTC hit $100k before 2026?",
            "Crypto",
            oracle,
            block.timestamp + DEADLINE_OFFSET
        );
    }

    // ─────────────────────────────────────────────────────────────────
    //  1. Deployment
    // ─────────────────────────────────────────────────────────────────

    function test_Deployment_FeeSet() public view {
        assertEq(pm.platformFeeBps(), FEE_BPS);
        assertEq(pm.owner(), owner);
        assertEq(pm.treasuryAddress(), treasury);
        assertEq(pm.serviceFee(), (0.01 ether * 1_000) / 10_000);
        assertEq(pm.marketCount(), 0);
        assertFalse(pm.globalPause());
    }

    function test_Deployment_RevertIfFeeTooHigh() public {
        vm.expectRevert(KitePredictionMarket.FeeTooHigh.selector);
        new KitePredictionMarket(501, treasury);
    }

    // ─────────────────────────────────────────────────────────────────
    //  2. Market Creation
    // ─────────────────────────────────────────────────────────────────

    function test_CreateMarket_Success() public {
        uint256 id = _createDefaultMarket();
        assertEq(id, 0);
        assertEq(pm.marketCount(), 1);

        KitePredictionMarket.Market memory m = pm.getMarketInfo(0);
        assertEq(m.question, "Will BTC hit $100k before 2026?");
        assertEq(m.creator, owner);
        assertEq(m.oracle, oracle);
        assertEq(uint8(m.status), uint8(KitePredictionMarket.MarketStatus.OPEN));
        assertEq(uint8(m.outcome), uint8(KitePredictionMarket.Outcome.UNRESOLVED));
        assertGt(m.yesReserve, 0);
        assertGt(m.noReserve, 0);
    }

    function test_CreateMarket_EmitsEvent() public {
        vm.expectEmit(true, true, false, false);
        emit KitePredictionMarket.MarketCreated(
            0, owner, "Q?", "Cat", oracle, block.timestamp + DEADLINE_OFFSET, INITIAL_LIQUIDITY
        );
        pm.createMarket{value: INITIAL_LIQUIDITY + pm.serviceFee()}(
            "Q?", "Cat", oracle, block.timestamp + DEADLINE_OFFSET
        );
    }

    function test_CreateMarket_MultipleMarkets() public {
        _createDefaultMarket();
        pm.createMarket{value: INITIAL_LIQUIDITY + pm.serviceFee()}(
            "Will ETH flip BTC?", "Crypto", oracle, block.timestamp + DEADLINE_OFFSET
        );
        assertEq(pm.marketCount(), 2);
    }

    function test_CreateMarket_TransfersServiceFeeToTreasury() public {
        uint256 treasuryBefore = treasury.balance;
        uint256 id = _createDefaultMarket();

        assertEq(treasury.balance, treasuryBefore + pm.serviceFee());

        KitePredictionMarket.Market memory m = pm.getMarketInfo(id);
        assertEq(m.yesReserve + m.noReserve, INITIAL_LIQUIDITY);
    }

    function test_CreateMarket_RevertInsufficientLiquidity() public {
        vm.expectRevert(KitePredictionMarket.InsufficientLiquidity.selector);
        pm.createMarket{value: 0.001 ether}(
            "Q?", "Cat", oracle, block.timestamp + DEADLINE_OFFSET
        );
    }

    function test_CreateMarket_RevertDeadlineInPast() public {
        uint256 funding = INITIAL_LIQUIDITY + pm.serviceFee();
        vm.expectRevert(KitePredictionMarket.DeadlineInPast.selector);
        pm.createMarket{value: funding}(
            "Q?", "Cat", oracle, block.timestamp - 1
        );
    }

    function test_CreateMarket_RevertInvalidOracle() public {
        uint256 funding = INITIAL_LIQUIDITY + pm.serviceFee();
        vm.expectRevert(KitePredictionMarket.InvalidOracle.selector);
        pm.createMarket{value: funding}(
            "Q?", "Cat", address(0), block.timestamp + DEADLINE_OFFSET
        );
    }

    // ─────────────────────────────────────────────────────────────────
    //  3. Buy Shares
    // ─────────────────────────────────────────────────────────────────

    function test_BuyYesShares_Success() public {
        uint256 id = _createDefaultMarket();

        (uint256 expected, ) = pm.quoteBuy(id, true, 0.1 ether);

        vm.prank(alice);
        vm.expectEmit(true, true, false, false);
        emit KitePredictionMarket.SharesBought(id, alice, true, 0.1 ether, expected, 0);
        pm.buyShares{value: 0.1 ether}(id, true, 0);

        (uint256 yesPos, uint256 noPos) = pm.getUserPositions(id, alice);
        assertEq(yesPos, expected);
        assertEq(noPos,  0);
    }

    function test_BuyNoShares_Success() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        pm.buyShares{value: 0.2 ether}(id, false, 0);

        (, uint256 noPos) = pm.getUserPositions(id, alice);
        assertGt(noPos, 0);
    }

    function test_Buy_SlippageRevert() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        vm.expectRevert(KitePredictionMarket.SlippageExceeded.selector);
        pm.buyShares{value: 0.1 ether}(id, true, type(uint256).max);
    }

    function test_Buy_ZeroAmountRevert() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        vm.expectRevert(KitePredictionMarket.ZeroAmount.selector);
        pm.buyShares{value: 0}(id, true, 0);
    }

    function test_Buy_AfterDeadline_Revert() public {
        uint256 id = _createDefaultMarket();
        vm.warp(block.timestamp + DEADLINE_OFFSET + 1);

        vm.prank(alice);
        vm.expectRevert(KitePredictionMarket.TradingDeadlinePassed.selector);
        pm.buyShares{value: 0.1 ether}(id, true, 0);
    }

    function test_Buy_FeesAccumulate() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        pm.buyShares{value: 1 ether}(id, true, 0);

        uint256 expectedFee = (1 ether * FEE_BPS) / 10_000;
        assertEq(pm.accumulatedFees(), expectedFee);
    }

    // ─────────────────────────────────────────────────────────────────
    //  4. Sell Shares
    // ─────────────────────────────────────────────────────────────────

    function test_SellYesShares_Success() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        pm.buyShares{value: 0.5 ether}(id, true, 0);
        (uint256 yesPos, ) = pm.getUserPositions(id, alice);

        uint256 balBefore = alice.balance;

        vm.prank(alice);
        pm.sellShares(id, true, yesPos / 2, 0);

        uint256 balAfter = alice.balance;
        assertGt(balAfter, balBefore);

        (uint256 yesAfter, ) = pm.getUserPositions(id, alice);
        assertEq(yesAfter, yesPos - yesPos / 2);
    }

    function test_Sell_InsufficientSharesRevert() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        vm.expectRevert(KitePredictionMarket.InsufficientShares.selector);
        pm.sellShares(id, true, 1000, 0);
    }

    function test_Sell_SlippageRevert() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        pm.buyShares{value: 0.5 ether}(id, true, 0);
        (uint256 yesPos, ) = pm.getUserPositions(id, alice);

        vm.prank(alice);
        vm.expectRevert(KitePredictionMarket.SlippageExceeded.selector);
        pm.sellShares(id, true, yesPos, type(uint256).max);
    }

    // ─────────────────────────────────────────────────────────────────
    //  5. Resolution
    // ─────────────────────────────────────────────────────────────────

    function test_ResolveYes_Oracle() public {
        uint256 id = _createDefaultMarket();

        vm.prank(oracle);
        vm.expectEmit(true, true, false, true);
        emit KitePredictionMarket.MarketResolved(id, oracle, KitePredictionMarket.Outcome.YES);
        pm.resolveMarket(id, KitePredictionMarket.Outcome.YES);

        KitePredictionMarket.Market memory m = pm.getMarketInfo(id);
        assertEq(uint8(m.status),  uint8(KitePredictionMarket.MarketStatus.RESOLVED));
        assertEq(uint8(m.outcome), uint8(KitePredictionMarket.Outcome.YES));
    }

    function test_ResolveNo_Owner() public {
        uint256 id = _createDefaultMarket();

        // Owner (= address(this)) can also resolve
        pm.resolveMarket(id, KitePredictionMarket.Outcome.NO);

        KitePredictionMarket.Market memory m = pm.getMarketInfo(id);
        assertEq(uint8(m.outcome), uint8(KitePredictionMarket.Outcome.NO));
    }

    function test_Resolve_Revert_NotOracle() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        vm.expectRevert(KitePredictionMarket.NotOracle.selector);
        pm.resolveMarket(id, KitePredictionMarket.Outcome.YES);
    }

    function test_Resolve_Revert_AlreadyResolved() public {
        uint256 id = _createDefaultMarket();
        vm.prank(oracle);
        pm.resolveMarket(id, KitePredictionMarket.Outcome.YES);

        vm.prank(oracle);
        vm.expectRevert(KitePredictionMarket.MarketAlreadyResolved.selector);
        pm.resolveMarket(id, KitePredictionMarket.Outcome.NO);
    }

    // ─────────────────────────────────────────────────────────────────
    //  6. Redeem Winnings
    // ─────────────────────────────────────────────────────────────────

    function test_RedeemYesWinner_Success() public {
        uint256 id = _createDefaultMarket();

        // Alice buys YES, Bob buys NO
        vm.prank(alice);
        pm.buyShares{value: 1 ether}(id, true, 0);

        vm.prank(bob);
        pm.buyShares{value: 1 ether}(id, false, 0);

        // Resolve YES
        vm.prank(oracle);
        pm.resolveMarket(id, KitePredictionMarket.Outcome.YES);

        uint256 aliceBefore = alice.balance;

        vm.prank(alice);
        pm.redeemWinnings(id);

        assertGt(alice.balance, aliceBefore);
    }

    function test_RedeemLoser_Revert() public {
        uint256 id = _createDefaultMarket();

        // Alice buys YES only; Bob never bought NO
        vm.prank(alice);
        pm.buyShares{value: 1 ether}(id, true, 0);

        vm.prank(oracle);
        pm.resolveMarket(id, KitePredictionMarket.Outcome.YES);

        // Bob (no shares) cannot redeem YES
        vm.prank(bob);
        vm.expectRevert(KitePredictionMarket.InsufficientShares.selector);
        pm.redeemWinnings(id);
    }

    function test_RedeemInvalid_BothSidesRefunded() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        pm.buyShares{value: 0.5 ether}(id, true, 0);

        vm.prank(bob);
        pm.buyShares{value: 0.5 ether}(id, false, 0);

        vm.prank(oracle);
        pm.resolveMarket(id, KitePredictionMarket.Outcome.INVALID);

        uint256 aliceBefore = alice.balance;
        uint256 bobBefore   = bob.balance;

        vm.prank(alice);
        pm.redeemWinnings(id);

        vm.prank(bob);
        pm.redeemWinnings(id);

        assertGt(alice.balance, aliceBefore);
        assertGt(bob.balance, bobBefore);
    }

    function test_Redeem_NotResolved_Revert() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        pm.buyShares{value: 0.5 ether}(id, true, 0);

        vm.prank(alice);
        vm.expectRevert(KitePredictionMarket.MarketNotResolved.selector);
        pm.redeemWinnings(id);
    }

    // ─────────────────────────────────────────────────────────────────
    //  7. Admin Functions
    // ─────────────────────────────────────────────────────────────────

    function test_PauseMarket() public {
        uint256 id = _createDefaultMarket();
        pm.pauseMarket(id);

        vm.prank(alice);
        vm.expectRevert(KitePredictionMarket.MarketNotOpen.selector);
        pm.buyShares{value: 0.1 ether}(id, true, 0);
    }

    function test_UnpauseMarket() public {
        uint256 id = _createDefaultMarket();
        pm.pauseMarket(id);
        pm.unpauseMarket(id);

        vm.prank(alice);
        pm.buyShares{value: 0.1 ether}(id, true, 0); // Should succeed
    }

    function test_GlobalPause() public {
        _createDefaultMarket();
        pm.setGlobalPause(true);

        uint256 funding = INITIAL_LIQUIDITY + pm.serviceFee();
        vm.expectRevert(KitePredictionMarket.GloballyPaused.selector);
        pm.createMarket{value: funding}(
            "Q?", "Cat", oracle, block.timestamp + DEADLINE_OFFSET
        );
    }

    function test_SetPlatformFee() public {
        pm.setPlatformFee(300);
        assertEq(pm.platformFeeBps(), 300);
    }

    function test_SetPlatformFee_TooHigh_Revert() public {
        vm.expectRevert(KitePredictionMarket.FeeTooHigh.selector);
        pm.setPlatformFee(600);
    }

    function test_SetTreasuryAddress() public {
        address newTreasury = makeAddr("newTreasury");

        pm.setTreasuryAddress(newTreasury);

        assertEq(pm.treasuryAddress(), newTreasury);
    }

    function test_WithdrawFees() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        pm.buyShares{value: 1 ether}(id, true, 0);

        uint256 feesOwed = pm.accumulatedFees();
        assertGt(feesOwed, 0);

        uint256 ownerBefore = owner.balance;
        pm.withdrawFees(payable(owner));

        assertEq(owner.balance, ownerBefore + feesOwed);
        assertEq(pm.accumulatedFees(), 0);
    }

    function test_UpdateMarketOracle_ByCreator() public {
        uint256 id = _createDefaultMarket();
        address newOracle = makeAddr("newOracle");

        pm.updateMarketOracle(id, newOracle);

        KitePredictionMarket.Market memory m = pm.getMarketInfo(id);
        assertEq(m.oracle, newOracle);
    }

    function test_UpdateMarketOracle_UnauthorizedRevert() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        vm.expectRevert(KitePredictionMarket.NotCreatorOrOwner.selector);
        pm.updateMarketOracle(id, alice);
    }

    // ─────────────────────────────────────────────────────────────────
    //  8. View Helpers
    // ─────────────────────────────────────────────────────────────────

    function test_GetYesProbability_Initially50() public {
        uint256 id = _createDefaultMarket();
        uint256 prob = pm.getYesProbability(id);
        // 50% with some rounding tolerance
        assertApproxEqAbs(prob, 5e17, 1e14);
    }

    function test_GetYesProbability_ShiftsAfterBuy() public {
        uint256 id = _createDefaultMarket();

        vm.prank(alice);
        pm.buyShares{value: 10 ether}(id, true, 0);

        uint256 prob = pm.getYesProbability(id);
        // After heavy YES buying, YES probability rises
        assertGt(prob, 5e17);
    }

    function test_QuoteBuy_Consistent() public {
        uint256 id = _createDefaultMarket();
        (uint256 quoted, ) = pm.quoteBuy(id, true, 0.5 ether);

        vm.prank(alice);
        pm.buyShares{value: 0.5 ether}(id, true, 0);
        (uint256 actual, ) = pm.getUserPositions(id, alice);

        assertEq(quoted, actual);
    }

    function test_GetAllMarkets() public {
        _createDefaultMarket();
        _createDefaultMarket();
        KitePredictionMarket.Market[] memory all = pm.getAllMarkets();
        assertEq(all.length, 2);
    }

    // ─────────────────────────────────────────────────────────────────
    //  9. Fuzz Tests
    // ─────────────────────────────────────────────────────────────────

    function testFuzz_BuyAndSell_NoLoss(uint96 buyAmount) public {
        vm.assume(buyAmount >= 0.001 ether && buyAmount <= 10 ether);

        uint256 id = _createDefaultMarket();

        vm.startPrank(alice);
        pm.buyShares{value: buyAmount}(id, true, 0);

        (uint256 yesPos, ) = pm.getUserPositions(id, alice);
        uint256 balBefore = alice.balance;

        pm.sellShares(id, true, yesPos, 0);
        vm.stopPrank();

        // After fees the user gets back less than they put in – that is expected.
        // The contract should never give back more than the input.
        assertLe(alice.balance - balBefore, buyAmount);
    }

    function testFuzz_CreateMarket(uint256 liquidity, uint256 deadlineOffset) public {
        liquidity      = bound(liquidity,      0.01 ether, 50 ether);
        deadlineOffset = bound(deadlineOffset, 1,           365 days);

        vm.deal(address(this), liquidity + pm.serviceFee());
        uint256 id = pm.createMarket{value: liquidity + pm.serviceFee()}(
            "Fuzz Q?",
            "Fuzz",
            oracle,
            block.timestamp + deadlineOffset
        );
        assertEq(id, pm.marketCount() - 1);
    }

    // ─────────────────────────────────────────────────────────────────
    //  10. Integration: Full Lifecycle
    // ─────────────────────────────────────────────────────────────────

    function test_FullLifecycle_YesWins() public {
        // 1. Create market
        uint256 id = _createDefaultMarket();

        // 2. Multiple users trade
        vm.prank(alice);
        pm.buyShares{value: 2 ether}(id, true, 0);   // Alice bets YES

        vm.prank(bob);
        pm.buyShares{value: 1.5 ether}(id, false, 0); // Bob bets NO

        vm.prank(carol);
        pm.buyShares{value: 0.5 ether}(id, true, 0);  // Carol bets YES

        // Bob changes his mind, sells half
        (, uint256 bobNo) = pm.getUserPositions(id, bob);
        vm.prank(bob);
        pm.sellShares(id, false, bobNo / 2, 0);

        // 3. Resolve YES
        vm.warp(block.timestamp + DEADLINE_OFFSET + 1);
        vm.prank(oracle);
        pm.resolveMarket(id, KitePredictionMarket.Outcome.YES);

        // 4. Winners claim
        uint256 aliceBefore = alice.balance;
        uint256 carolBefore = carol.balance;

        vm.prank(alice);
        pm.redeemWinnings(id);

        vm.prank(carol);
        pm.redeemWinnings(id);

        assertGt(alice.balance, aliceBefore, "Alice should profit");
        assertGt(carol.balance, carolBefore, "Carol should profit");

        // 5. Withdraw platform fees
        uint256 fees = pm.accumulatedFees();
        assertGt(fees, 0);
        pm.withdrawFees(payable(owner));
        assertEq(pm.accumulatedFees(), 0);
    }
}
