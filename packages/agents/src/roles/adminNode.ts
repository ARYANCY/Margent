import { AgentProfile, CanonicalCampaign, RealTrend, AdminAnalysis, AgentEvent } from "../../../shared/src/types/index";
import { llmClient } from "../llm/grok";

export async function executeAdminNode(
  adminAgent: AgentProfile,
  campaign: CanonicalCampaign,
  topTrend: RealTrend,
  aggregatedMetrics: {
    avgSentiment: number;
    activeNodesCount: number;
    simulatedLikes: number;
    simulatedComments: number;
    simulatedConversions: number;
    anomalies: string[];
  }
): Promise<{
  updatedAdmin: AgentProfile;
  analysis: AdminAnalysis;
  event: AgentEvent;
}> {
  const trendScore = topTrend ? (topTrend.growth * 0.4 + topTrend.velocity * 0.4 + topTrend.interest * 0.2) : 85;

  const synthesis = await llmClient.generateAdminSynthesis({
    campaignName: campaign.campaignName,
    channel: campaign.channel,
    topTrendName: topTrend.name,
    topTrendScore: trendScore,
    roas: campaign.roas,
    ctr: campaign.ctr,
    conversions: campaign.conversions,
    sentiment: aggregatedMetrics.avgSentiment,
    anomalies: aggregatedMetrics.anomalies,
    activeAgentCount: aggregatedMetrics.activeNodesCount
  });

  const analysis: AdminAnalysis = {
    decision: synthesis.decision,
    confidence: synthesis.confidence,
    simulatedRoas: campaign.roas,
    summary: synthesis.summary,
    evidence: synthesis.evidence,
    recommendedActions: synthesis.recommendedActions,
    ensembleBreakdown: {
      ml_roas: campaign.roas,
      pytrends_velocity: topTrend.velocity || 88,
      groq_creative_score: 85,
      qml_predicted_roas: 3.85,
      consensus_roas: campaign.roas
    },
    activeAgentsCount: aggregatedMetrics.activeNodesCount,
    timestamp: new Date().toISOString()
  };

  const updatedAdmin: AgentProfile = {
    ...adminAgent,
    status: "DECIDING",
    sentiment: aggregatedMetrics.avgSentiment,
    lastAction: `DECISION: ${synthesis.decision} (Confidence: ${Math.round(synthesis.confidence * 100)}%) - ${synthesis.summary}`,
    lastActionTime: new Date().toISOString()
  };

  const event: AgentEvent = {
    eventId: `evt_admin_${Date.now()}`,
    timestamp: Date.now(),
    source: adminAgent.agentId,
    type: "ADMIN_ANALYSIS",
    payload: analysis
  };

  return { updatedAdmin, analysis, event };
}
