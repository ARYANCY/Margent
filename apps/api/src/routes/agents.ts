import { Router } from "express";
import { dataStore } from "../services/store";
import { simulationScheduler } from "../services/simulationScheduler";

export const agentsRouter = Router();

agentsRouter.get("/", (req, res) => {
  const currentState = simulationScheduler.getEngine().getState();
  const agentsList = Object.values(currentState.agents);
  res.json({
    total: agentsList.length,
    simulatedCount: agentsList.filter(a => a.type !== "admin").length,
    adminCount: agentsList.filter(a => a.type === "admin").length,
    agents: agentsList
  });
});

agentsRouter.get("/:id", (req, res) => {
  const currentState = simulationScheduler.getEngine().getState();
  const agent = currentState.agents[req.params.id];
  if (!agent) {
    return res.status(404).json({ error: "Agent not found" });
  }
  res.json(agent);
});
