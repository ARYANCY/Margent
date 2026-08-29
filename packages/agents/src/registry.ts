import { AgentProfile } from "../../shared/src/types/index";
import { AGENT_DISTRIBUTION } from "../../shared/src/constants/index";

/**
 * 30-30-30-10 Multi-Modal Agent Registry Generator based on guide.md Architecture
 * - 30 ML Models: ChannelAnalyzer (1-10), ModelEnsemble (11-20), RootCause & Anomaly (21-30)
 * - 30 PyTrends Agents: TrendAgent Google Search Velocity Monitors (1-30)
 * - 30 Groq Agents: RecommenderAgent Cognitive & Persona Reviewers (1-30)
 * - 10 QML Quantum Agents: PennyLane 4-Qubit Variational Quantum Circuits (1-10)
 * - 1 Admin Master: AdminOrchestrator Executive Synthesizer
 */
export function generateAgentRegistry(): AgentProfile[] {
  const agents: AgentProfile[] = [];

  // 1. 30 Classical ML Agents (Trained GradientBoosting, RandomForest & KMeans from guide.md Sec 7.2)
  for (let i = 1; i <= AGENT_DISTRIBUTION.ml; i++) {
    const id = `ml_${String(i).padStart(3, "0")}`;
    let roleTitle = "ChannelAnalyzer";
    let modelType = "GradientBoosting ROAS Predictor";
    let description = "Analyzes post/ad metrics per channel and ranks top/bottom performers with metric deltas.";

    if (i > 10 && i <= 20) {
      roleTitle = "ModelEnsembleAgent";
      modelType = "KMeans 5-Cluster Segmentor";
      description = "Ingests feature tables (spend, CTR, CPC, conversions) to compute segment alignment scores.";
    } else if (i > 20) {
      roleTitle = "RootCauseAgent";
      modelType = "IsolationForest Anomaly Detector";
      description = "Flags underperforming campaigns, CPA inflation, and generates plain-English hypotheses.";
    }

    agents.push({
      agentId: id,
      name: `${roleTitle} #${i}`,
      type: "ml",
      pipelineGroup: "ML_TRAINED",
      roleDescription: description,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}&backgroundColor=06b6d4`,
      status: "IDLE",
      sentiment: 0.15,
      engagementScore: 80 + (i % 15),
      specialization: `${roleTitle} (${modelType})`,
      modelType,
      trendSensitivity: 0.75,
      priceSensitivity: 0.45
    });
  }

  // 2. 30 PyTrends Search Momentum Agents (guide.md Sec 8 - Pytrends Hybrid Signal)
  for (let i = 1; i <= AGENT_DISTRIBUTION.pytrend; i++) {
    const id = `pytrend_${String(i).padStart(3, "0")}`;
    const focus = i <= 10 ? "Breakout Keyword Scanner" : (i <= 20 ? "90-Day Interest Velocity" : "Search Lift & Viral Momentum");
    agents.push({
      agentId: id,
      name: `TrendAgent #${i}`,
      type: "pytrend",
      pipelineGroup: "PYTREND_SEARCH",
      roleDescription: `Queries Google Trends data for campaign keywords to calculate rising/falling topic interest signals (${focus}).`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${id}&backgroundColor=f59e0b`,
      status: "IDLE",
      sentiment: 0.25,
      engagementScore: 88,
      specialization: `TrendAgent (${focus})`,
      searchMomentumScore: 92
    });
  }

  // 3. 30 Groq / LLM Qualitative Reasoning Agents (guide.md Sec 3 - RecommenderAgent)
  for (let i = 1; i <= AGENT_DISTRIBUTION.groq; i++) {
    const id = `groq_${String(i).padStart(3, "0")}`;
    const persona =
      i <= 10
        ? "Gen Z Early Adopter Persona"
        : i <= 20
        ? "Direct-Response Creative Strategist"
        : "Brand Affinity & Sentiment Evaluator";

    agents.push({
      agentId: id,
      name: `RecommenderAgent #${i}`,
      type: "groq",
      pipelineGroup: "GROQ_LLM",
      roleDescription: `Evaluates ad copy hooks, demographic resonance, and produces concrete next-step recommendations (${persona}).`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}&backgroundColor=10b981`,
      status: "IDLE",
      sentiment: 0.35,
      engagementScore: 90,
      specialization: `RecommenderAgent (${persona})`,
      modelType: "groq/llama-3.3-70b-versatile"
    });
  }

  // 4. 10 Quantum Machine Learning (QML) Agents (guide.md Sec 7.3 - PennyLane VQC)
  for (let i = 1; i <= AGENT_DISTRIBUTION.qml; i++) {
    const id = `qml_${String(i).padStart(3, "0")}`;
    agents.push({
      agentId: id,
      name: `QuantumVQC #${i}`,
      type: "qml",
      pipelineGroup: "QML_QUANTUM",
      roleDescription: "PennyLane 4-Qubit Variational Quantum Circuit computing non-linear Hilbert space cross-feature entanglements.",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}&backgroundColor=ec4899`,
      status: "IDLE",
      sentiment: 0.45,
      engagementScore: 95,
      specialization: "PennyLane 4-Qubit VQC (AngleEmbedding + Pauli-Z)",
      modelType: "default.qubit 4-Wire VQC"
    });
  }

  // 5. 1 Master Orchestrator Node (guide.md Sec 3 - AdminOrchestrator)
  agents.push({
    agentId: "admin_001",
    name: "AdminOrchestrator",
    type: "admin",
    pipelineGroup: "ADMIN_MASTER",
    roleDescription: "Synthesizes ChannelAnalyzer, TrendAgent, ModelEnsemble, RootCause, Recommender, and QuantumVQC outputs into one unified, prioritized executive report.",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin_master&backgroundColor=8b5cf6",
    status: "IDLE",
    sentiment: 0.65,
    engagementScore: 100,
    specialization: "Multi-Modal Bayesian Orchestration Engine"
  });

  return agents;
}
