import { CanonicalCampaign } from "../types";

/**
 * Computes canonical derived marketing metrics safely with division-by-zero protection
 */
export function deriveCampaignMetrics(raw: {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  engagements: number;
  trendAlignment?: number;
}) {
  const impressions = Math.max(0, raw.impressions);
  const clicks = Math.max(0, raw.clicks);
  const spend = Math.max(0, raw.spend);
  const conversions = Math.max(0, raw.conversions);
  const revenue = Math.max(0, raw.revenue);
  const engagements = Math.max(0, raw.engagements);

  const ctr = impressions > 0 ? clicks / impressions : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const conversionRate = clicks > 0 ? conversions / clicks : 0;
  const roas = spend > 0 ? revenue / spend : 0;
  const engagementRate = impressions > 0 ? engagements / impressions : 0;

  return {
    ctr: Math.round(ctr * 10000) / 10000,
    cpc: Math.round(cpc * 100) / 100,
    conversionRate: Math.round(conversionRate * 10000) / 10000,
    roas: Math.round(roas * 100) / 100,
    engagementRate: Math.round(engagementRate * 10000) / 10000,
    trendAlignment: raw.trendAlignment || 75
  };
}
