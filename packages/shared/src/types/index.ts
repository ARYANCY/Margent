/**
 * Shared Type Definitions for 30-30-30-10 AI Marketing Intelligence Platform
 */

export type AgentRole =
  | "ml"
  | "pytrend"
  | "groq"
  | "qml"
  | "admin"
  | "customer"
  | "marketing"
  | "content"
  | "trend"
  | "analyst"
  | "strategy";

export type AgentStatus =
  | "IDLE"
  | "OBSERVING"
  | "ANALYZING"
  | "DECIDING"
  | "ACTING"
  | "COMMENTING"
  | "QUANTUM_RESOLVING"
  | "PYTREND_SCANNING"
  | "GROQ_REASONING"
  | "ML_INFERRING"
  | "WAITING"
  | "ERROR";

export type CustomerSegment =
  | "tech_enthusiast"
  | "budget_conscious"
  | "trend_chaser"
  | "luxury_buyer"
  | "eco_conscious";

export interface AgentProfile {
  agentId: string;
  name: string;
  type: AgentRole;
  roleDescription: string;
  avatar: string;
  pipelineGroup: "ML_TRAINED" | "PYTREND_SEARCH" | "GROQ_LLM" | "QML_QUANTUM" | "ADMIN_MASTER";
  
  // Dynamic runtime metrics
  status: AgentStatus;
  sentiment: number; // -1.0 to 1.0
  engagementScore: number; // 0 to 100
  lastAction?: string;
  lastActionTime?: string;
  
  // Traits & Model specific outputs
  segment?: CustomerSegment;
  trendSensitivity?: number;
  priceSensitivity?: number;
  brandAffinity?: number;
  engagementProbability?: number;
  
  specialization?: string;
  modelType?: string;
  quantumExpectation?: number;
  searchMomentumScore?: number;
}

export const VALID_CHANNELS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "Google Ads",
  "YouTube",
  "LinkedIn",
  "Pinterest",
  "X",
  "Multi-Channel"
] as const;

export type MarketingChannel = (typeof VALID_CHANNELS)[number];

export interface CanonicalCampaign {
  campaignId: string;
  campaignName: string;
  channel: MarketingChannel;
  goal?: string;
  audience: string;
  caption?: string;
  hashtags?: string[];
  imageUrl?: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  engagements: number;
  
  ctr: number;
  cpc: number;
  conversionRate: number;
  roas: number;
  engagementRate: number;
  trendAlignment: number;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "SIMULATED";
}

export interface RealTrend {
  trendId: string;
  name: string;
  hashtag: string;
  source: string;
  timestamp: string;
  growth: number;
  interest: number;
  velocity: number;
  status: "RISING" | "FALLING" | "PEAK" | "STEADY";
}

export interface AgentEvent {
  eventId: string;
  source: string;
  target?: string;
  type: "COMMENT" | "ANOMALY_DETECTED" | "TREND_UPDATED" | "ALLOCATION_CHANGED" | "ADMIN_ANALYSIS" | "QML_ENTANGLEMENT" | "PYTREND_SPIKE" | "GROQ_CRITIQUE";
  timestamp: number;
  payload: Record<string, any>;
}

export interface EnsembleBreakdown {
  ml_roas: number;
  pytrends_velocity: number;
  groq_creative_score: number;
  qml_predicted_roas: number;
  qml_resonance_score?: number;
  consensus_roas: number;
  entanglement_matrix?: Array<{ pair: string; entanglement: number }>;
}

export interface NodeEvaluation {
  nodeId: string;
  name: string;
  type: "ml" | "pytrend" | "groq" | "qml" | "admin";
  pipelineName: string;
  modelArchitecture: string;
  inputsEvaluated: string;
  outputMetric: string;
  marketingTakeaway: string;
  strategicAction: string;
  confidenceGrade: string;
  concreteResult: string;
  status: AgentStatus;
  sentiment?: number;
  confidence?: number;
  rawTelemetryJson?: Record<string, any>;
}

export interface AdminAnalysis {
  decision: "SCALE" | "MAINTAIN" | "INVESTIGATE" | "STOP" | "EXPERIMENT" | "REDUCE";
  confidence: number;
  simulatedRoas: number;
  summary: string;
  evidence: string[];
  recommendedActions?: string[];
  ensembleBreakdown: EnsembleBreakdown;
  nodeEvaluations?: NodeEvaluation[];
  activeAgentsCount: number;
  timestamp: string;
}

export interface SimulationStateSummary {
  tick: number;
  status: "RUNNING" | "PAUSED" | "STOPPED" | "IDLE";
  speed: number;
  activeAgentIds: string[];
  topTrends?: RealTrend[];
  activeCampaign?: CanonicalCampaign | null;
  adminAnalysis?: AdminAnalysis | null;
  stats?: {
    totalEvents: number;
    avgSentiment: number;
    totalLikes: number;
    totalComments: number;
    totalConversions: number;
    exploitationPct: number;
    explorationPct: number;
  };
  recentEvents?: AgentEvent[];
}
