// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title  KitePredictionMarket
 * @author KiteAI Dev
 * @notice Production-grade binary prediction market inspired by Polymarket / Augur.
 *         Users buy YES or NO shares using native KITE tokens.
 *         Prices follow a Constant-Product Market-Maker (CPMM) similar to Uniswap v2.
 *         An authorised oracle (or the owner) resolves each market.
 *         Winners redeem shares 1:1 minus a platform fee.
 *
 * ─────────────────────────────────────────────────────────────────────
 *  MARKET LIFECYCLE
 *  ┌─────────────┐   buyShares()    ┌──────────────┐
 *  │   OPEN      │ ────────────► │   OPEN        │
 *  │ (trading)   │ ◄─────────── │ (trading)     │
 *  └──────┬──────┘   sellShares()  └──────┬───────┘
 *         │  resolveMarket()               │
 *         ▼                                │
 *  ┌──────────────┐                        │
 *  │  RESOLVED    │ ◄──────────────────────┘
 *  │  (claimable) │   redeemWinnings()
 *  └──────────────┘
 *  Any market can be PAUSED by owner (emergency).
 * ─────────────────────────────────────────────────────────────────────
 */

import {ReentrancyGuard} from "../lib/ReentrancyGuard.sol";
import {Ownable}         from "../lib/Ownable.sol";

contract KitePredictionMarket is ReentrancyGuard, Ownable {

    // ─────────────────────────────────────────────────────────────────
    //  Constants
    // ─────────────────────────────────────────────────────────────────

    /// @dev 100% in basis points
    uint256 public constant BPS_DENOM = 10_000;

    /// @dev Maximum platform fee: 5 %
    uint256 public constant MAX_FEE_BPS = 500;

    /// @dev Minimum liquidity the market creator must seed (0.01 KITE)
    uint256 public constant MIN_LIQUIDITY = 0.01 ether;

    // ─────────────────────────────────────────────────────────────────
    //  Types
    // ─────────────────────────────────────────────────────────────────

    enum Outcome { UNRESOLVED, YES, NO, INVALID }
    enum MarketStatus { OPEN, PAUSED, RESOLVED }

    struct Market {
        // --- metadata ---
        string  question;          // Human-readable question
        string  category;          // e.g. "Sports", "Crypto", "Politics"
        address creator;           // Who created the market
        address oracle;            // Who can resolve this market
        // --- timing ---
        uint256 createdAt;
        uint256 resolutionDeadline; // Trading closes after this timestamp
        // --- state ---
        MarketStatus status;
        Outcome      outcome;
        // --- CPMM reserves ---
        uint256 yesReserve;        // KITE backing YES shares
        uint256 noReserve;         // KITE backing NO shares
        // --- share supply ---
        uint256 yesSupply;         // Total YES shares outstanding
        uint256 noSupply;          // Total NO shares outstanding
        // --- accounting ---
        uint256 totalVolume;       // Cumulative KITE traded
        uint256 feesCollected;     // Platform fees accrued in this market
    }

    // ─────────────────────────────────────────────────────────────────
    //  State
    // ─────────────────────────────────────────────────────────────────

    uint256 public marketCount;
    uint256 public platformFeeBps;          // Platform fee in BPS (default 200 = 2%)
    uint256 public accumulatedFees;         // Total unclaimed platform fees
    bool    public globalPause;             // Emergency kill-switch

    mapping(uint256 => Market)                            public markets;
    mapping(uint256 => mapping(address => uint256))       public yesShares;
    mapping(uint256 => mapping(address => uint256))       public noShares;
    /// @dev Oracle whitelist (owner can grant/revoke)
    mapping(address => bool)                              public approvedOracles;

    // ─────────────────────────────────────────────────────────────────
    //  Events
    // ─────────────────────────────────────────────────────────────────

    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string  question,
        string  category,
        address oracle,
        uint256 resolutionDeadline,
        uint256 initialLiquidity
    );
    event SharesBought(
        uint256 indexed marketId,
        address indexed buyer,
        bool    isYes,
        uint256 amountIn,
        uint256 sharesOut,
        uint256 fee
    );
    event SharesSold(
        uint256 indexed marketId,
        address indexed seller,
        bool    isYes,
        uint256 sharesIn,
        uint256 amountOut,
        uint256 fee
    );
    event MarketResolved(
        uint256 indexed marketId,
        address indexed resolver,
        Outcome outcome
    );
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed claimer,
        uint256 shares,
        uint256 payout
    );
    event MarketPaused(uint256 indexed marketId);
    event MarketUnpaused(uint256 indexed marketId);
    event OracleUpdated(address indexed oracle, bool approved);
    event FeesWithdrawn(address indexed to, uint256 amount);
    event PlatformFeeUpdated(uint256 newFeeBps);
    event GlobalPauseSet(bool paused);
    event MarketOracleUpdated(uint256 indexed marketId, address newOracle);

    // ─────────────────────────────────────────────────────────────────
    //  Errors
    // ─────────────────────────────────────────────────────────────────

    error MarketNotFound();
    error MarketNotOpen();
    error MarketNotResolved();
    error MarketAlreadyResolved();
    error TradingDeadlinePassed();
    error TradingDeadlineNotPassed();
    error InsufficientLiquidity();
    error InsufficientShares();
    error SlippageExceeded();
    error InvalidOracle();
    error NotOracle();
    error FeeTooHigh();
    error ZeroAmount();
    error GloballyPaused();
    error AlreadyClaimed();
    error InvalidOutcome();
    error DeadlineInPast();
    error NotCreatorOrOwner();

    // ─────────────────────────────────────────────────────────────────
    //  Modifiers
    // ─────────────────────────────────────────────────────────────────

    modifier notGloballyPaused() {
        if (globalPause) revert GloballyPaused();
        _;
    }

    modifier marketExists(uint256 marketId) {
        if (marketId >= marketCount) revert MarketNotFound();
        _;
    }

    modifier marketOpen(uint256 marketId) {
        Market storage m = markets[marketId];
        if (m.status != MarketStatus.OPEN) revert MarketNotOpen();
        if (block.timestamp > m.resolutionDeadline) revert TradingDeadlinePassed();
        _;
    }

    // ─────────────────────────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────────────────────────

    constructor(uint256 _feeBps) Ownable(msg.sender) {
        if (_feeBps > MAX_FEE_BPS) revert FeeTooHigh();
        platformFeeBps = _feeBps;
    }

    // ─────────────────────────────────────────────────────────────────
    //  Market Creation
    // ─────────────────────────────────────────────────────────────────

    /**
     * @notice Create a new prediction market.
     * @param question          Human-readable prediction question.
     * @param category          Market category tag.
     * @param oracle            Address authorised to resolve this market.
     * @param resolutionDeadline Unix timestamp after which trading closes.
     *
     * The creator must send native KITE as initial liquidity.
     * Initial liquidity is split 50/50 between YES and NO reserves.
     */
    function createMarket(
        string  calldata question,
        string  calldata category,
        address oracle,
        uint256 resolutionDeadline
    ) external payable notGloballyPaused returns (uint256 marketId) {
        if (oracle == address(0)) revert InvalidOracle();
        if (msg.value < MIN_LIQUIDITY) revert InsufficientLiquidity();
        if (resolutionDeadline <= block.timestamp) revert DeadlineInPast();

        marketId = marketCount++;

        uint256 half = msg.value / 2;
        uint256 initialShares = _sqrt(half * half); // sqrt(yes*no) = half (since equal)

        Market storage m = markets[marketId];
        m.question           = question;
        m.category           = category;
        m.creator            = msg.sender;
        m.oracle             = oracle;
        m.createdAt          = block.timestamp;
        m.resolutionDeadline = resolutionDeadline;
        m.status             = MarketStatus.OPEN;
        m.outcome            = Outcome.UNRESOLVED;
        m.yesReserve         = half;
        m.noReserve          = msg.value - half;   // handles odd wei
        m.yesSupply          = initialShares;
        m.noSupply            = initialShares;

        // Give creator initial LP shares (equal split)
        yesShares[marketId][msg.sender] = initialShares;
        noShares[marketId][msg.sender]  = initialShares;

        emit MarketCreated(
            marketId,
            msg.sender,
            question,
            category,
            oracle,
            resolutionDeadline,
            msg.value
        );
    }

    // ─────────────────────────────────────────────────────────────────
    //  Trading: Buy
    // ─────────────────────────────────────────────────────────────────

    /**
     * @notice Buy YES or NO shares using native KITE.
     * @param marketId   Target market.
     * @param isYes      true → buy YES, false → buy NO.
     * @param minShares  Slippage guard – minimum shares expected.
     */
    function buyShares(
        uint256 marketId,
        bool    isYes,
        uint256 minShares
    )
        external
        payable
        nonReentrant
        notGloballyPaused
        marketExists(marketId)
        marketOpen(marketId)
    {
        if (msg.value == 0) revert ZeroAmount();

        Market storage m = markets[marketId];

        // Deduct platform fee
        uint256 fee       = (msg.value * platformFeeBps) / BPS_DENOM;
        uint256 amountIn  = msg.value - fee;

        m.feesCollected += fee;
        accumulatedFees += fee;

        // CPMM: x * y = k
        // Buying YES: add amountIn to yesReserve, calculate sharesOut from noReserve side
        uint256 sharesOut;
        if (isYes) {
            sharesOut = _getAmountOut(amountIn, m.yesReserve, m.noReserve);
            m.yesReserve += amountIn;
            m.noReserve  -= sharesOut;   // "shares" denominated in reserve units
            m.yesSupply  += sharesOut;
            yesShares[marketId][msg.sender] += sharesOut;
        } else {
            sharesOut = _getAmountOut(amountIn, m.noReserve, m.yesReserve);
            m.noReserve  += amountIn;
            m.yesReserve -= sharesOut;
            m.noSupply   += sharesOut;
            noShares[marketId][msg.sender] += sharesOut;
        }

        if (sharesOut < minShares) revert SlippageExceeded();

        m.totalVolume += msg.value;

        emit SharesBought(marketId, msg.sender, isYes, msg.value, sharesOut, fee);
    }

    // ─────────────────────────────────────────────────────────────────
    //  Trading: Sell
    // ─────────────────────────────────────────────────────────────────

    /**
     * @notice Sell YES or NO shares back to the AMM.
     * @param marketId  Target market.
     * @param isYes     true → sell YES shares, false → sell NO shares.
     * @param shares    Number of shares to sell.
     * @param minOut    Slippage guard – minimum KITE expected.
     */
    function sellShares(
        uint256 marketId,
        bool    isYes,
        uint256 shares,
        uint256 minOut
    )
        external
        nonReentrant
        notGloballyPaused
        marketExists(marketId)
        marketOpen(marketId)
    {
        if (shares == 0) revert ZeroAmount();

        Market storage m = markets[marketId];

        uint256 amountOut;
        if (isYes) {
            if (yesShares[marketId][msg.sender] < shares) revert InsufficientShares();
            amountOut = _getAmountOut(shares, m.noReserve, m.yesReserve);
            m.noReserve  += shares;
            m.yesReserve -= amountOut;
            m.yesSupply  -= shares;
            yesShares[marketId][msg.sender] -= shares;
        } else {
            if (noShares[marketId][msg.sender] < shares) revert InsufficientShares();
            amountOut = _getAmountOut(shares, m.yesReserve, m.noReserve);
            m.yesReserve += shares;
            m.noReserve  -= amountOut;
            m.noSupply   -= shares;
            noShares[marketId][msg.sender] -= shares;
        }

        uint256 fee      = (amountOut * platformFeeBps) / BPS_DENOM;
        uint256 netOut   = amountOut - fee;

        m.feesCollected += fee;
        accumulatedFees += fee;

        if (netOut < minOut) revert SlippageExceeded();

        m.totalVolume += amountOut;

        _safeTransferETH(msg.sender, netOut);

        emit SharesSold(marketId, msg.sender, isYes, shares, netOut, fee);
    }

    // ─────────────────────────────────────────────────────────────────
    //  Resolution
    // ─────────────────────────────────────────────────────────────────

    /**
     * @notice Resolve a market.  Only callable by the market's oracle or owner.
     * @param marketId  Target market.
     * @param outcome   YES, NO, or INVALID.
     *
     * INVALID means the question was unanswerable – all users get a pro-rata
     * refund from the total pool.
     */
    function resolveMarket(
        uint256 marketId,
        Outcome outcome
    )
        external
        nonReentrant
        notGloballyPaused
        marketExists(marketId)
    {
        Market storage m = markets[marketId];
        if (m.status == MarketStatus.RESOLVED) revert MarketAlreadyResolved();
        if (outcome == Outcome.UNRESOLVED)      revert InvalidOutcome();

        // Allow oracle OR owner to resolve
        if (msg.sender != m.oracle && msg.sender != owner()) revert NotOracle();

        m.status  = MarketStatus.RESOLVED;
        m.outcome = outcome;

        emit MarketResolved(marketId, msg.sender, outcome);
    }

    // ─────────────────────────────────────────────────────────────────
    //  Claim Winnings
    // ─────────────────────────────────────────────────────────────────

    /**
     * @notice Redeem winning shares for KITE after market resolution.
     * @param marketId Target market.
     *
     * Payout per winning share = totalPool / winningSupply  (minus fee already deducted).
     * For INVALID outcome, YES and NO shares both get a proportional refund.
     */
    function redeemWinnings(uint256 marketId)
        external
        nonReentrant
        marketExists(marketId)
    {
        Market storage m = markets[marketId];
        if (m.status != MarketStatus.RESOLVED) revert MarketNotResolved();

        uint256 payout;

        if (m.outcome == Outcome.YES) {
            uint256 userShares = yesShares[marketId][msg.sender];
            if (userShares == 0) revert InsufficientShares();
            yesShares[marketId][msg.sender] = 0;

            // Total pool = yesReserve + noReserve at time of resolution
            uint256 totalPool = m.yesReserve + m.noReserve;
            payout = (userShares * totalPool) / m.yesSupply;

        } else if (m.outcome == Outcome.NO) {
            uint256 userShares = noShares[marketId][msg.sender];
            if (userShares == 0) revert InsufficientShares();
            noShares[marketId][msg.sender] = 0;

            uint256 totalPool = m.yesReserve + m.noReserve;
            payout = (userShares * totalPool) / m.noSupply;

        } else {
            // INVALID – proportional refund for both YES and NO holders
            uint256 yUser = yesShares[marketId][msg.sender];
            uint256 nUser = noShares[marketId][msg.sender];
            if (yUser == 0 && nUser == 0) revert InsufficientShares();

            uint256 totalPool = m.yesReserve + m.noReserve;
            uint256 totalSupply = m.yesSupply + m.noSupply;

            payout = ((yUser + nUser) * totalPool) / totalSupply;

            yesShares[marketId][msg.sender] = 0;
            noShares[marketId][msg.sender]  = 0;
        }

        if (payout == 0) revert ZeroAmount();

        _safeTransferETH(msg.sender, payout);

        emit WinningsClaimed(marketId, msg.sender, 0 /* logged above */, payout);
    }

    // ─────────────────────────────────────────────────────────────────
    //  Admin: Market Controls
    // ─────────────────────────────────────────────────────────────────

    function pauseMarket(uint256 marketId)
        external
        onlyOwner
        marketExists(marketId)
    {
        markets[marketId].status = MarketStatus.PAUSED;
        emit MarketPaused(marketId);
    }

    function unpauseMarket(uint256 marketId)
        external
        onlyOwner
        marketExists(marketId)
    {
        Market storage m = markets[marketId];
        if (m.status == MarketStatus.RESOLVED) revert MarketAlreadyResolved();
        m.status = MarketStatus.OPEN;
        emit MarketUnpaused(marketId);
    }

    function updateMarketOracle(uint256 marketId, address newOracle)
        external
        marketExists(marketId)
    {
        Market storage m = markets[marketId];
        if (msg.sender != m.creator && msg.sender != owner()) revert NotCreatorOrOwner();
        if (newOracle == address(0)) revert InvalidOracle();
        m.oracle = newOracle;
        emit MarketOracleUpdated(marketId, newOracle);
    }

    // ─────────────────────────────────────────────────────────────────
    //  Admin: Platform
    // ─────────────────────────────────────────────────────────────────

    function setGlobalPause(bool paused) external onlyOwner {
        globalPause = paused;
        emit GlobalPauseSet(paused);
    }

    function setPlatformFee(uint256 feeBps) external onlyOwner {
        if (feeBps > MAX_FEE_BPS) revert FeeTooHigh();
        platformFeeBps = feeBps;
        emit PlatformFeeUpdated(feeBps);
    }

    function setApprovedOracle(address oracle, bool approved) external onlyOwner {
        approvedOracles[oracle] = approved;
        emit OracleUpdated(oracle, approved);
    }

    function withdrawFees(address payable to) external onlyOwner nonReentrant {
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        _safeTransferETH(to, amount);
        emit FeesWithdrawn(to, amount);
    }

    // ─────────────────────────────────────────────────────────────────
    //  View Helpers
    // ─────────────────────────────────────────────────────────────────

    /// @notice Returns the implied probability of YES (in 1e18 = 100%)
    function getYesProbability(uint256 marketId)
        external
        view
        marketExists(marketId)
        returns (uint256)
    {
        Market storage m = markets[marketId];
        uint256 total = m.yesReserve + m.noReserve;
        if (total == 0) return 5e17; // 50%
        // Price of YES = noReserve / total  (from CPMM geometry)
        return (m.noReserve * 1e18) / total;
    }

    /// @notice Quote: how many shares would `amountIn` KITE buy?
    function quoteBuy(
        uint256 marketId,
        bool    isYes,
        uint256 amountIn
    ) external view marketExists(marketId) returns (uint256 sharesOut, uint256 fee) {
        Market storage m = markets[marketId];
        fee      = (amountIn * platformFeeBps) / BPS_DENOM;
        uint256 net = amountIn - fee;
        if (isYes) {
            sharesOut = _getAmountOut(net, m.yesReserve, m.noReserve);
        } else {
            sharesOut = _getAmountOut(net, m.noReserve, m.yesReserve);
        }
    }

    /// @notice Quote: how much KITE would selling `shares` return?
    function quoteSell(
        uint256 marketId,
        bool    isYes,
        uint256 shares
    ) external view marketExists(marketId) returns (uint256 amountOut, uint256 fee) {
        Market storage m = markets[marketId];
        uint256 rawOut;
        if (isYes) {
            rawOut = _getAmountOut(shares, m.noReserve, m.yesReserve);
        } else {
            rawOut = _getAmountOut(shares, m.yesReserve, m.noReserve);
        }
        fee       = (rawOut * platformFeeBps) / BPS_DENOM;
        amountOut = rawOut - fee;
    }

    function getUserPositions(uint256 marketId, address user)
        external
        view
        returns (uint256 yes, uint256 no)
    {
        yes = yesShares[marketId][user];
        no  = noShares[marketId][user];
    }

    function getMarketInfo(uint256 marketId)
        external
        view
        marketExists(marketId)
        returns (Market memory)
    {
        return markets[marketId];
    }

    function getAllMarkets() external view returns (Market[] memory all) {
        all = new Market[](marketCount);
        for (uint256 i; i < marketCount; i++) {
            all[i] = markets[i];
        }
    }

    // ─────────────────────────────────────────────────────────────────
    //  Internal: AMM Math
    // ─────────────────────────────────────────────────────────────────

    /**
     * @dev Standard CPMM output formula: dy = y * dx / (x + dx)
     *      (no fee – fee is taken before this call)
     */
    function _getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256) {
        if (amountIn == 0 || reserveIn == 0 || reserveOut == 0) return 0;
        return (reserveOut * amountIn) / (reserveIn + amountIn);
    }

    /// @dev Babylonian square-root
    function _sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _safeTransferETH(address to, uint256 amount) internal {
        (bool ok,) = to.call{value: amount}("");
        require(ok, "ETH transfer failed");
    }

    receive() external payable {}
}
