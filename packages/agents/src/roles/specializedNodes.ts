import { AgentProfile, CanonicalCampaign, AgentEvent, RealTrend } from "../../../shared/src/types/index";

export async function executeMarketingNode(
  agent: AgentProfile,
  campaign: CanonicalCampaign,
  trend?: RealTrend
): Promise<{ updatedAgent: AgentProfile; event: AgentEvent }> {
  const updatedAgent: AgentProfile = {
    ...agent,
    status: "DECIDING",
    lastAction: `Optimized channel allocation on ${campaign.channel} with budget $${campaign.spend}`,
    lastActionTime: new Date().toISOString()
  };

  const event: AgentEvent = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    simulationId: "sim_live",
    timestamp: new Date().toISOString(),
    source: agent.agentId,
    target: "content_001",
    type: "EDGE_ACTIVATE",
    payload: {
      action: "CHANNEL_ALLOCATION_UPDATED",
      channel: campaign.channel,
      budget: campaign.spend,
      trendAligned: trend?.name || "Core Signal"
    }
  };

  return { updatedAgent, event };
}

export async function executeContentNode(
  agent: AgentProfile,
  campaign: CanonicalCampaign,
  trend?: RealTrend
): Promise<{ updatedAgent: AgentProfile; event: AgentEvent }> {
  const updatedAgent: AgentProfile = {
    ...agent,
    status: "ACTING",
    lastAction: `Crafted high-velocity hooks adapted for trend '${trend?.name || campaign.hashtags?.[0] || "Innovation"}'`,
    lastActionTime: new Date().toISOString()
  };

  const event: AgentEvent = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    simulationId: "sim_live",
    timestamp: new Date().toISOString(),
    source: agent.agentId,
    target: "customer_001",
    type: "EDGE_ACTIVATE",
    payload: {
      action: "CONTENT_HOOK_GENERATED",
      headline: `Unleash Next-Gen Performance with ${campaign.hashtags?.[0] || "#Innovation"}`,
      variantType: "Trend-Aligned Social Hook"
    }
  };

  return { updatedAgent, event };
}

export async function executeTrendNode(
  agent: AgentProfile,
  trend: RealTrend
): Promise<{ updatedAgent: AgentProfile; event: AgentEvent }> {
  const updatedAgent: AgentProfile = {
    ...agent,
    status: "OBSERVING",
    lastAction: `Scored trend '${trend.name}' at ${trend.score}/100 (${trend.status})`,
    lastActionTime: new Date().toISOString()
  };

  const event: AgentEvent = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    simulationId: "sim_live",
    timestamp: new Date().toISOString(),
    source: agent.agentId,
    target: "strategy_001",
    type: "TREND_UPDATED",
    payload: {
      trendId: trend.trendId,
      name: trend.name,
      score: trend.score,
      growth: trend.growth,
      velocity: trend.velocity
    }
  };

  return { updatedAgent, event };
}

export async function executeAnalystNode(
  agent: AgentProfile,
  campaign: CanonicalCampaign
): Promise<{ updatedAgent: AgentProfile; event: AgentEvent }> {
  const updatedAgent: AgentProfile = {
    ...agent,
    status: "ANALYZING",
    lastAction: `Calculated ROAS ${campaign.roas}x, CTR ${(campaign.ctr * 100).toFixed(2)}%, Conversions ${campaign.conversions}`,
    lastActionTime: new Date().toISOString()
  };

  const event: AgentEvent = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    simulationId: "sim_live",
    timestamp: new Date().toISOString(),
    source: agent.agentId,
    target: "admin_001",
    type: "EDGE_ACTIVATE",
    payload: {
      roas: campaign.roas,
      ctr: campaign.ctr,
      cpc: campaign.cpc,
      conversions: campaign.conversions
    }
  };

  return { updatedAgent, event };
}
