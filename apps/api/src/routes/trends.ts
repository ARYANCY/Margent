import { Router } from "express";
import { dataStore } from "../services/store";
import { simulationScheduler } from "../services/simulationScheduler";

export const trendsRouter = Router();

trendsRouter.get("/", (req, res) => {
  const trends = simulationScheduler.getEngine().getState().trends;
  res.json(trends);
});

trendsRouter.get("/:id", (req, res) => {
  const trends = simulationScheduler.getEngine().getState().trends;
  const trend = trends.find(t => t.trendId === req.params.id);
  if (!trend) {
    return res.status(404).json({ error: "Trend not found" });
  }
  res.json(trend);
});
