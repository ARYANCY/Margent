"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataStore = exports.DataStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const registry_1 = require("@agents/registry");
const canonicalMetrics_1 = require("@shared/utils/canonicalMetrics");
/**
 * Robust CSV line parser supporting quoted strings and embedded commas.
 */
function parseCsvLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            }
            else {
                insideQuotes = !insideQuotes;
            }
        }
        else if (char === ',' && !insideQuotes) {
            result.push(current.trim());
            current = "";
        }
        else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}
class DataStore {
    agents = [];
    trends = [];
    campaigns = [];
    events = [];
    adminAnalyses = [];
    constructor() {
        this.initializeData();
    }
    initializeData() {
        this.agents = (0, registry_1.generateAgentRegistry)();
        const trendsPath = path_1.default.join(process.cwd(), "datasets", "trends.json");
        if (fs_1.default.existsSync(trendsPath)) {
            try {
                this.trends = JSON.parse(fs_1.default.readFileSync(trendsPath, "utf-8"));
            }
            catch (err) {
                console.warn("[DataStore] Could not read trends.json:", err);
            }
        }
        const campaignsCsvPath = path_1.default.join(process.cwd(), "datasets", "campaigns.csv");
        if (fs_1.default.existsSync(campaignsCsvPath)) {
            try {
                const rawLines = fs_1.default.readFileSync(campaignsCsvPath, "utf-8").trim().split(/\r?\n/);
                for (let i = 1; i < rawLines.length; i++) {
                    if (!rawLines[i].trim())
                        continue;
                    const cols = parseCsvLine(rawLines[i]);
                    if (cols.length >= 9) {
                        const spend = parseFloat(cols[3]) || 1000;
                        const impressions = parseInt(cols[4], 10) || 50000;
                        const clicks = parseInt(cols[5], 10) || 2500;
                        const conversions = parseInt(cols[6], 10) || 250;
                        const revenue = parseFloat(cols[7]) || 5000;
                        const trendAlignment = parseFloat(cols[8]) || 85;
                        const derived = (0, canonicalMetrics_1.deriveCampaignMetrics)({ spend, impressions, clicks, conversions, revenue, engagements: clicks * 2 });
                        this.campaigns.push({
                            campaignId: cols[0],
                            campaignName: cols[0],
                            channel: (cols[1] || "Instagram"),
                            audience: cols[2] || "General Audience",
                            date: new Date().toISOString().split("T")[0],
                            spend,
                            impressions,
                            clicks,
                            conversions,
                            revenue,
                            engagements: clicks * 2,
                            ...derived,
                            trendAlignment,
                            status: "ACTIVE"
                        });
                    }
                }
            }
            catch (err) {
                console.warn("[DataStore] Could not parse campaigns.csv:", err);
            }
        }
    }
    getAgents() {
        return this.agents;
    }
    getTrends() {
        return this.trends;
    }
    getCampaigns() {
        return this.campaigns;
    }
    addCampaign(campaign) {
        this.campaigns.unshift(campaign);
    }
    addEvent(event) {
        this.events.unshift(event);
        if (this.events.length > 500) {
            this.events.pop();
        }
    }
    addAdminAnalysis(analysis) {
        this.adminAnalyses.unshift(analysis);
    }
}
exports.DataStore = DataStore;
exports.dataStore = new DataStore();
