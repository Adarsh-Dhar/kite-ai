-- CreateEnum
CREATE TYPE "MarketStatus" AS ENUM ('OPEN', 'PENDING_RESOLUTION', 'RESOLVED', 'INVALID', 'PAUSED');

-- CreateEnum
CREATE TYPE "Outcome" AS ENUM ('UNRESOLVED', 'YES', 'NO', 'INVALID');

-- CreateEnum
CREATE TYPE "ResolutionType" AS ENUM ('GITHUB_PR', 'GITHUB_RELEASE', 'GITHUB_ISSUE', 'CI_METRIC', 'CVE_SECURITY', 'WEB3_RPC', 'DAO_GOVERNANCE', 'LLM_JUDGE');

-- CreateTable
CREATE TABLE "markets" (
    "id" TEXT NOT NULL,
    "onchain_market_id" INTEGER,
    "transaction_hash" TEXT,
    "block_number" INTEGER,
    "contract_address" TEXT,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "options" TEXT[] DEFAULT ARRAY['Yes', 'No']::TEXT[],
    "agent_reason" TEXT NOT NULL,
    "resolution_type" "ResolutionType" NOT NULL,
    "data_source_url" TEXT NOT NULL,
    "evaluation_logic" JSONB NOT NULL,
    "source_pr_number" INTEGER,
    "source_pr_url" TEXT,
    "tss_score" DOUBLE PRECISION,
    "status" "MarketStatus" NOT NULL DEFAULT 'OPEN',
    "outcome" "Outcome" NOT NULL DEFAULT 'UNRESOLVED',
    "resolved_at" TIMESTAMP(3),
    "resolution_tx_hash" TEXT,
    "resolution_note" TEXT,
    "initial_liquidity_eth" DOUBLE PRECISION,
    "resolution_deadline" TIMESTAMP(3),
    "resolve_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_attempt_at" TIMESTAMP(3),
    "next_retry_at" TIMESTAMP(3),
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deployed_prs" (
    "id" TEXT NOT NULL,
    "pr_number" INTEGER NOT NULL,
    "pr_title" TEXT NOT NULL,
    "pr_url" TEXT,
    "merged_at" TIMESTAMP(3),
    "tss_score" DOUBLE PRECISION,
    "deployed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "market_id" TEXT,

    CONSTRAINT "deployed_prs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resolution_logs" (
    "id" TEXT NOT NULL,
    "market_id" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "resolver_type" TEXT NOT NULL,
    "raw_response" JSONB,
    "decision" TEXT NOT NULL,
    "reasoning" TEXT,
    "tx_hash" TEXT,
    "block_number" INTEGER,
    "error" TEXT,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resolution_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_cycles" (
    "id" TEXT NOT NULL,
    "cycle_type" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "duration_ms" INTEGER,
    "prs_analysed" INTEGER DEFAULT 0,
    "markets_proposed" INTEGER DEFAULT 0,
    "markets_deployed" INTEGER DEFAULT 0,
    "markets_resolved" INTEGER DEFAULT 0,
    "errors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB,

    CONSTRAINT "agent_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_advisories" (
    "id" TEXT NOT NULL,
    "cve_id" TEXT,
    "ghsa_id" TEXT,
    "severity" TEXT NOT NULL,
    "package_name" TEXT,
    "summary" TEXT,
    "published_at" TIMESTAMP(3),
    "raw_payload" JSONB,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_advisories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "markets_onchain_market_id_key" ON "markets"("onchain_market_id");

-- CreateIndex
CREATE UNIQUE INDEX "markets_transaction_hash_key" ON "markets"("transaction_hash");

-- CreateIndex
CREATE INDEX "markets_status_idx" ON "markets"("status");

-- CreateIndex
CREATE INDEX "markets_resolution_type_idx" ON "markets"("resolution_type");

-- CreateIndex
CREATE INDEX "markets_source_pr_number_idx" ON "markets"("source_pr_number");

-- CreateIndex
CREATE INDEX "markets_next_retry_at_idx" ON "markets"("next_retry_at");

-- CreateIndex
CREATE UNIQUE INDEX "deployed_prs_pr_number_key" ON "deployed_prs"("pr_number");

-- CreateIndex
CREATE UNIQUE INDEX "deployed_prs_market_id_key" ON "deployed_prs"("market_id");

-- CreateIndex
CREATE INDEX "deployed_prs_pr_number_idx" ON "deployed_prs"("pr_number");

-- CreateIndex
CREATE INDEX "resolution_logs_market_id_idx" ON "resolution_logs"("market_id");

-- CreateIndex
CREATE INDEX "resolution_logs_attempted_at_idx" ON "resolution_logs"("attempted_at");

-- CreateIndex
CREATE INDEX "agent_cycles_cycle_type_idx" ON "agent_cycles"("cycle_type");

-- CreateIndex
CREATE INDEX "agent_cycles_started_at_idx" ON "agent_cycles"("started_at");

-- CreateIndex
CREATE UNIQUE INDEX "security_advisories_cve_id_key" ON "security_advisories"("cve_id");

-- CreateIndex
CREATE UNIQUE INDEX "security_advisories_ghsa_id_key" ON "security_advisories"("ghsa_id");

-- CreateIndex
CREATE INDEX "security_advisories_severity_idx" ON "security_advisories"("severity");

-- CreateIndex
CREATE INDEX "security_advisories_published_at_idx" ON "security_advisories"("published_at");

-- AddForeignKey
ALTER TABLE "deployed_prs" ADD CONSTRAINT "deployed_prs_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "markets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resolution_logs" ADD CONSTRAINT "resolution_logs_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "markets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
