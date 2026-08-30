"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulationRouter = void 0;
const express_1 = require("express");
const simulationScheduler_1 = require("../services/simulationScheduler");
exports.simulationRouter = (0, express_1.Router)();
exports.simulationRouter.get("/status", (req, res) => {
    res.json(simulationScheduler_1.simulationScheduler.getRunningStatus());
});
exports.simulationRouter.post("/start", (req, res) => {
    simulationScheduler_1.simulationScheduler.start();
    res.json({ message: "Simulation started", ...simulationScheduler_1.simulationScheduler.getRunningStatus() });
});
exports.simulationRouter.post("/pause", (req, res) => {
    simulationScheduler_1.simulationScheduler.pause();
    res.json({ message: "Simulation paused", ...simulationScheduler_1.simulationScheduler.getRunningStatus() });
});
exports.simulationRouter.post("/stop", (req, res) => {
    simulationScheduler_1.simulationScheduler.stop();
    res.json({ message: "Simulation stopped", ...simulationScheduler_1.simulationScheduler.getRunningStatus() });
});
exports.simulationRouter.post("/step", async (req, res) => {
    await simulationScheduler_1.simulationScheduler.step();
    res.json({ message: "Simulation advanced 1 tick", ...simulationScheduler_1.simulationScheduler.getRunningStatus() });
});
exports.simulationRouter.post("/speed", (req, res) => {
    const speed = parseFloat(req.body.speed) || 1.0;
    simulationScheduler_1.simulationScheduler.setSpeed(speed);
    res.json({ message: `Speed set to ${speed}x`, ...simulationScheduler_1.simulationScheduler.getRunningStatus() });
});
