"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCustomerNode = executeCustomerNode;
const grok_1 = require("../llm/grok");
async function executeCustomerNode(agent, campaign, trend) {
    const trendScore = trend ? (trend.growth * 0.4 + trend.velocity * 0.4 + trend.interest * 0.2) : 75;
    const trendAlignment = campaign.trendAlignment || trendScore;
    const reaction = await grok_1.llmClient.generateCustomerReaction({
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
    const updatedAgent = {
        ...agent,
        status: reaction.action === "COMMENT" ? "COMMENTING" : (reaction.action === "LIKE" ? "ACTING" : "OBSERVING"),
        sentiment: reaction.sentiment,
        engagementScore: Math.min(100, Math.max(10, agent.engagementScore + (reaction.action === "LIKE" || reaction.action === "COMMENT" ? 5 : -2))),
        lastAction: `${reaction.action}: ${reaction.simulatedComment || reaction.reason}`,
        lastActionTime: new Date().toISOString()
    };
    const event = {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: Date.now(),
        source: agent.agentId,
        target: "marketing_001",
        type: "COMMENT",
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
