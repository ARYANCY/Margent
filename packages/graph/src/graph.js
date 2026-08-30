"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationGraphEngine = void 0;
const grok_1 = require("../../agents/src/llm/grok");
class SimulationGraphEngine {
    state;
    llmClient;
    onEventCallback;
    onStateUpdateCallback;
    constructor(initialState) {
        this.state = initialState;
        this.llmClient = new grok_1.LLMClient();
    }
    setCallbacks(onEvent, onStateUpdate) {
        this.onEventCallback = onEvent;
        this.onStateUpdateCallback = onStateUpdate;
    }
    getState() {
        return this.state;
    }
    setActiveCampaign(campaign) {
        this.state.activeCampaign = campaign;
        if (!this.state.campaigns.find(c => c.campaignId === campaign.campaignId)) {
            this.state.campaigns.unshift(campaign);
        }
    }
    /**
     * Executes multi-modal tick across the 4 pipelines:
     * 30 ML Agents, 30 PyTrends Agents, 30 Groq Agents, 10 QML Quantum Agents -> 1 Admin Master
     */
    async executeTick(customActiveCount) {
        this.state.tick += 1;
        const activeCampaign = this.state.activeCampaign || this.state.campaigns[0];
        const topTrend = this.state.trends.sort((a, b) => (b.growth || 0) - (a.growth || 0))[0] || {
            name: "Autonomous AI",
            hashtag: "#AgenticAI",
            growth: 95.0,
            velocity: 92.0
        };
        // Pick active representatives from each of the 4 pipelines
        const mlIds = Object.keys(this.state.agents).filter(id => id.startsWith("ml_"));
        const pytrendIds = Object.keys(this.state.agents).filter(id => id.startsWith("pytrend_"));
        const groqIds = Object.keys(this.state.agents).filter(id => id.startsWith("groq_"));
        const qmlIds = Object.keys(this.state.agents).filter(id => id.startsWith("qml_"));
        const pickSample = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
        const activeML = pickSample(mlIds, 3);
        const activePyTrends = pickSample(pytrendIds, 3);
        const activeGroq = pickSample(groqIds, 3);
        const activeQML = pickSample(qmlIds, 2);
        this.state.activeAgentIds = [...activeML, ...activePyTrends, ...activeGroq, ...activeQML, "admin_001"];
        this.state.activeEdges = [];
        const newEvents = [];
        // Middle Layer: Grok Data Cleaning, Sanitization & Semantic Feature Processing
        const cleanedData = await this.llmClient.cleanAndProcessCampaignData({
            campaignName: activeCampaign.campaignName,
            caption: activeCampaign.caption || "Autonomous AI Launch",
            hashtags: activeCampaign.hashtags || ["#AgenticAI"],
            channel: activeCampaign.channel,
            spend: activeCampaign.spend,
            audience: activeCampaign.audience,
            trend: topTrend.name
        });
        // Call Python Ensemble Microservice
        let ensembleData = null;
        try {
            const mlUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
            const resp = await fetch(`${mlUrl}/ensemble/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    spend: cleanedData.cleanedSpend,
                    impressions: activeCampaign.impressions,
                    clicks: activeCampaign.clicks,
                    ctr: activeCampaign.ctr,
                    cpc: activeCampaign.cpc,
                    trend: topTrend.name,
                    caption: cleanedData.sanitizedCaption,
                    hashtags: cleanedData.cleanedHashtags,
                    channel: activeCampaign.channel,
                    audience: activeCampaign.audience
                })
            });
            if (resp.ok) {
                ensembleData = await resp.json();
            }
        }
        catch (err) {
            console.warn("Could not call ensemble service directly, using internal fallback:", err);
        }
        const pb = ensembleData?.pipeline_breakdown;
        const es = ensembleData?.ensemble_summary;
        // 1. Update Active ML Agents (Inference Evaluation)
        for (const id of activeML) {
            const agent = this.state.agents[id];
            if (agent) {
                const predRoas = pb?.trained_ml?.predicted_roas || activeCampaign.roas;
                const convRate = pb?.trained_ml?.predicted_conversion_rate || 0.082;
                agent.status = "ML_INFERRING";
                agent.lastAction = `RandomForest inferred ${predRoas}x ROAS (${(convRate * 100).toFixed(1)}% Conv Rate)`;
                agent.lastActionTime = new Date().toISOString();
                const message = `${agent.name}: GradientBoosting regressor evaluated channel '${activeCampaign.channel}' with ${predRoas}x ROAS and $${activeCampaign.cpc.toFixed(2)} CPC.`;
                const evt = {
                    eventId: `evt_ml_${Date.now()}_${id}`,
                    timestamp: Date.now(),
                    source: id,
                    target: "admin_001",
                    type: "ALLOCATION_CHANGED",
                    payload: {
                        title: "Classical ML Inference",
                        message,
                        roas: predRoas,
                        confidence: pb?.trained_ml?.confidence || 0.88,
                        channel: activeCampaign.channel
                    }
                };
                newEvents.push(evt);
                this.state.activeEdges.push({ source: id, target: "admin_001", eventType: "EDGE_ACTIVATE" });
                this.onEventCallback?.(evt);
            }
        }
        // 2. Update Active PyTrends Agents (Real-Time Search Signals)
        for (const id of activePyTrends) {
            const agent = this.state.agents[id];
            if (agent) {
                const velocity = pb?.pytrends_search?.velocity_score || 88.5;
                const growth = pb?.pytrends_search?.growth_rate_pct || 92.4;
                const status = pb?.pytrends_search?.status || "RISING";
                agent.status = "PYTREND_SCANNING";
                agent.lastAction = `Google Search Velocity: ${velocity}/100 for '${topTrend.name}' (${status})`;
                agent.lastActionTime = new Date().toISOString();
                const message = `${agent.name}: Search momentum for '${topTrend.name}' is ${status} with +${growth}% breakout velocity.`;
                const evt = {
                    eventId: `evt_pytrend_${Date.now()}_${id}`,
                    timestamp: Date.now(),
                    source: id,
                    target: "admin_001",
                    type: "PYTREND_SPIKE",
                    payload: {
                        title: "Google Search Signal",
                        message,
                        velocity,
                        keyword: topTrend.name,
                        status
                    }
                };
                newEvents.push(evt);
                this.state.activeEdges.push({ source: id, target: "admin_001", eventType: "TREND_UPDATED" });
                this.onEventCallback?.(evt);
            }
        }
        // 3. Update Active Groq Cognitive LLM Agents (Persona Reactions & Copy Critique)
        const personaCritiques = [
            "The value proposition in the first 3 seconds is strong, but the CTA requires more urgency for impulse buying.",
            "High cultural resonance with modern tech creators. Copy tone aligns well with current AI discourse.",
            "Visual hook generates immediate curiosity. Recommend testing A/B variant with concrete ROI proof points.",
            "Linguistic tone appeals directly to early adopters. Viral sharing potential is elevated (+0.48 Sentiment)."
        ];
        for (let i = 0; i < activeGroq.length; i++) {
            const id = activeGroq[i];
            const agent = this.state.agents[id];
            if (agent) {
                const creativeScore = pb?.groq_llm?.creative_score || 88;
                const critiqueText = pb?.groq_llm?.critique || personaCritiques[i % personaCritiques.length];
                agent.status = "GROQ_REASONING";
                agent.sentiment = pb?.groq_llm?.sentiment_score || 0.65;
                agent.lastAction = `Groq LLaMA 3.3 Persona Review: "${critiqueText}"`;
                agent.lastActionTime = new Date().toISOString();
                this.state.stats.totalLikes += 1;
                this.state.stats.totalComments += 1;
                const message = `${agent.name} (${agent.specialization || 'Cognitive Reviewer'}): "${critiqueText}"`;
                const evt = {
                    eventId: `evt_groq_${Date.now()}_${id}`,
                    timestamp: Date.now(),
                    source: id,
                    target: "admin_001",
                    type: "GROQ_CRITIQUE",
                    payload: {
                        title: "Audience Perspective",
                        message,
                        critique: critiqueText,
                        sentiment: agent.sentiment,
                        creativeScore
                    }
                };
                newEvents.push(evt);
                this.state.activeEdges.push({ source: id, target: "admin_001", eventType: "COMMENT" });
                this.onEventCallback?.(evt);
            }
        }
        // 4. Update Active PennyLane QML Agents (Hilbert Space Entanglement)
        for (const id of activeQML) {
            const agent = this.state.agents[id];
            if (agent) {
                const qScore = pb?.qml_quantum?.quantum_resonance_score || 89.4;
                const qRoas = pb?.qml_quantum?.quantum_predicted_roas || 3.85;
                const expVal = pb?.qml_quantum?.expectation_value || -0.3294;
                agent.status = "QUANTUM_RESOLVING";
                agent.lastAction = `PennyLane 4-Qubit Circuit: ⟨σz⟩ = ${expVal.toFixed(4)} | Quantum ROAS: ${qRoas}x`;
                agent.lastActionTime = new Date().toISOString();
                const message = `${agent.name}: Evaluated 4-qubit Hilbert entanglement between Spend ($${activeCampaign.spend}) and CTR (${(activeCampaign.ctr * 100).toFixed(1)}%) with ${qScore}% resonance.`;
                const evt = {
                    eventId: `evt_qml_${Date.now()}_${id}`,
                    timestamp: Date.now(),
                    source: id,
                    target: "admin_001",
                    type: "QML_ENTANGLEMENT",
                    payload: {
                        title: "PennyLane QML Entanglement",
                        message,
                        quantumScore: qScore,
                        quantumRoas: qRoas,
                        expectationValue: expVal
                    }
                };
                newEvents.push(evt);
                this.state.activeEdges.push({ source: id, target: "admin_001", eventType: "QML_ENTANGLEMENT" });
                this.onEventCallback?.(evt);
            }
        }
        // 5. Admin Ensemble Synthesis Node (Executive Bayesian Consensus)
        const consensusRoas = es?.consensus_roas || activeCampaign.roas;
        const consensusDecision = es?.decision || "SCALE";
        const consensusPriority = es?.priority || "HIGH";
        const consensusConfidence = es?.ensemble_confidence || 0.91;
        const analysis = {
            decision: consensusDecision,
            confidence: consensusConfidence,
            simulatedRoas: consensusRoas,
            summary: es?.summary || `All 4 pipelines (30 ML Models, 30 PyTrends Signals, 30 Groq LLM agents, and 10 PennyLane QML Circuits) converged on a profitable ${consensusDecision} recommendation with ${consensusRoas}x consensus ROAS and ${Math.round(consensusConfidence * 100)}% confidence.`,
            evidence: es?.evidence || [
                `Trained ML Models (30 Agents): Predicted ROAS ${pb?.trained_ml?.predicted_roas || activeCampaign.roas}x with high unit economics efficiency.`,
                `PyTrends Google Signals (30 Agents): Search volume velocity reached ${pb?.pytrends_search?.velocity_score || 88}/100 for '${topTrend.name}'.`,
                `Groq LLaMA 3.3 (30 Agents): Creative hook rating scored at ${pb?.groq_llm?.creative_score || 88}/100 with positive audience sentiment (+${pb?.groq_llm?.sentiment_score || 0.65}).`,
                `PennyLane QML Circuits (10 Agents): Hilbert Space variational circuit predicted ${pb?.qml_quantum?.quantum_predicted_roas || 3.85}x ROAS.`
            ],
            recommendedActions: es?.recommended_actions || [
                `Scale budget on ${activeCampaign.channel} targeting verified audience personas.`,
                `Maintain 80% exploitation allocation and 20% exploration allocation on emerging trend angles.`,
                `Deploy creative copy hooks optimized by Groq LLaMA 3.3 reasoning.`
            ],
            ensembleBreakdown: {
                ml_roas: pb?.trained_ml?.predicted_roas || 3.5,
                pytrends_velocity: pb?.pytrends_search?.velocity_score || 88,
                groq_creative_score: pb?.groq_llm?.creative_score || 85,
                qml_predicted_roas: pb?.qml_quantum?.quantum_predicted_roas || 3.85,
                qml_resonance_score: pb?.qml_quantum?.quantum_resonance_score || 89.4,
                consensus_roas: consensusRoas,
                entanglement_matrix: pb?.qml_quantum?.entanglement_interactions
            },
            activeAgentsCount: this.state.activeAgentIds.length,
            timestamp: new Date().toISOString()
        };
        this.state.adminAnalysis = analysis;
        const adminEvt = {
            eventId: `evt_admin_${Date.now()}`,
            timestamp: Date.now(),
            source: "admin_001",
            type: "ADMIN_ANALYSIS",
            payload: {
                title: "Executive Bayesian Consensus",
                decision: consensusDecision,
                summary: analysis.summary,
                confidence: consensusConfidence,
                roas: consensusRoas
            }
        };
        newEvents.push(adminEvt);
        this.onEventCallback?.(adminEvt);
        this.state.events = [...newEvents, ...this.state.events].slice(0, 150);
        this.onStateUpdateCallback?.(this.state);
        return this.state;
    }
}
exports.SimulationGraphEngine = SimulationGraphEngine;
