"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentsRouter = void 0;
const express_1 = require("express");
const simulationScheduler_1 = require("../services/simulationScheduler");
exports.agentsRouter = (0, express_1.Router)();
exports.agentsRouter.get("/", (req, res) => {
    const currentState = simulationScheduler_1.simulationScheduler.getEngine().getState();
    const agentsList = Object.values(currentState.agents);
    res.json({
        total: agentsList.length,
        simulatedCount: agentsList.filter(a => a.type !== "admin").length,
        adminCount: agentsList.filter(a => a.type === "admin").length,
        agents: agentsList
    });
});
exports.agentsRouter.get("/:id", (req, res) => {
    const currentState = simulationScheduler_1.simulationScheduler.getEngine().getState();
    const agent = currentState.agents[req.params.id];
    if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
    }
    res.json(agent);
});
