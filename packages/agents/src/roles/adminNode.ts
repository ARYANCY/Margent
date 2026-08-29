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
  const synthesis = await llmClient.generateAdminSynthesis({
    campaignName: campaign.campaignName,
    channel: campaign.channel,
    topTrendName: topTrend.name,
    topTrendScore: topTrend.score,
    roas: campaign.roas,
    ctr: campaign.ctr,
    conversions: campaign.conversions,
    sentiment: aggregatedMetrics.avgSentiment,
    anomalies: aggregatedMetrics.anomalies,
    activeAgentCount: aggregatedMetrics.activeNodesCount
  });

  const analysis: AdminAnalysis = {
    analysisId: `admin_analysis_${Date.now()}`,
    timestamp: new Date().toISOString(),
    priority: synthesis.priority,
    decision: synthesis.decision,
    summary: synthesis.summary,
    evidence: synthesis.evidence,
    recommendedActions: synthesis.recommendedActions,
    confidence: synthesis.confidence,
    exploitationAllocation: synthesis.exploitationAllocation,
    explorationAllocation: synthesis.explorationAllocation,
    activeAgentCount: aggregatedMetrics.activeNodesCount,
    averageSentiment: Math.round(aggregatedMetrics.avgSentiment * 100) / 100,
    topTrendName: topTrend.name,
    topTrendScore: topTrend.score,
    simulatedRoas: campaign.roas,
    simulatedCtr: campaign.ctr,
    simulatedConversions: campaign.conversions,
    anomaliesDetected: aggregatedMetrics.anomalies
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
    simulationId: "sim_live",
    timestamp: new Date().toISOString(),
    source: adminAgent.agentId,
    type: "ADMIN_ANALYSIS",
    payload: analysis
  };

  return { updatedAdmin, analysis, event };
}
