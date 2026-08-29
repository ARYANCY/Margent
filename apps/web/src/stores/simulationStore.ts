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
  stepSimulation: () => void;
  setSpeed: (speed: number) => void;
  setExplorationRatio: (explorationPct: number) => void;
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
    
    // Dynamic Environment URL with fallback to current origin host
    const apiUrl = (import.meta as any).env?.VITE_API_URL || (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:4000` : "http://localhost:4000");

    const socket = io(apiUrl, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      console.log(`[Socket.IO] Connected to backend on ${apiUrl}`);
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
        const newEvents = [event, ...state.events].slice(0, 150);
        const updatedEdges = event.target 
          ? [{ source: event.source, target: event.target, eventType: event.type }, ...state.activeEdges].slice(0, 20)
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
      set({
        adminAnalysis: analysis,
        isDashboardOpen: true
      });
    });

    socket.on("agents:initial", (agentsList: AgentProfile[]) => {
      const map: Record<string, AgentProfile> = {};
      agentsList.forEach((a) => {
        map[a.agentId] = a;
      });
      set({ agents: map });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  setSelectedAgentId: (id) => set({ selectedAgentId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterRole: (role) => set({ filterRole: role }),
  setIsDashboardOpen: (open) => set({ isDashboardOpen: open }),
  setIsCampaignModalOpen: (open) => set({ isCampaignModalOpen: open }),

  startSimulation: () => {
    const { socket } = get();
    if (socket) {
      socket.emit("simulation:start");
      set({ simulationStatus: "RUNNING" });
    }
  },

  pauseSimulation: () => {
    const { socket } = get();
    if (socket) {
      socket.emit("simulation:pause");
      set({ simulationStatus: "PAUSED" });
    }
  },

  stepSimulation: () => {
    const { socket } = get();
    if (socket) {
      socket.emit("simulation:step");
    }
  },

  setSpeed: (speed) => {
    const { socket } = get();
    if (socket) {
      socket.emit("simulation:speed", { speed });
      set({ speed });
    }
  },

  setExplorationRatio: (explorationPct) => {
    const expl = Math.max(5, Math.min(95, explorationPct));
    set((state) => ({
      stats: {
        ...state.stats,
        explorationPct: expl,
        exploitationPct: 100 - expl
      }
    }));
  }
}));
