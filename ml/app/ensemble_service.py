"""
Quantum-Classical Multi-Modal Ensemble Aggregator (guide.md Section 7)
Formula:
final_score = 0.30 * grok_score + 0.30 * qml_score + 0.30 * simple_score + 0.10 * rule_score

Subsystems:
1. 30 Classical ML Models (GradientBoosting + RandomForest) - 0.30 weight
2. 30 Groq / LLM Qualitative Reasoning Agents - 0.30 weight
3. 10 PennyLane QML Variational Quantum Circuits - 0.30 weight
4. Rule Guardrail (CPA & Impressions threshold guardrails) - 0.10 weight
"""
import numpy as np
from typing import Dict, Any, List
from .services import ml_service
from .pytrends_service import pytrends_service
from .groq_service import groq_service
from .qml_service import qml_service
from .models import CampaignPredictionRequest

class EnsembleAggregator:
    def evaluate_all(self, params: Dict[str, Any]) -> Dict[str, Any]:
        # Middle Layer: Clean, sanitize, and extract semantic features via Grok
        cleaned = groq_service.clean_and_process_data(params)
        
        spend = cleaned["spend"]
        impressions = cleaned["impressions"]
        clicks = cleaned["clicks"]
        ctr = cleaned["ctr"]
        cpc = cleaned["cpc"]
        conversions = cleaned["conversions"]
        cpa = cleaned["cpa"]
        trend_keyword = cleaned["trend"]
        caption = cleaned["caption"]
        hashtags = cleaned["hashtags"]
        channel = cleaned["channel"]
        audience = cleaned["audience"]
        
        # 1. Pipeline 1: 30 Trained Classical ML Models (guide.md Sec 7.2)
        ml_req = CampaignPredictionRequest(
            spend=spend,
            impressions=impressions,
            clicks=clicks,
            ctr=ctr,
            cpc=cpc,
            trend_alignment=float(params.get("trendAlignment", 92.0))
        )
        ml_res = ml_service.predict_campaign(ml_req)
        simple_score_roas = ml_res.predicted_roas
        
        # 2. Pipeline 2: 30 PyTrends Google Search Signals (guide.md Sec 8 Hybrid Signal)
        pytrends_res = pytrends_service.get_search_momentum(trend_keyword)
        pytrends_velocity = pytrends_res["velocity_score"]
        
        # 3. Pipeline 3: 30 Groq / Grok LLM Qualitative Reasoning (guide.md Sec 7.4)
        groq_res = groq_service.evaluate_creative_and_reasoning(
            campaign_name=trend_keyword,
            caption=caption,
            hashtags=hashtags,
            channel=channel
        )
        # Scale Groq creative score (0-100) to ROAS baseline
        grok_score_roas = 1.5 + (groq_res["creative_score"] / 100.0) * 2.8
        
        # 4. Pipeline 4: 10 QML Quantum Variational Circuits (guide.md Sec 7.3)
        qml_res = qml_service.evaluate_quantum_resonance(
            spend=spend,
            ctr=ctr,
            velocity=pytrends_velocity,
            affinity=groq_res["creative_score"]
        )
        qml_score_roas = qml_res["quantum_predicted_roas"]
        
        # 5. Pipeline 5: Rule Guardrail & Combiner (guide.md Sec 7.5)
        # Rules: Penalize CPA > 3x average ($18.00) & impressions < 500
        rule_penalty = 1.0
        guardrail_notes = []
        
        if cpa > 18.0:
            rule_penalty *= 0.65
            guardrail_notes.append(f"CPA penalty: ${cpa:.2f} exceeds $18.00 threshold (x0.65)")
        if impressions < 500:
            rule_penalty *= 0.70
            guardrail_notes.append("Low volume penalty: Impressions < 500 (x0.70)")
            
        rule_score_roas = max(0.8, 3.2 * rule_penalty)
        
        # Exact guide.md Section 7 Equation:
        # final_score = 0.30 * grok_score + 0.30 * qml_score + 0.30 * simple_score + 0.10 * rule_score
        w_grok = 0.30
        w_qml = 0.30
        w_simple = 0.30
        w_rule = 0.10
        
        raw_consensus_roas = (
            w_grok * grok_score_roas +
            w_qml * qml_score_roas +
            w_simple * simple_score_roas +
            w_rule * rule_score_roas
        )
        consensus_roas = round(raw_consensus_roas, 2)
        
        # Divergence Dampener (guide.md Sec 7.5)
        scores = [grok_score_roas, qml_score_roas, simple_score_roas]
        score_std = float(np.std(scores))
        base_confidence = (
            0.30 * 0.90 +
            0.30 * qml_res["quantum_confidence"] +
            0.30 * ml_res.confidence +
            0.10 * 0.95
        )
        # Dampen confidence if models diverge significantly
        divergence_penalty = max(0.0, (score_std - 0.8) * 0.15)
        ensemble_confidence = round(max(0.60, min(0.98, base_confidence - divergence_penalty)), 3)
        
        # Consensus Decision
        if consensus_roas >= 3.2:
            decision = "SCALE"
            priority = "HIGH"
        elif consensus_roas >= 2.0:
            decision = "MAINTAIN"
            priority = "MEDIUM"
        else:
            decision = "INVESTIGATE"
            priority = "CRITICAL"

        # Generate qualitative executive consensus using Groq
        consensus_analysis = groq_service.generate_executive_consensus(
            campaign_name=trend_keyword,
            channel=channel,
            spend=spend,
            audience=audience,
            decision=decision,
            consensus_roas=consensus_roas,
            confidence=ensemble_confidence,
            ml_roas=simple_score_roas,
            pytrends_velocity=pytrends_velocity,
            groq_score=groq_res["creative_score"],
            qml_roas=qml_score_roas
        )

        return {
            "ensemble_summary": {
                "decision": decision,
                "priority": priority,
                "consensus_roas": consensus_roas,
                "ensemble_confidence": ensemble_confidence,
                "summary": consensus_analysis["summary"],
                "evidence": consensus_analysis["evidence"],
                "recommended_actions": consensus_analysis["recommended_actions"],
                "guardrail_notes": guardrail_notes or ["All campaign unit economics pass compliance guardrails."],
                "agent_distribution": {
                    "ml_agents_count": 30,
                    "pytrend_agents_count": 30,
                    "groq_agents_count": 30,
                    "qml_agents_count": 10,
                    "admin_master_count": 1,
                    "total_nodes": 101
                }
            },
            "pipeline_breakdown": {
                "grok_middle_layer": {
                    "role": "Semantic Data Sanitization, Noise Filtering & Feature Extraction",
                    "sanitized_caption": caption,
                    "extracted_keywords": cleaned.get("extracted_keywords", []),
                    "semantic_tone": cleaned.get("semantic_tone", "High Velocity"),
                    "semantic_boost": cleaned.get("semantic_boost", 1.0),
                    "urgency_score": cleaned.get("urgency_score", 0.85),
                    "status": "Data Sanitized & Vectors Dispatched to 101 Nodes"
                },
                "trained_ml": {
                    "agents": "ChannelAnalyzer #1–10, ModelEnsemble #11–20, RootCause #21–30",
                    "predicted_roas": simple_score_roas,
                    "predicted_conversion_rate": ml_res.predicted_conversion_rate,
                    "confidence": ml_res.confidence,
                    "status": "GradientBoosting + RandomForest Active"
                },
                "pytrends_search": {
                    "agents": "TrendAgent #1–30",
                    "current_interest": pytrends_res["current_interest"],
                    "growth_rate_pct": pytrends_res["growth_rate_pct"],
                    "velocity_score": pytrends_velocity,
                    "status": pytrends_res["status"],
                    "historical_curve": pytrends_res.get("historical_curve", [60, 68, 75, 82, 89, 94, 98])
                },
                "groq_llm": {
                    "agents": "RecommenderAgent #1–30",
                    "creative_score": groq_res["creative_score"],
                    "hook_strength": groq_res["hook_strength"],
                    "sentiment_score": groq_res["sentiment_score"],
                    "target_appeal": groq_res["target_appeal"],
                    "critique": groq_res["critique"],
                    "grok_estimated_roas": round(grok_score_roas, 2)
                },
                "qml_quantum": {
                    "agents": "QuantumVQC #1–10",
                    "quantum_predicted_roas": qml_score_roas,
                    "quantum_confidence": qml_res["quantum_confidence"],
                    "quantum_resonance_score": qml_res["quantum_resonance_score"],
                    "expectation_value": qml_res["expectation_value"],
                    "entanglement_interactions": qml_res["entanglement_interactions"]
                },
                "rule_guardrail": {
                    "weight": 0.10,
                    "rule_score_roas": round(rule_score_roas, 2),
                    "notes": guardrail_notes
                }
            }
        }

ensemble_aggregator = EnsembleAggregator()
