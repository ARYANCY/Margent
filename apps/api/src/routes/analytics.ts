import { Router } from "express";
import { simulationScheduler } from "../services/simulationScheduler";
import { compute8020Allocation } from "../../../../packages/shared/src/utils/allocation";

export const analyticsRouter = Router();

analyticsRouter.get("/", async (req, res) => {
  const state = simulationScheduler.getEngine().getState();
  const allocation = compute8020Allocation(state.campaigns, state.trends);
  
  let mlInsights: any = {
    segmentation: "KMeans Active (5 Clusters)",
    anomalyDetected: false,
    predictedRoas: state.activeCampaign?.roas || 3.2
  };

  try {
    const mlUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
    const health = await fetch(`${mlUrl}/health`).then(r => r.json());
    mlInsights.serviceStatus = health.status;
  } catch (e) {
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
