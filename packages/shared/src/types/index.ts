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

export interface CanonicalCampaign {
  campaignId: string;
  campaignName: string;
  channel: "Instagram" | "TikTok" | "X" | "LinkedIn" | "YouTube" | "Multi-Channel";
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
  recency: number;
  relevance: number;
  score: number;
  status: "RISING" | "STABLE" | "DECLINING";
  category: string;
}

export type EventType =
  | "TREND_DETECTED"
  | "TREND_UPDATED"
  | "CAMPAIGN_CREATED"
  | "CAMPAIGN_VIEWED"
  | "LIKE"
  | "COMMENT"
  | "QUESTION"
  | "IGNORE"
  | "CONVERSION"
  | "SENTIMENT_CHANGED"
  | "ANOMALY_DETECTED"
  | "EXPERIMENT_STARTED"
  | "EXPERIMENT_COMPLETED"
  | "RECOMMENDATION_CREATED"
  | "ADMIN_ANALYSIS"
  | "AGENT_STATUS_CHANGED"
  | "SIMULATION_STARTED"
  | "SIMULATION_PAUSED"
  | "SIMULATION_STOPPED"
  | "EDGE_ACTIVATE"
  | "QML_ENTANGLEMENT"
  | "PYTREND_SPIKE"
  | "GROQ_CRITIQUE";

export interface AgentEvent {
  eventId: string;
  simulationId: string;
  timestamp: string;
  source: string;
  target?: string;
  type: EventType;
  payload: Record<string, any>;
}

export type AdminDecision =
  | "SCALE"
  | "MAINTAIN"
  | "INVESTIGATE"
  | "EXPERIMENT"
  | "REDUCE"
  | "STOP";

export type AdminPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AdminAnalysis {
  analysisId: string;
  timestamp: string;
  priority: AdminPriority;
  decision: AdminDecision;
  summary: string;
  evidence: string[];
  recommendedActions: string[];
  confidence: number;
  exploitationAllocation: number;
  explorationAllocation: number;
  activeAgentCount: number;
  averageSentiment: number;
  topTrendName: string;
  topTrendScore: number;
  simulatedRoas: number;
  simulatedCtr: number;
  simulatedConversions: number;
  anomaliesDetected: string[];
  
  // 30-30-30-10 Multi-Modal Consensus Metrics
  ensembleBreakdown?: {
    ml_roas: number;
    pytrends_velocity: number;
    groq_creative_score: number;
    qml_resonance_score: number;
    qml_predicted_roas: number;
    consensus_roas: number;
    entanglement_matrix: Array<{ pair: string; entanglement: number }>;
  };
}

export interface SimulationStateSummary {
  simulationId: string;
  status: "RUNNING" | "PAUSED" | "STOPPED" | "IDLE";
  tick: number;
  speed: number;
  activeAgentIds: string[];
  totalNodes: number;
  simulatedAgentsCount: number;
  adminAgentsCount: number;
  topTrends: RealTrend[];
  activeCampaign?: CanonicalCampaign;
  recentEvents: AgentEvent[];
  adminAnalysis?: AdminAnalysis;
  stats: {
    totalEvents: number;
    avgSentiment: number;
    totalLikes: number;
    totalComments: number;
    totalConversions: number;
    exploitationPct: number;
    explorationPct: number;
  };
}
