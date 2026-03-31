// frontend/app/api/explore/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// ── Ecosystem & Language mappings ─────────────────────────────────────────────
// Map repo names to their ecosystem and primary language.
// Extend this as you add more repos to the scout list.

const ECOSYSTEM_MAP: Record<string, string> = {
  'anza-xyz': 'Solana',
  'solana-labs': 'Solana',
  'ethereum': 'Ethereum',
  'ethers-io': 'Ethereum',
  'bitcoin': 'Bitcoin',
  'polygon': 'Polygon',
  'arbitrum': 'Arbitrum',
  'optimism': 'Optimism',
}

const LANGUAGE_MAP: Record<string, string> = {
  'agave': 'Rust',
  'solana': 'Rust',
  'go-ethereum': 'Go',
  'bitcoin': 'C++',
  'contracts': 'TypeScript',
  'stylus': 'Rust',
  'optimism': 'TypeScript',
}

function inferEcosystem(repoName: string): string {
  const owner = repoName.split('/')[0] ?? ''
  return ECOSYSTEM_MAP[owner] ?? 'Unknown'
}

function inferLanguage(repoName: string): string {
  const repo = repoName.split('/')[1] ?? ''
  for (const [key, lang] of Object.entries(LANGUAGE_MAP)) {
    if (repo.toLowerCase().includes(key)) return lang
  }
  return 'Rust' // sensible default for blockchain repos
}

// ── GET /api/explore ──────────────────────────────────────────────────────────

export async function GET() {
  try {

    // ── 1. Get average TSS per repo (last 7 days) ────────────────────────────
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Workaround: fetch all DeployedPRs, group by repoName in JS
    const allPRsRaw = await prisma.deployedPR.findMany();
    // Map repo_name to repoName for downstream code
    const allPRs = allPRsRaw.map(pr => ({ ...pr, repoName: (pr as any).repoName ?? (pr as any).repo_name }));
    // Filter out PRs with null repoName or deployedAt < sevenDaysAgo
    const validPRs = allPRs.filter(pr => pr.repoName && pr.deployedAt && pr.deployedAt >= sevenDaysAgo);
    // Group by repoName
    const tssAggMap: Record<string, { tssSum: number, count: number, maxDeployedAt: Date, prCount: number }> = {};
    for (const pr of validPRs) {
      const repo = pr.repoName!;
      if (!tssAggMap[repo]) {
        tssAggMap[repo] = { tssSum: 0, count: 0, maxDeployedAt: pr.deployedAt!, prCount: 0 };
      }
      if (typeof pr.tssScore === 'number') {
        tssAggMap[repo].tssSum += pr.tssScore;
        tssAggMap[repo].count += 1;
      }
      if (pr.deployedAt! > tssAggMap[repo].maxDeployedAt) {
        tssAggMap[repo].maxDeployedAt = pr.deployedAt!;
      }
      tssAggMap[repo].prCount += 1;
    }
    // Convert to array for downstream processing
    const tssAgg = Object.entries(tssAggMap).map(([repoName, agg]) => ({
      repoName,
      _avg: { tssScore: agg.count > 0 ? agg.tssSum / agg.count : 0 },
      _max: { deployedAt: agg.maxDeployedAt },
      _count: { id: agg.prCount },
    }));

    // ── 2. Get status per repo (derived from linked Markets) ─────────────────
    // A repo is "Active" if it has any OPEN market, "Pending" if it has
    // DeployedPRs without markets, "Resolved" if all markets are RESOLVED.
    const marketStatusByRepoRaw = await prisma.deployedPR.findMany({
      include: {
        market: {
          select: { status: true },
        },
      },
    });
    const marketStatusByRepo = marketStatusByRepoRaw.map(pr => ({ ...pr, repoName: (pr as any).repoName ?? (pr as any).repo_name }));

    const repoStatusMap: Record<string, 'Active' | 'Pending' | 'Resolved'> = {}
    for (const row of marketStatusByRepo) {
      if (!row.repoName) continue;
      const repo = row.repoName;
      const status = row.market?.status;
      if (status === 'OPEN') {
        repoStatusMap[repo] = 'Active';
      } else if (!repoStatusMap[repo]) {
        // No market or resolved
        repoStatusMap[repo] = status === 'RESOLVED' ? 'Resolved' : 'Pending';
      }
    }

    // ── 3. Get lastScan from AgentCycles ─────────────────────────────────────
    // The most recent completed SCOUT cycle gives us the "last scan" timestamp.
    const lastScoutCycle = await prisma.agentCycle.findFirst({
      where: {
        cycleType: 'SCOUT',
        completedAt: { not: null },
      },
      orderBy: { completedAt: 'desc' },
      select: { completedAt: true },
    })

    const lastScan = lastScoutCycle?.completedAt?.toISOString() ?? new Date().toISOString()

    await prisma.$disconnect()

    // ── 4. Shape the response payload ─────────────────────────────────────────
    const payload = tssAgg
      .filter((row: any) => row.repoName && row._max.deployedAt >= sevenDaysAgo)
      .map((row: any) => {
        const repoName = row.repoName;
        const avgTss = row._avg.tssScore ?? 0;
        const activityScore = Math.round(avgTss * 100);
        return {
          repository: repoName,
          ecosystem: inferEcosystem(repoName),
          language: inferLanguage(repoName),
          activityScore,
          status: repoStatusMap[repoName] ?? 'Pending',
          lastScan,
          prCount: row._count.id,
        };
      })
      .sort((a: { activityScore: number }, b: { activityScore: number }) => b.activityScore - a.activityScore);

    return NextResponse.json(payload)
  } catch (error) {
    console.error('[/api/explore] DB error:', error)
    // Return an empty array rather than a 500 — the UI handles empty state gracefully
    return NextResponse.json([])
  }
}