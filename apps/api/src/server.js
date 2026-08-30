"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../../.env") });
const agents_1 = require("./routes/agents");
const trends_1 = require("./routes/trends");
const campaigns_1 = require("./routes/campaigns");
const analytics_1 = require("./routes/analytics");
const simulation_1 = require("./routes/simulation");
const simulationScheduler_1 = require("./services/simulationScheduler");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
simulationScheduler_1.simulationScheduler.setIO(io);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static uploads
const uploadDir = path_1.default.join(process.cwd(), "uploads");
app.use("/uploads", express_1.default.static(uploadDir));
// API Routes
app.use("/api/agents", agents_1.agentsRouter);
app.use("/api/trends", trends_1.trendsRouter);
app.use("/api/campaigns", campaigns_1.campaignsRouter);
app.use("/api/analytics", analytics_1.analyticsRouter);
app.use("/api/simulation", simulation_1.simulationRouter);
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "AI Marketing Intelligence API",
        totalNodes: 101,
        simulatedAgents: 100,
        adminAgents: 1,
        simulationStatus: simulationScheduler_1.simulationScheduler.getRunningStatus()
    });
});
// Socket.IO connection handler
io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);
    const state = simulationScheduler_1.simulationScheduler.getEngine().getState();
    // Emit initial agents list to populate web client nodes
    socket.emit("agents:initial", Object.values(state.agents));
    // Send current state immediately on connect
    socket.emit("simulation:state", {
        simulationId: state.simulationId,
        status: simulationScheduler_1.simulationScheduler.getRunningStatus().isRunning ? "RUNNING" : "PAUSED",
        tick: state.tick,
        speed: 1.0,
        activeAgentIds: state.activeAgentIds,
        totalNodes: Object.keys(state.agents).length,
        simulatedAgentsCount: Object.values(state.agents).filter(a => a.type !== "admin").length,
        adminAgentsCount: Object.values(state.agents).filter(a => a.type === "admin").length,
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
    // Simulation control listeners from WebSocket clients
    socket.on("simulation:start", () => {
        console.log(`[Socket.IO] simulation:start received from ${socket.id}`);
        simulationScheduler_1.simulationScheduler.start();
    });
    socket.on("simulation:pause", () => {
        console.log(`[Socket.IO] simulation:pause received from ${socket.id}`);
        simulationScheduler_1.simulationScheduler.pause();
    });
    socket.on("simulation:stop", () => {
        console.log(`[Socket.IO] simulation:stop received from ${socket.id}`);
        simulationScheduler_1.simulationScheduler.stop();
    });
    socket.on("simulation:step", async () => {
        console.log(`[Socket.IO] simulation:step received from ${socket.id}`);
        await simulationScheduler_1.simulationScheduler.step();
    });
    socket.on("simulation:speed", ({ speed }) => {
        console.log(`[Socket.IO] simulation:speed received: ${speed}x from ${socket.id}`);
        simulationScheduler_1.simulationScheduler.setSpeed(Number(speed));
    });
    socket.on("campaign:post", async (campaign) => {
        console.log(`[Socket.IO] campaign:post received from ${socket.id}`);
        await simulationScheduler_1.simulationScheduler.triggerCampaignPost(campaign);
    });
    socket.on("disconnect", () => {
        console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` AI Marketing Intelligence API running on port ${PORT}`);
    console.log(` 100 Simulated Agents + 1 Admin Node Initialized (101)`);
    console.log(` WebSocket ready on ws://localhost:${PORT}`);
    console.log(`=======================================================`);
});
