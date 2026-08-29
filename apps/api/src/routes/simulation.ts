import { Router } from "express";
import { simulationScheduler } from "../services/simulationScheduler";

export const simulationRouter = Router();

simulationRouter.get("/status", (req, res) => {
  res.json(simulationScheduler.getRunningStatus());
});

simulationRouter.post("/start", (req, res) => {
  simulationScheduler.start();
  res.json({ message: "Simulation started", ...simulationScheduler.getRunningStatus() });
});

simulationRouter.post("/pause", (req, res) => {
  simulationScheduler.pause();
  res.json({ message: "Simulation paused", ...simulationScheduler.getRunningStatus() });
});

simulationRouter.post("/stop", (req, res) => {
  simulationScheduler.stop();
  res.json({ message: "Simulation stopped", ...simulationScheduler.getRunningStatus() });
});

simulationRouter.post("/step", async (req, res) => {
  await simulationScheduler.step();
  res.json({ message: "Simulation advanced 1 tick", ...simulationScheduler.getRunningStatus() });
});

simulationRouter.post("/speed", (req, res) => {
  const speed = parseFloat(req.body.speed) || 1.0;
  simulationScheduler.setSpeed(speed);
  res.json({ message: `Speed set to ${speed}x`, ...simulationScheduler.getRunningStatus() });
});
