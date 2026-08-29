import { AgentProfile, CanonicalCampaign, RealTrend, AgentEvent, AdminAnalysis } from "../../shared/src/types/index";

export interface SimulationGraphState {
  simulationId: string;
  tick: number;
  activeAgentIds: string[];
  agents: Record<string, AgentProfile>;
  trends: RealTrend[];
  campaigns: CanonicalCampaign[];
  activeCampaign?: CanonicalCampaign;
  events: AgentEvent[];
  activeEdges: { source: string; target: string; eventType: string }[];
  adminAnalysis?: AdminAnalysis;
  stats: {
    totalLikes: number;
    totalComments: number;
    totalConversions: number;
    avgSentiment: number;
    totalEvents: number;
  };
}

export function createInitialSimulationState(
  agents: AgentProfile[],
  trends: RealTrend[],
  campaigns: CanonicalCampaign[]
): SimulationGraphState {
  const agentMap: Record<string, AgentProfile> = {};
  for (const agent of agents) {
    agentMap[agent.agentId] = { ...agent };
  }

  return {
    simulationId: `sim_${Date.now()}`,
    tick: 0,
    activeAgentIds: [],
    agents: agentMap,
    trends,
    campaigns,
    activeCampaign: campaigns[0],
    events: [],
    activeEdges: [],
    adminAnalysis: undefined,
    stats: {
      totalLikes: 0,
      totalComments: 0,
      totalConversions: 0,
      avgSentiment: 0.15,
      totalEvents: 0
    }
  };
}
