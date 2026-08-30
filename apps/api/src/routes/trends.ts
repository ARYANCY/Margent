import { Router } from "express";
import { dataStore } from "../services/store";
import { prisma } from "../services/prisma";
import { simulationScheduler } from "../services/simulationScheduler";
import { RealTrend } from "@shared/types";

export const trendsRouter = Router();

// GET all trends
trendsRouter.get("/", (req, res) => {
  const trends = simulationScheduler.getEngine().getState().trends;
  res.json(trends);
});

// GET trend by ID
trendsRouter.get("/:id", (req, res) => {
  const trends = simulationScheduler.getEngine().getState().trends;
  const trend = trends.find(t => t.trendId === req.params.id);
  if (!trend) {
    return res.status(404).json({ error: "Trend not found" });
  }
  res.json(trend);
});

// POST create trend (Admin)
trendsRouter.post("/", async (req, res) => {
  try {
    const trendData: RealTrend = req.body;
    if (!trendData.trendId || !trendData.name || !trendData.hashtag) {
      return res.status(400).json({ error: "Missing required trend fields: trendId, name, hashtag" });
    }

    // Save to PostgreSQL
    const newDbTrend = await prisma.realTrend.create({
      data: {
        trendId: trendData.trendId,
        name: trendData.name,
        hashtag: trendData.hashtag,
        source: trendData.source || "Google Trends",
        timestamp: trendData.timestamp || new Date().toISOString(),
        growth: trendData.growth ?? 0,
        interest: trendData.interest ?? 50,
        velocity: trendData.velocity ?? 0,
        status: trendData.status || "STEADY",
      }
    });

    const formattedTrend: RealTrend = {
      ...newDbTrend,
      status: newDbTrend.status as any,
    };

    // Update in-memory arrays and simulation engine state
    dataStore.trends.push(formattedTrend);
    simulationScheduler.getEngine().getState().trends.push(formattedTrend);

    res.status(201).json(formattedTrend);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create trend", details: err.message });
  }
});

// PUT update trend (Admin)
trendsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const trendData = req.body;

    // Update in PostgreSQL
    const updatedDbTrend = await prisma.realTrend.update({
      where: { trendId: id },
      data: {
        name: trendData.name,
        hashtag: trendData.hashtag,
        source: trendData.source,
        timestamp: trendData.timestamp,
        growth: trendData.growth,
        interest: trendData.interest,
        velocity: trendData.velocity,
        status: trendData.status,
      }
    });

    const formattedTrend: RealTrend = {
      ...updatedDbTrend,
      status: updatedDbTrend.status as any,
    };

    // Update in-memory arrays and simulation engine state
    const dsIndex = dataStore.trends.findIndex(t => t.trendId === id);
    if (dsIndex !== -1) {
      dataStore.trends[dsIndex] = formattedTrend;
    }
    const stateTrends = simulationScheduler.getEngine().getState().trends;
    const stateIndex = stateTrends.findIndex(t => t.trendId === id);
    if (stateIndex !== -1) {
      stateTrends[stateIndex] = formattedTrend;
    }

    res.json(formattedTrend);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update trend", details: err.message });
  }
});

// DELETE trend (Admin)
trendsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete from PostgreSQL
    await prisma.realTrend.delete({
      where: { trendId: id }
    });

    // Delete from in-memory arrays and simulation engine state
    dataStore.trends = dataStore.trends.filter(t => t.trendId !== id);
    const engineState = simulationScheduler.getEngine().getState();
    engineState.trends = engineState.trends.filter(t => t.trendId !== id);

    res.json({ success: true, message: `Trend ${id} deleted successfully.` });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete trend", details: err.message });
  }
});
