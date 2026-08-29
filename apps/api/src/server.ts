import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: path.join(__dirname, "../../../.env") });

import { agentsRouter } from "./routes/agents";
import { trendsRouter } from "./routes/trends";
import { campaignsRouter } from "./routes/campaigns";
import { analyticsRouter } from "./routes/analytics";
import { simulationRouter } from "./routes/simulation";
import { simulationScheduler } from "./services/simulationScheduler";

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

simulationScheduler.setIO(io);

app.use(cors());
app.use(express.json());

// Serve static uploads
const uploadDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadDir));

// API Routes
app.use("/api/agents", agentsRouter);
app.use("/api/trends", trendsRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/simulation", simulationRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Marketing Intelligence API",
    totalNodes: 101,
    simulatedAgents: 100,
    adminAgents: 1,
    simulationStatus: simulationScheduler.getRunningStatus()
  });
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  
  const state = simulationScheduler.getEngine().getState();
  
  // Emit initial agents list to populate web client nodes
  socket.emit("agents:initial", Object.values(state.agents));
  
  // Send current state immediately on connect
  socket.emit("simulation:state", {
    simulationId: state.simulationId,
    status: simulationScheduler.getRunningStatus().isRunning ? "RUNNING" : "PAUSED",
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
