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
  trends: RealTrend[]
): AllocationResult {
  // Sort trends by score
  const sortedTrends = [...trends].sort((a, b) => b.score - a.score);
  
  // High scoring trends (>80) are candidates for exploitation
  const highTraction = sortedTrends.filter(t => t.score >= 80).map(t => t.name);
  const emerging = sortedTrends.filter(t => t.score < 80).map(t => t.name);
  
  return {
    exploitationAllocation: 0.80,
    explorationAllocation: 0.20,
    promotedTrends: highTraction.slice(0, 3),
    exploratoryOpportunities: emerging.slice(0, 3),
    summary: `Allocating 80% budget to proven campaigns & high-traction trends (${highTraction.slice(0, 2).join(", ") || "Core Channels"}), and 20% to emerging trend variants (${emerging.slice(0, 2).join(", ") || "Emerging Signals"}).`
  };
}
