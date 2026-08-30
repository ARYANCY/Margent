import { Server as SocketIOServer } from "socket.io";
import { dataStore } from "./store";
import { createInitialSimulationState, SimulationGraphEngine } from "../../../../packages/graph/src/index";
import { CanonicalCampaign, AgentEvent } from "../../../../packages/shared/src/types/index";

export class SimulationScheduler {
  private io?: SocketIOServer;
  private engine: SimulationGraphEngine;
  private isRunning: boolean = false;
  private tickIntervalMs: number = 2500;
  private speedMultiplier: number = 1.0;
  private timer: NodeJS.Timeout | null = null;
  private isTickLocked: boolean = false;

  constructor() {
    const initialState = createInitialSimulationState(
      dataStore.agents,
      dataStore.trends,
      dataStore.campaigns
    );
    this.engine = new SimulationGraphEngine(initialState);
    this.engine.setCallbacks(
      (event: AgentEvent) => this.handleEvent(event),
      (state) => this.handleStateUpdate(state)
    );
  }

  setIO(io: SocketIOServer) {
    this.io = io;
  }

  private handleEvent(event: AgentEvent) {
    dataStore.addEvent(event);
    this.io?.emit("agent:event", event);
    if (event.type === "ADMIN_ANALYSIS") {
      this.io?.emit("admin:analysis", event.payload);
    }
  }

  private handleStateUpdate(state: any) {
    this.io?.emit("simulation:state", {
      simulationId: state.simulationId,
      status: this.isRunning ? "RUNNING" : "PAUSED",
      tick: state.tick,
      speed: this.speedMultiplier,
      activeAgentIds: state.activeAgentIds,
      totalNodes: Object.keys(state.agents).length,
      simulatedAgentsCount: Object.values(state.agents).filter((a: any) => a.type !== "admin").length,
      adminAgentsCount: Object.values(state.agents).filter((a: any) => a.type === "admin").length,
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

  getEngine(): SimulationGraphEngine {
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
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleNextTick();
    this.io?.emit("simulation:status", { status: "RUNNING" });
  }

  pause() {
    this.isRunning = false;
    if (this.timer) clearTimeout(this.timer);
    this.io?.emit("simulation:status", { status: "PAUSED" });
  }

  stop() {
    this.isRunning = false;
    if (this.timer) clearTimeout(this.timer);
    this.io?.emit("simulation:status", { status: "STOPPED" });
  }

  setSpeed(speed: number) {
    this.speedMultiplier = Math.max(0.2, Math.min(10, speed));
    if (this.isRunning) {
      if (this.timer) clearTimeout(this.timer);
      this.scheduleNextTick();
    }
  }

  private tickQueue: Promise<void> = Promise.resolve();

  async triggerCampaignPost(campaign: CanonicalCampaign) {
    this.engine.setActiveCampaign(campaign);
    dataStore.addCampaign(campaign);
    this.io?.emit("campaign:created", campaign);
    await this.step();
  }

  async step(): Promise<void> {
    this.tickQueue = this.tickQueue.then(async () => {
      try {
        await this.engine.executeTick();
      } catch (err) {
        console.error("Tick execution error:", err);
      }
    });
    return this.tickQueue;
  }

  private scheduleNextTick() {
    if (!this.isRunning) return;
    const interval = Math.max(400, Math.floor(this.tickIntervalMs / this.speedMultiplier));
    this.timer = setTimeout(async () => {
      if (this.isRunning) {
        await this.step();
        this.scheduleNextTick();
      }
    }, interval);
  }
}

export const simulationScheduler = new SimulationScheduler();
