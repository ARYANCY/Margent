"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulationScheduler = exports.SimulationScheduler = void 0;
const store_1 = require("./store");
const index_1 = require("../../../../packages/graph/src/index");
class SimulationScheduler {
    io;
    engine;
    isRunning = false;
    tickIntervalMs = 2500;
    speedMultiplier = 1.0;
    timer = null;
    isTickLocked = false;
    constructor() {
        const initialState = (0, index_1.createInitialSimulationState)(store_1.dataStore.agents, store_1.dataStore.trends, store_1.dataStore.campaigns);
        this.engine = new index_1.SimulationGraphEngine(initialState);
        this.engine.setCallbacks((event) => this.handleEvent(event), (state) => this.handleStateUpdate(state));
    }
    setIO(io) {
        this.io = io;
    }
    handleEvent(event) {
        store_1.dataStore.addEvent(event);
        this.io?.emit("agent:event", event);
        if (event.type === "ADMIN_ANALYSIS") {
            this.io?.emit("admin:analysis", event.payload);
        }
    }
    handleStateUpdate(state) {
        this.io?.emit("simulation:state", {
            simulationId: state.simulationId,
            status: this.isRunning ? "RUNNING" : "PAUSED",
            tick: state.tick,
            speed: this.speedMultiplier,
            activeAgentIds: state.activeAgentIds,
            totalNodes: Object.keys(state.agents).length,
            simulatedAgentsCount: Object.values(state.agents).filter((a) => a.type !== "admin").length,
            adminAgentsCount: Object.values(state.agents).filter((a) => a.type === "admin").length,
            topTrends: state.trends,
            activeCampaign: state.activeCampaign,
            recentEvents: state.events.slice(0, 15),
            adminAnalysis: state.adminAnalysis,
            stats: {
                totalEvents: state.stats.totalEvents,
                avgSentiment: state.stats.avgSentiment,
                totalLikes: state.stats.totalLikes,
                totalComments: state.stats.totalComments,
                totalConversions: state.stats.totalConversions,
                exploitationPct: 80,
                explorationPct: 20
            }
        });
    }
    getEngine() {
        return this.engine;
    }
    getRunningStatus() {
        return {
            isRunning: this.isRunning,
            speed: this.speedMultiplier,
            tick: this.engine.getState().tick
        };
    }
    start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        this.scheduleNextTick();
        this.io?.emit("simulation:status", { status: "RUNNING" });
    }
    pause() {
        this.isRunning = false;
        if (this.timer)
            clearTimeout(this.timer);
        this.io?.emit("simulation:status", { status: "PAUSED" });
    }
    stop() {
        this.isRunning = false;
        if (this.timer)
            clearTimeout(this.timer);
        this.io?.emit("simulation:status", { status: "STOPPED" });
    }
    setSpeed(speed) {
        this.speedMultiplier = Math.max(0.2, Math.min(10, speed));
        if (this.isRunning) {
            if (this.timer)
                clearTimeout(this.timer);
            this.scheduleNextTick();
        }
    }
    tickQueue = Promise.resolve();
    async triggerCampaignPost(campaign) {
        this.engine.setActiveCampaign(campaign);
        store_1.dataStore.addCampaign(campaign);
        this.io?.emit("campaign:created", campaign);
        await this.step();
    }
    async step() {
        this.tickQueue = this.tickQueue.then(async () => {
            try {
                await this.engine.executeTick();
            }
            catch (err) {
                console.error("Tick execution error:", err);
            }
        });
        return this.tickQueue;
    }
    scheduleNextTick() {
        if (!this.isRunning)
            return;
        const interval = Math.max(400, Math.floor(this.tickIntervalMs / this.speedMultiplier));
        this.timer = setTimeout(async () => {
            if (this.isRunning) {
                await this.step();
                this.scheduleNextTick();
            }
        }, interval);
    }
}
exports.SimulationScheduler = SimulationScheduler;
exports.simulationScheduler = new SimulationScheduler();
