import { AgentProfile } from "../../shared/src/types/index";
import { AGENT_DISTRIBUTION, TOTAL_SIMULATION_AGENTS, TOTAL_ADMIN_AGENTS, TOTAL_GRAPH_NODES } from "../../shared/src/constants/index";

/**
 * 30-30-30-10 Multi-Modal Agent Registry Generator
 * 30 ML Trained Models + 30 PyTrends Search Agents + 30 Groq Reasoning Agents + 10 QML Quantum Agents + 1 Admin Master
 */
export function generateAgentRegistry(): AgentProfile[] {
  const agents: AgentProfile[] = [];

  // 1. 30 Classical ML Agents (Trained RandomForest, KMeans Segmentation, IsolationForest Anomaly)
  for (let i = 1; i <= AGENT_DISTRIBUTION.ml; i++) {
    const id = `ml_${String(i).padStart(3, "0")}`;
    const modelType = i <= 10 ? "RandomForest ROAS Predictor" : (i <= 20 ? "KMeans Customer Segmentor" : "IsolationForest Anomaly Detector");
    agents.push({
      agentId: id,
      name: `ML Model Agent ${i}`,
      type: "ml",
      pipelineGroup: "ML_TRAINED",
      roleDescription: `Supervised & Unsupervised statistical modeling: ${modelType}`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}&backgroundColor=06b6d4`,
      status: "IDLE",
      sentiment: 0.1,
      engagementScore: 80 + (i % 15),
      specialization: modelType,
      modelType,
      trendSensitivity: 0.75,
      priceSensitivity: 0.45
    });
  }

  // 2. 30 PyTrends Search Momentum Agents (Real Google Search Trends & Rising Query Extraction)
  for (let i = 1; i <= AGENT_DISTRIBUTION.pytrend; i++) {
    const id = `pytrend_${String(i).padStart(3, "0")}`;
    const focus = i <= 10 ? "Breakout Query Radar" : (i <= 20 ? "Search Velocity Momentum" : "Geo Interest & Viral Lift");
    agents.push({
      agentId: id,
      name: `PyTrends Signal Agent ${i}`,
      type: "pytrend",
      pipelineGroup: "PYTREND_SEARCH",
      roleDescription: `Real-time search trend extraction and velocity scoring: ${focus}`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${id}&backgroundColor=f59e0b`,
      status: "IDLE",
      sentiment: 0.2,
      engagementScore: 85,
      specialization: focus,
      searchMomentumScore: 88
    });
  }

  // 3. 30 Groq / LLM Qualitative Reasoning Agents (LLaMA 3.3 70B & Grok Reasoning)
  for (let i = 1; i <= AGENT_DISTRIBUTION.groq; i++) {
    const id = `groq_${String(i).padStart(3, "0")}`;
    const persona = i <= 10 ? "Tech Enthusiast Persona" : (i <= 20 ? "Creative Copy Evaluator" : "Social Sentiment Critic");
    agents.push({
      agentId: id,
      name: `Groq LLM Agent ${i}`,
      type: "groq",
      pipelineGroup: "GROQ_LLM",
      roleDescription: `Ultra-fast structured qualitative reasoning & creative critique: ${persona}`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}&backgroundColor=10b981`,
      status: "IDLE",
      sentiment: 0.3,
      engagementScore: 90,
      specialization: persona,
      modelType: "groq/llama-3.3-70b"
    });
  }

  // 4. 10 Quantum Machine Learning (QML) Agents (PennyLane Variational Quantum Circuits)
  for (let i = 1; i <= AGENT_DISTRIBUTION.qml; i++) {
    const id = `qml_${String(i).padStart(3, "0")}`;
    agents.push({
      agentId: id,
      name: `Quantum QML Node ${i}`,
      type: "qml",
      pipelineGroup: "QML_QUANTUM",
      roleDescription: "4-Qubit Variational Quantum Circuit & Hilbert space non-linear feature entanglement",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}&backgroundColor=ec4899`,
      status: "IDLE",
      sentiment: 0.5,
      engagementScore: 95,
      specialization: "PennyLane Variational Quantum Classifier (VQC)",
      modelType: "default.qubit 4-Wire VQC"
    });
  }

  // 5. 1 Master Quantum-Classical Admin Intelligence Node
  agents.push({
    agentId: "admin_001",
    name: "Admin Intelligence Master",
    type: "admin",
    pipelineGroup: "ADMIN_MASTER",
    roleDescription: "Synthesizes 30 ML + 30 PyTrends + 30 Groq + 10 QML agents into Bayesian consensus actions",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin_master&backgroundColor=8b5cf6",
    status: "IDLE",
    sentiment: 0.6,
    engagementScore: 100,
    specialization: "Quantum-Classical Bayesian Ensemble Aggregator"
  });

  const simCount = agents.filter(a => a.type !== "admin").length;
  const adminCount = agents.filter(a => a.type === "admin").length;
  if (simCount !== TOTAL_SIMULATION_AGENTS || adminCount !== TOTAL_ADMIN_AGENTS || agents.length !== TOTAL_GRAPH_NODES) {
    throw new Error(`CRITICAL INVARIANT VIOLATION: Expected 100 sim + 1 admin = 101, got ${agents.length}`);
  }

  return agents;
}
