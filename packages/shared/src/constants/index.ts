/**
 * Constants & 30-30-30-10 Distribution Invariants
 */

export const AGENT_DISTRIBUTION = {
  ml: 30,         // 30 Trained Classical ML Agents (RandomForest, KMeans, IsolationForest)
  pytrend: 30,    // 30 PyTrends Google Search Momentum Agents
  groq: 30,       // 30 Groq / LLM Reasoning Agents
  qml: 10,        // 10 PennyLane Quantum Machine Learning Agents
  admin: 1        // 1 Master Ensemble Intelligence Synthesizer Node
} as const;

export const TOTAL_SIMULATION_AGENTS = 100;
export const TOTAL_ADMIN_AGENTS = 1;
export const TOTAL_GRAPH_NODES = 101;

export const DEFAULT_TREND_WEIGHTS = {
  growth: 0.30,
  interest: 0.20,
  velocity: 0.15,
  recency: 0.15,
  relevance: 0.20
};

export const ROLE_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  admin: { bg: "#8B5CF6", border: "#A78BFA", text: "#FFFFFF", glow: "rgba(139, 92, 246, 0.6)" },
  ml: { bg: "#06B6D4", border: "#22D3EE", text: "#FFFFFF", glow: "rgba(6, 182, 212, 0.5)" },
  pytrend: { bg: "#F59E0B", border: "#FBBF24", text: "#FFFFFF", glow: "rgba(245, 158, 11, 0.5)" },
  groq: { bg: "#10B981", border: "#34D399", text: "#FFFFFF", glow: "rgba(16, 185, 129, 0.5)" },
  qml: { bg: "#EC4899", border: "#F472B6", text: "#FFFFFF", glow: "rgba(236, 72, 153, 0.6)" },
  customer: { bg: "#3B82F6", border: "#60A5FA", text: "#FFFFFF", glow: "rgba(59, 130, 246, 0.4)" },
};
