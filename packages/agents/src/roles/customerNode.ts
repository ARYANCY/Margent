import { AgentProfile, CanonicalCampaign, AgentEvent, RealTrend } from "../../../shared/src/types/index";
import { llmClient } from "../llm/grok";

export async function executeCustomerNode(
  agent: AgentProfile,
  campaign: CanonicalCampaign,
  trend?: RealTrend
): Promise<{
  updatedAgent: AgentProfile;
  event: AgentEvent;
}> {
  const trendAlignment = campaign.trendAlignment || (trend ? trend.score : 75);
  
  const reaction = await llmClient.generateCustomerReaction({
    agentId: agent.agentId,
    agentName: agent.name,
    segment: agent.segment || "general",
    trendSensitivity: agent.trendSensitivity || 0.7,
    priceSensitivity: agent.priceSensitivity || 0.5,
    campaignTitle: campaign.campaignName,
    caption: campaign.caption || "",
    hashtags: campaign.hashtags || [],
    channel: campaign.channel,
    trendAlignment
  });

  const updatedAgent: AgentProfile = {
    ...agent,
    status: reaction.action === "COMMENT" ? "COMMENTING" : (reaction.action === "LIKE" ? "ACTING" : "OBSERVING"),
    sentiment: reaction.sentiment,
    engagementScore: Math.min(100, Math.max(10, agent.engagementScore + (reaction.action === "LIKE" || reaction.action === "COMMENT" ? 5 : -2))),
    lastAction: `${reaction.action}: ${reaction.simulatedComment || reaction.reason}`,
    lastActionTime: new Date().toISOString()
  };

  const event: AgentEvent = {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    simulationId: "sim_live",
    timestamp: new Date().toISOString(),
    source: agent.agentId,
    target: "marketing_001",
    type: reaction.action === "LIKE" ? "LIKE" : (reaction.action === "COMMENT" ? "COMMENT" : (reaction.action === "CONVERSION" ? "CONVERSION" : "CAMPAIGN_VIEWED")),
    payload: {
      action: reaction.action,
      sentiment: reaction.sentiment,
      comment: reaction.simulatedComment,
      reason: reaction.reason,
      confidence: reaction.confidence,
      campaignId: campaign.campaignId
    }
  };

  return { updatedAgent, event };
}
