"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeMarketingNode = executeMarketingNode;
exports.executeContentNode = executeContentNode;
exports.executeTrendNode = executeTrendNode;
exports.executeAnalystNode = executeAnalystNode;
async function executeMarketingNode(agent, campaign, trend) {
    const updatedAgent = {
        ...agent,
        status: "DECIDING",
        lastAction: `Optimized channel allocation on ${campaign.channel} with budget $${campaign.spend}`,
        lastActionTime: new Date().toISOString()
    };
    const event = {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: Date.now(),
        source: agent.agentId,
        target: "content_001",
        type: "ALLOCATION_CHANGED",
        payload: {
            action: "CHANNEL_ALLOCATION_UPDATED",
            channel: campaign.channel,
            budget: campaign.spend,
            trendAligned: trend?.name || "Core Signal"
        }
    };
    return { updatedAgent, event };
}
async function executeContentNode(agent, campaign, trend) {
    const updatedAgent = {
        ...agent,
        status: "ACTING",
        lastAction: `Crafted high-velocity hooks adapted for trend '${trend?.name || campaign.hashtags?.[0] || "Innovation"}'`,
        lastActionTime: new Date().toISOString()
    };
    const event = {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: Date.now(),
        source: agent.agentId,
        target: "customer_001",
        type: "GROQ_CRITIQUE",
        payload: {
            action: "CONTENT_HOOK_GENERATED",
            headline: `Unleash Next-Gen Performance with ${campaign.hashtags?.[0] || "#Innovation"}`,
            variantType: "Trend-Aligned Social Hook"
        }
    };
    return { updatedAgent, event };
}
async function executeTrendNode(agent, trend) {
    const trendScore = Math.round((trend.growth || 0) * 0.4 + (trend.velocity || 0) * 0.4 + (trend.interest || 0) * 0.2);
    const updatedAgent = {
        ...agent,
        status: "OBSERVING",
        lastAction: `Scored trend '${trend.name}' at ${trendScore}/100 (${trend.status})`,
        lastActionTime: new Date().toISOString()
    };
    const event = {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: Date.now(),
        source: agent.agentId,
        target: "strategy_001",
        type: "PYTREND_SPIKE",
        payload: {
            trendId: trend.trendId,
            name: trend.name,
            score: trendScore,
            growth: trend.growth,
            velocity: trend.velocity
        }
    };
    return { updatedAgent, event };
}
async function executeAnalystNode(agent, campaign) {
    const updatedAgent = {
        ...agent,
        status: "ANALYZING",
        lastAction: `Calculated ROAS ${campaign.roas}x, CTR ${(campaign.ctr * 100).toFixed(2)}%, Conversions ${campaign.conversions}`,
        lastActionTime: new Date().toISOString()
    };
    const event = {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: Date.now(),
        source: agent.agentId,
        target: "admin_001",
        type: "ALLOCATION_CHANGED",
        payload: {
            roas: campaign.roas,
            ctr: campaign.ctr,
            cpc: campaign.cpc,
            conversions: campaign.conversions
        }
    };
    return { updatedAgent, event };
}
