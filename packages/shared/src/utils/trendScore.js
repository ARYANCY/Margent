"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTrendScore = calculateTrendScore;
const constants_1 = require("../constants");
/**
 * Calculates normalized trend score (0 to 100)
 * Trend Score = 0.30*Growth + 0.20*Interest + 0.15*Velocity + 0.15*Recency + 0.20*Relevance
 */
function calculateTrendScore(growth, interest, velocity, recency, relevance, weights = constants_1.DEFAULT_TREND_WEIGHTS) {
    const g = Math.max(0, Math.min(100, growth));
    const i = Math.max(0, Math.min(100, interest));
    const v = Math.max(0, Math.min(100, velocity));
    const rec = Math.max(0, Math.min(100, recency));
    const rel = Math.max(0, Math.min(100, relevance));
    const total = weights.growth * g +
        weights.interest * i +
        weights.velocity * v +
        weights.recency * rec +
        weights.relevance * rel;
    return Math.round(total * 10) / 10;
}
