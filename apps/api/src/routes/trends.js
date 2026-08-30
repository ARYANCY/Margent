"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trendsRouter = void 0;
const express_1 = require("express");
const simulationScheduler_1 = require("../services/simulationScheduler");
exports.trendsRouter = (0, express_1.Router)();
exports.trendsRouter.get("/", (req, res) => {
    const trends = simulationScheduler_1.simulationScheduler.getEngine().getState().trends;
    res.json(trends);
});
exports.trendsRouter.get("/:id", (req, res) => {
    const trends = simulationScheduler_1.simulationScheduler.getEngine().getState().trends;
    const trend = trends.find(t => t.trendId === req.params.id);
    if (!trend) {
        return res.status(404).json({ error: "Trend not found" });
    }
    res.json(trend);
});
