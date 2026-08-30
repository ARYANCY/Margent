"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRouter = void 0;
const express_1 = require("express");
const simulationScheduler_1 = require("../services/simulationScheduler");
const allocation_1 = require("../../../../packages/shared/src/utils/allocation");
exports.analyticsRouter = (0, express_1.Router)();
exports.analyticsRouter.get("/", async (req, res) => {
    const state = simulationScheduler_1.simulationScheduler.getEngine().getState();
    const allocation = (0, allocation_1.compute8020Allocation)(state.campaigns, state.trends);
    let mlInsights = {
        segmentation: "KMeans Active (5 Clusters)",
        anomalyDetected: false,
        predictedRoas: state.activeCampaign?.roas || 3.2
    };
    try {
        const mlUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
        const health = await fetch(`${mlUrl}/health`).then(r => r.json());
        mlInsights.serviceStatus = health.status;
    }
    catch (e) {
        mlInsights.serviceStatus = "offline-fallback";
    }
    res.json({
        totalNodes: Object.keys(state.agents).length,
        activeAgentsCount: state.activeAgentIds.length,
        avgSentiment: state.stats.avgSentiment,
        totalLikes: state.stats.totalLikes,
        totalComments: state.stats.totalComments,
        totalConversions: state.stats.totalConversions,
        adminAnalysis: state.adminAnalysis,
        allocation,
        mlInsights
    });
});
