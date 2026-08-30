import { Router } from "express";
import { dataStore } from "../services/store";
import { prisma } from "../services/prisma";
import { simulationScheduler } from "../services/simulationScheduler";
import { AgentProfile } from "@shared/types";

export const agentsRouter = Router();

// Helper to format Prisma AgentProfile to shared AgentProfile (null -> undefined)
function formatDbAgent(agent: any): AgentProfile {
  return {
    agentId: agent.agentId,
    name: agent.name,
    type: agent.type as any,
    roleDescription: agent.roleDescription,
    avatar: agent.avatar,
    pipelineGroup: agent.pipelineGroup as any,
    status: agent.status as any,
    sentiment: agent.sentiment,
    engagementScore: agent.engagementScore,
    lastAction: agent.lastAction || undefined,
    lastActionTime: agent.lastActionTime || undefined,
    segment: agent.segment as any || undefined,
    trendSensitivity: agent.trendSensitivity ?? undefined,
    priceSensitivity: agent.priceSensitivity ?? undefined,
    brandAffinity: agent.brandAffinity ?? undefined,
    engagementProbability: agent.engagementProbability ?? undefined,
    specialization: agent.specialization || undefined,
    modelType: agent.modelType || undefined,
    quantumExpectation: agent.quantumExpectation ?? undefined,
    searchMomentumScore: agent.searchMomentumScore ?? undefined,
  };
}

// GET all agents
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

// GET agent by ID
agentsRouter.get("/:id", (req, res) => {
  const currentState = simulationScheduler.getEngine().getState();
  const agent = currentState.agents[req.params.id];
  if (!agent) {
    return res.status(404).json({ error: "Agent not found" });
  }
  res.json(agent);
});

// POST create agent (Admin)
agentsRouter.post("/", async (req, res) => {
  try {
    const agentData: AgentProfile = req.body;
    if (!agentData.agentId || !agentData.name || !agentData.type) {
      return res.status(400).json({ error: "Missing required agent fields: agentId, name, type" });
    }

    // Save to PostgreSQL
    const newDbAgent = await prisma.agentProfile.create({
      data: {
        agentId: agentData.agentId,
        name: agentData.name,
        type: agentData.type,
        roleDescription: agentData.roleDescription || "",
        avatar: agentData.avatar || "",
        pipelineGroup: agentData.pipelineGroup || "ML_TRAINED",
        status: agentData.status || "IDLE",
        sentiment: agentData.sentiment ?? 0,
        engagementScore: agentData.engagementScore ?? 50,
        lastAction: agentData.lastAction || null,
        lastActionTime: agentData.lastActionTime || null,
        segment: agentData.segment || null,
        trendSensitivity: agentData.trendSensitivity || null,
        priceSensitivity: agentData.priceSensitivity || null,
        brandAffinity: agentData.brandAffinity || null,
        engagementProbability: agentData.engagementProbability || null,
        specialization: agentData.specialization || null,
        modelType: agentData.modelType || null,
        quantumExpectation: agentData.quantumExpectation || null,
        searchMomentumScore: agentData.searchMomentumScore || null,
      }
    });

    const formattedAgent = formatDbAgent(newDbAgent);

    // Update in-memory arrays and simulation engine state
    dataStore.agents.push(formattedAgent);
    simulationScheduler.getEngine().getState().agents[formattedAgent.agentId] = formattedAgent;

    res.status(201).json(formattedAgent);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create agent", details: err.message });
  }
});

// PUT update agent (Admin)
agentsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const agentData = req.body;

    // Update in PostgreSQL
    const updatedDbAgent = await prisma.agentProfile.update({
      where: { agentId: id },
      data: {
        name: agentData.name,
        type: agentData.type,
        roleDescription: agentData.roleDescription,
        avatar: agentData.avatar,
        pipelineGroup: agentData.pipelineGroup,
        status: agentData.status,
        sentiment: agentData.sentiment,
        engagementScore: agentData.engagementScore,
        lastAction: agentData.lastAction,
        lastActionTime: agentData.lastActionTime,
        segment: agentData.segment,
        trendSensitivity: agentData.trendSensitivity,
        priceSensitivity: agentData.priceSensitivity,
        brandAffinity: agentData.brandAffinity,
        engagementProbability: agentData.engagementProbability,
        specialization: agentData.specialization,
        modelType: agentData.modelType,
        quantumExpectation: agentData.quantumExpectation,
        searchMomentumScore: agentData.searchMomentumScore,
      }
    });

    const formattedAgent = formatDbAgent(updatedDbAgent);

    // Update in-memory arrays and simulation engine state
    const dsIndex = dataStore.agents.findIndex(a => a.agentId === id);
    if (dsIndex !== -1) {
      dataStore.agents[dsIndex] = formattedAgent;
    }
    simulationScheduler.getEngine().getState().agents[id] = formattedAgent;

    res.json(formattedAgent);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update agent", details: err.message });
  }
});

// DELETE agent (Admin)
agentsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete from PostgreSQL
    await prisma.agentProfile.delete({
      where: { agentId: id }
    });

    // Delete from in-memory arrays and simulation engine state
    dataStore.agents = dataStore.agents.filter(a => a.agentId !== id);
    delete simulationScheduler.getEngine().getState().agents[id];

    res.json({ success: true, message: `Agent ${id} deleted successfully.` });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete agent", details: err.message });
  }
});
