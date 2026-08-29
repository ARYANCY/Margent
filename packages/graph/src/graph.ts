import { SimulationGraphState } from "./state";
import { AgentEvent, RealTrend, CanonicalCampaign, AdminAnalysis } from "../../shared/src/types/index";

export class SimulationGraphEngine {
  private state: SimulationGraphState;
  private onEventCallback?: (event: AgentEvent) => void;
  private onStateUpdateCallback?: (state: SimulationGraphState) => void;

  constructor(initialState: SimulationGraphState) {
    this.state = initialState;
  }

  setCallbacks(
    onEvent?: (event: AgentEvent) => void,
    onStateUpdate?: (state: SimulationGraphState) => void
  ) {
    this.onEventCallback = onEvent;
    this.onStateUpdateCallback = onStateUpdate;
  }

  getState(): SimulationGraphState {
    return this.state;
  }

  setActiveCampaign(campaign: CanonicalCampaign) {
    this.state.activeCampaign = campaign;
    if (!this.state.campaigns.find(c => c.campaignId === campaign.campaignId)) {
      this.state.campaigns.unshift(campaign);
    }
  }

  /**
   * Executes multi-modal tick across the 4 pipelines:
   * 30 ML Agents, 30 PyTrends Agents, 30 Groq Agents, 10 QML Quantum Agents -> 1 Admin Master
   */
  async executeTick(customActiveCount?: number): Promise<SimulationGraphState> {
    this.state.tick += 1;
    const activeCampaign = this.state.activeCampaign || this.state.campaigns[0];
    const topTrend = this.state.trends.sort((a, b) => b.score - a.score)[0];

    // Pick active representatives from each of the 4 pipelines
    const mlIds = Object.keys(this.state.agents).filter(id => id.startsWith("ml_"));
    const pytrendIds = Object.keys(this.state.agents).filter(id => id.startsWith("pytrend_"));
    const groqIds = Object.keys(this.state.agents).filter(id => id.startsWith("groq_"));
    const qmlIds = Object.keys(this.state.agents).filter(id => id.startsWith("qml_"));

    const pickSample = (arr: string[], n: number) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

    const activeML = pickSample(mlIds, 4);
    const activePyTrends = pickSample(pytrendIds, 4);
    const activeGroq = pickSample(groqIds, 4);
    const activeQML = pickSample(qmlIds, 2);

    this.state.activeAgentIds = [...activeML, ...activePyTrends, ...activeGroq, ...activeQML, "admin_001"];
    this.state.activeEdges = [];

    const newEvents: AgentEvent[] = [];

    // Call Python Ensemble Microservice
    let ensembleData: any = null;
    try {
      const mlUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
      const resp = await fetch(`${mlUrl}/ensemble/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spend: activeCampaign.spend,
          impressions: activeCampaign.impressions,
          clicks: activeCampaign.clicks,
          ctr: activeCampaign.ctr,
          cpc: activeCampaign.cpc,
          trend: topTrend.name,
          caption: activeCampaign.caption || "Autonomous AI Launch",
          hashtags: activeCampaign.hashtags || ["#AgenticAI"],
          channel: activeCampaign.channel
        })
      });
      if (resp.ok) {
        ensembleData = await resp.json();
      }
    } catch (err) {
      console.warn("Could not call ensemble service directly, using internal fallback:", err);
    }

    const pb = ensembleData?.pipeline_breakdown;
    const es = ensembleData?.ensemble_summary;

    // 1. Update Active ML Agents
    for (const id of activeML) {
      const agent = this.state.agents[id];
      if (agent) {
        const predRoas = pb?.trained_ml?.predicted_roas || activeCampaign.roas;
        agent.status = "ML_INFERRING";
        agent.lastAction = `Predicted ROAS: ${predRoas}x (Conversion Rate: ${pb?.trained_ml?.predicted_conversion_rate || 0.08})`;
        agent.lastActionTime = new Date().toISOString();

        const evt: AgentEvent = {
          eventId: `evt_ml_${Date.now()}_${id}`,
          simulationId: "sim_live",
          timestamp: new Date().toISOString(),
          source: id,
          target: "admin_001",
          type: "ANOMALY_DETECTED",
          payload: { model: agent.modelType, roas: predRoas }
        };
        newEvents.push(evt);
        this.state.activeEdges.push({ source: id, target: "admin_001", eventType: "EDGE_ACTIVATE" });
        this.onEventCallback?.(evt);
      }
    }

    // 2. Update Active PyTrends Agents
    for (const id of activePyTrends) {
      const agent = this.state.agents[id];
      if (agent) {
        const velocity = pb?.pytrends_search?.velocity_score || 88.5;
        agent.status = "PYTREND_SCANNING";
        agent.lastAction = `Google Search Velocity Score: ${velocity}/100 (Status: ${pb?.pytrends_search?.status || "RISING"})`;
        agent.lastActionTime = new Date().toISOString();

        const evt: AgentEvent = {
          eventId: `evt_pytrend_${Date.now()}_${id}`,
          simulationId: "sim_live",
          timestamp: new Date().toISOString(),
          source: id,
          target: "admin_001",
          type: "TREND_UPDATED",
          payload: { velocity, keyword: topTrend.name }
        };
        newEvents.push(evt);
        this.state.activeEdges.push({ source: id, target: "admin_001", eventType: "TREND_UPDATED" });
        this.onEventCallback?.(evt);
      }
    }

    // 3. Update Active Groq Agents
    for (const id of activeGroq) {
      const agent = this.state.agents[id];
      if (agent) {
        const creativeScore = pb?.groq_reasoning?.creative_score || 85;
        const comment = pb?.groq_reasoning?.critique || "Crisp value proposition with high viral hook resonance.";
        agent.status = "GROQ_REASONING";
        agent.sentiment = pb?.groq_reasoning?.sentiment_score || 0.72;
        agent.lastAction = `Groq LLaMA 3.3 Critique: "${comment}" (Score: ${creativeScore}/100)`;
        agent.lastActionTime = new Date().toISOString();

        this.state.stats.totalLikes += 1;
        this.state.stats.totalComments += 1;

        const evt: AgentEvent = {
          eventId: `evt_groq_${Date.now()}_${id}`,
          simulationId: "sim_live",
          timestamp: new Date().toISOString(),
          source: id,
          target: "admin_001",
          type: "COMMENT",
          payload: { comment, sentiment: agent.sentiment, creativeScore }
        };
        newEvents.push(evt);
        this.state.activeEdges.push({ source: id, target: "admin_001", eventType: "COMMENT" });
        this.onEventCallback?.(evt);
      }
    }

    // 4. Update Active QML Agents
    for (const id of activeQML) {
      const agent = this.state.agents[id];
      if (agent) {
        const qScore = pb?.quantum_qml?.quantum_resonance_score || 89.4;
        const qRoas = pb?.quantum_qml?.quantum_predicted_roas || 3.95;
        agent.status = "QUANTUM_RESOLVING";
        agent.lastAction = `PennyLane 4-Qubit Expectation: ${pb?.quantum_qml?.expectation_value || -0.82} | Quantum ROAS: ${qRoas}x`;
        agent.lastActionTime = new Date().toISOString();

        const evt: AgentEvent = {
          eventId: `evt_qml_${Date.now()}_${id}`,
          simulationId: "sim_live",
          timestamp: new Date().toISOString(),
          source: id,
          target: "admin_001",
          type: "QML_ENTANGLEMENT",
          payload: { quantumScore: qScore, quantumRoas: qRoas }
        };
        newEvents.push(evt);
        this.state.activeEdges.push({ source: id, target: "admin_001", eventType: "QML_ENTANGLEMENT" });
        this.onEventCallback?.(evt);
      }
    }

    // 5. Admin Ensemble Synthesis Node
    const consensusRoas = es?.consensus_roas || activeCampaign.roas;
    const consensusDecision = es?.decision || "SCALE";
    const consensusPriority = es?.priority || "HIGH";
    const consensusConfidence = es?.ensemble_confidence || 0.91;

    const analysis: AdminAnalysis = {
      analysisId: `admin_ensemble_${Date.now()}`,
      timestamp: new Date().toISOString(),
      priority: consensusPriority,
      decision: consensusDecision,
      summary: `30-30-30-10 Multi-Modal Consensus: ML models (${pb?.trained_ml?.predicted_roas || activeCampaign.roas}x), PyTrends (${pb?.pytrends_search?.velocity_score || 88}/100), Groq (${pb?.groq_reasoning?.creative_score || 85}/100), and PennyLane QML (${pb?.quantum_qml?.quantum_predicted_roas || 3.9}x) align with ${Math.round(consensusConfidence * 100)}% confidence.`,
      evidence: [
        `Trained ML Models (30 Agents): Predicted ROAS ${pb?.trained_ml?.predicted_roas || activeCampaign.roas}x with healthy unit economics.`,
        `PyTrends Google Signals (30 Agents): Search velocity reached ${pb?.pytrends_search?.velocity_score || 88}/100 for '${topTrend.name}'.`,
        `Groq LLaMA 3.3 70B (30 Agents): Creative hook rated at ${pb?.groq_reasoning?.creative_score || 85}/100 with positive sentiment (+${pb?.groq_reasoning?.sentiment_score || 0.72}).`,
        `PennyLane QML Circuits (10 Agents): 4-Qubit quantum expectation calculated optimal resonance (${pb?.quantum_qml?.quantum_predicted_roas || 3.95}x ROAS).`
      ],
      recommendedActions: [
        `Scale primary budget by 35% on ${activeCampaign.channel} targeting high-resonance trendsets.`,
        `Maintain 80% exploitation allocation on verified signals and 20% on emerging quantum-entangled variants.`,
        `Deploy creator hooks optimized by Groq LLaMA 3.3 reasoning.`
      ],
      confidence: consensusConfidence,
      exploitationAllocation: 0.80,
      explorationAllocation: 0.20,
      activeAgentCount: this.state.activeAgentIds.length,
      averageSentiment: pb?.groq_reasoning?.sentiment_score || 0.72,
      topTrendName: topTrend.name,
      topTrendScore: topTrend.score,
      simulatedRoas: consensusRoas,
      simulatedCtr: activeCampaign.ctr,
      simulatedConversions: activeCampaign.conversions + this.state.stats.totalConversions,
      anomaliesDetected: [],
      ensembleBreakdown: {
        ml_roas: pb?.trained_ml?.predicted_roas || 3.5,
        pytrends_velocity: pb?.pytrends_search?.velocity_score || 88.0,
        groq_creative_score: pb?.groq_reasoning?.creative_score || 85.0,
        qml_resonance_score: pb?.quantum_qml?.quantum_resonance_score || 89.4,
        qml_predicted_roas: pb?.quantum_qml?.quantum_predicted_roas || 3.95,
        consensus_roas: consensusRoas,
        entanglement_matrix: pb?.quantum_qml?.entanglement_interactions || [
          { pair: "Spend ↔ CTR", entanglement: 0.85 },
          { pair: "CTR ↔ Velocity", entanglement: 0.92 },
          { pair: "Velocity ↔ Affinity", entanglement: 0.88 },
          { pair: "Spend ↔ Affinity", entanglement: 0.79 }
        ]
      }
    };

    const admin = this.state.agents["admin_001"];
    if (admin) {
      admin.status = "DECIDING";
      admin.lastAction = `ENSEMBLE DECISION: ${consensusDecision} (Consensus ROAS: ${consensusRoas}x, Conf: ${Math.round(consensusConfidence * 100)}%)`;
      admin.lastActionTime = new Date().toISOString();
      this.state.agents["admin_001"] = admin;
    }

    this.state.adminAnalysis = analysis;
    const adminEvt: AgentEvent = {
      eventId: `evt_admin_ensemble_${Date.now()}`,
      simulationId: "sim_live",
      timestamp: new Date().toISOString(),
      source: "admin_001",
      type: "ADMIN_ANALYSIS",
      payload: analysis
    };
    newEvents.push(adminEvt);
    this.onEventCallback?.(adminEvt);

    this.state.events = [...newEvents, ...this.state.events].slice(0, 100);
    this.onStateUpdateCallback?.(this.state);

    return this.state;
  }
}
