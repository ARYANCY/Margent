import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { AgentProfile, RealTrend, CanonicalCampaign, AgentEvent, AdminAnalysis, SimulationStateSummary } from "@shared/types";

interface SimulationStore {
  socket: Socket | null;
  isConnected: boolean;
  agents: Record<string, AgentProfile>;
  trends: RealTrend[];
  campaigns: CanonicalCampaign[];
  activeCampaign: CanonicalCampaign | null;
  events: AgentEvent[];
  activeEdges: { source: string; target: string; eventType: string }[];
  activeAgentIds: string[];
  adminAnalysis: AdminAnalysis | null;
  selectedAgentId: string | null;
  searchQuery: string;
  filterRole: string;
  isDashboardOpen: boolean;
  isCampaignModalOpen: boolean;
  simulationStatus: "RUNNING" | "PAUSED" | "STOPPED" | "IDLE";
  tick: number;
  speed: number;
  stats: {
    totalEvents: number;
    avgSentiment: number;
    totalLikes: number;
    totalComments: number;
    totalConversions: number;
    exploitationPct: number;
    explorationPct: number;
  };
  
  // Actions
  initSocket: () => void;
  disconnectSocket: () => void;
  setSelectedAgentId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterRole: (role: string) => void;
  setIsDashboardOpen: (open: boolean) => void;
  setIsCampaignModalOpen: (open: boolean) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
  setSpeed: (speed: number) => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  socket: null,
  isConnected: false,
  agents: {},
  trends: [],
  campaigns: [],
  activeCampaign: null,
  events: [],
  activeEdges: [],
  activeAgentIds: [],
  adminAnalysis: null,
  selectedAgentId: null,
  searchQuery: "",
  filterRole: "ALL",
  isDashboardOpen: false,
  isCampaignModalOpen: false,
  simulationStatus: "IDLE",
  tick: 0,
  speed: 1.0,
  stats: {
    totalEvents: 0,
    avgSentiment: 0.15,
    totalLikes: 0,
    totalComments: 0,
    totalConversions: 0,
    exploitationPct: 80,
    explorationPct: 20
  },

  initSocket: () => {
    if (get().socket) return;
    const socket = io("http://localhost:4000", {
      reconnectionAttempts: 5,
      timeout: 10000
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      console.log("[Socket.IO] Connected to backend on port 4000");
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    socket.on("simulation:state", (data: SimulationStateSummary) => {
      set((state) => ({
        tick: data.tick,
        simulationStatus: data.status,
        speed: data.speed,
        activeAgentIds: data.activeAgentIds || [],
        trends: data.topTrends || state.trends,
        activeCampaign: data.activeCampaign || state.activeCampaign,
        adminAnalysis: data.adminAnalysis || state.adminAnalysis,
        stats: data.stats || state.stats,
        events: data.recentEvents ? [...data.recentEvents] : state.events
      }));
    });

    socket.on("agent:event", (event: AgentEvent) => {
      set((state) => {
        const newEvents = [event, ...state.events].slice(0, 100);
        const updatedEdges = event.target 
          ? [{ source: event.source, target: event.target, eventType: event.type }, ...state.activeEdges].slice(0, 15)
          : state.activeEdges;
        
        const isNewAdmin = event.type === "ADMIN_ANALYSIS";

        return {
          events: newEvents,
          activeEdges: updatedEdges,
          isDashboardOpen: isNewAdmin ? true : state.isDashboardOpen
        };
      });
    });

    socket.on("admin:analysis", (analysis: AdminAnalysis) => {
      set({ adminAnalysis: analysis, isDashboardOpen: true });
    });

    set({ socket });

    // Fetch initial agents
    fetch("http://localhost:4000/api/agents")
      .then(res => res.json())
      .then(data => {
        const agentMap: Record<string, AgentProfile> = {};
        for (const a of data.agents) {
          agentMap[a.agentId] = a;
        }
        set({ agents: agentMap });
      })
      .catch(err => console.warn("Could not load initial agents:", err));
  },

  disconnectSocket: () => {
    const s = get().socket;
    if (s) {
      s.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  setSelectedAgentId: (id) => set({ selectedAgentId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterRole: (role) => set({ filterRole: role }),
  setIsDashboardOpen: (open) => set({ isDashboardOpen: open }),
  setIsCampaignModalOpen: (open) => set({ isCampaignModalOpen: open }),

  startSimulation: () => {
    fetch("http://localhost:4000/api/simulation/start", { method: "POST" })
      .then(r => r.json())
      .then(() => set({ simulationStatus: "RUNNING" }))
      .catch(e => console.error(e));
  },

  pauseSimulation: () => {
    fetch("http://localhost:4000/api/simulation/pause", { method: "POST" })
      .then(r => r.json())
      .then(() => set({ simulationStatus: "PAUSED" }))
      .catch(e => console.error(e));
  },

  stopSimulation: () => {
    fetch("http://localhost:4000/api/simulation/stop", { method: "POST" })
      .then(r => r.json())
      .then(() => set({ simulationStatus: "STOPPED" }))
      .catch(e => console.error(e));
  },

  stepSimulation: () => {
    fetch("http://localhost:4000/api/simulation/step", { method: "POST" })
      .catch(e => console.error(e));
  },

  setSpeed: (speed) => {
    fetch("http://localhost:4000/api/simulation/speed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speed })
    })
      .then(r => r.json())
      .then(() => set({ speed }))
      .catch(e => console.error(e));
  }
}));
