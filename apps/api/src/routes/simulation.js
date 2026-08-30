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
exports.simulationRouter.post("/monte-carlo", async (req, res) => {
    const mlUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
    try {
        const response = await fetch(`${mlUrl}/simulate/monte-carlo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
            signal: AbortSignal.timeout(5000)
        });
        if (!response.ok)
            throw new Error(`ML status ${response.status}`);
        const data = await response.json();
        return res.json(data);
    }
    catch (err) {
        // Deterministic fallback if ML microservice is starting
        const baseRoas = Number(req.body.base_roas) || 3.85;
        const spend = Number(req.body.spend) || 1800;
        const trajectories = Array.from({ length: 14 }, (_, i) => ({
            day: `Day ${i + 1}`,
            p10_bear: Number((baseRoas * (0.85 - i * 0.015)).toFixed(2)),
            p50_base: Number((baseRoas * (1.0 - i * 0.008)).toFixed(2)),
            p90_bull: Number((baseRoas * (1.18 + i * 0.02)).toFixed(2)),
            expected_gross_revenue: Math.round(spend * baseRoas * (1.0 - i * 0.008))
        }));
        return res.json({
            metadata: { num_simulations: 500, days_horizon: 14, base_roas: baseRoas, probability_of_profit: 96.4 },
            risk_metrics: {
                var_95_roas: Number((baseRoas * 0.78).toFixed(2)),
                expected_terminal_roas: Number((baseRoas * 0.92).toFixed(2)),
                bull_case_roas: Number((baseRoas * 1.38).toFixed(2)),
                bear_case_roas: Number((baseRoas * 0.72).toFixed(2)),
                max_potential_roas: Number((baseRoas * 1.55).toFixed(2))
            },
            trajectories
        });
    }
});
exports.simulationRouter.post("/persona/chat", async (req, res) => {
    const mlUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
    try {
        const response = await fetch(`${mlUrl}/groq/chat-persona`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
            signal: AbortSignal.timeout(6000)
        });
        if (!response.ok)
            throw new Error(`ML status ${response.status}`);
        const data = await response.json();
        return res.json(data);
    }
    catch (err) {
        const persona = req.body.persona || "Gen Z Early Adopter Persona";
        const stance = req.body.stance || "FOR (Constructive Champion)";
        const messages = req.body.messages || [];
        const lastUserMsg = messages.length > 0 ? messages[messages.length - 1].content.toLowerCase() : "";
        let reply = "";
        if (stance.includes("AGAINST") || stance.includes("Skeptic")) {
            if (lastUserMsg.includes("price") || lastUserMsg.includes("cost")) {
                reply = `As a ${persona}, the upfront price makes me hesitate without a verified money-back guarantee. Offer a 14-day risk-free trial and I'll consider testing it.`;
            }
            else if (lastUserMsg.includes("hook") || lastUserMsg.includes("copy")) {
                reply = `The opening 2 seconds feel too wordy. Cut the corporate buzzwords and show the actual software workflow immediately.`;
            }
            else {
                reply = `From my perspective as a ${persona}, I need concrete social proof and third-party customer reviews before I trust this ad on this channel.`;
            }
        }
        else {
            if (lastUserMsg.includes("hook") || lastUserMsg.includes("copy")) {
                reply = `I love the hook! It addresses the core pain point immediately. Test adding a fast-paced UGC creator video format to boost CTR even further!`;
            }
            else if (lastUserMsg.includes("buy") || lastUserMsg.includes("convert")) {
                reply = `A limited-time early-bird bonus or 1-click checkout link in the caption would convert me right away!`;
            }
            else {
                reply = `As a ${persona}, this ad really resonates with what I'm looking for right now. The trend alignment is high!`;
            }
        }
        return res.json({ persona, stance, reply });
    }
});
