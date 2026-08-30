"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialSimulationState = createInitialSimulationState;
function createInitialSimulationState(agents, trends, campaigns) {
    const agentMap = {};
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
