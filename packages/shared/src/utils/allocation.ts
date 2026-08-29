import { CanonicalCampaign, RealTrend } from "../types";

export interface AllocationResult {
  exploitationAllocation: number; // e.g. 0.80
  explorationAllocation: number;  // e.g. 0.20
  promotedTrends: string[];
  exploratoryOpportunities: string[];
  summary: string;
}

/**
 * Computes dynamic 80/20 allocation across campaigns and emerging trends
 */
export function compute8020Allocation(
  campaigns: CanonicalCampaign[],
  trends: RealTrend[],
  customExploitationRatio: number = 0.80
): AllocationResult {
  const getTrendScore = (t: RealTrend): number => {
    return (t.growth || 0) * 0.4 + (t.velocity || 0) * 0.4 + (t.interest || 0) * 0.2;
  };

  // Sort trends by computed composite score
  const sortedTrends = [...trends].sort((a, b) => getTrendScore(b) - getTrendScore(a));
  
  // High scoring trends (>75) are candidates for exploitation
  const highTraction = sortedTrends.filter(t => getTrendScore(t) >= 75).map(t => t.name);
  const emerging = sortedTrends.filter(t => getTrendScore(t) < 75).map(t => t.name);
  
  const exploitation = Math.max(0.1, Math.min(0.95, customExploitationRatio));
  const exploration = Number((1.0 - exploitation).toFixed(2));

  return {
    exploitationAllocation: exploitation,
    explorationAllocation: exploration,
    promotedTrends: highTraction.slice(0, 3),
    exploratoryOpportunities: emerging.slice(0, 3),
    summary: `Allocating ${Math.round(exploitation * 100)}% budget to proven campaigns & high-traction trends (${highTraction.slice(0, 2).join(", ") || "Core Channels"}), and ${Math.round(exploration * 100)}% to emerging trend variants (${emerging.slice(0, 2).join(", ") || "Emerging Signals"}).`
  };
}
