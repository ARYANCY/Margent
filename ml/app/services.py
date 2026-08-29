"""
ML Inference Services with robust model loading and heuristic fallbacks
"""
import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from .models import (
    CampaignPredictionRequest, CampaignPredictionResponse,
    CustomerSegmentRequest, CustomerSegmentResponse,
    AnomalyDetectionRequest, AnomalyDetectionResponse,
    TrendScoreRequest, TrendScoreResponse
)

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")

class MLService:
    def __init__(self):
        self.segmentation_artifact = None
        self.campaign_artifact = None
        self.anomaly_artifact = None
        self.load_models()

    def load_models(self):
        try:
            seg_path = os.path.join(MODEL_DIR, "segmentation_model.joblib")
            if os.path.exists(seg_path):
                self.segmentation_artifact = joblib.load(seg_path)
                print("Loaded segmentation model.")
        except Exception as e:
            print(f"Warning: Could not load segmentation model: {e}")

        try:
            camp_path = os.path.join(MODEL_DIR, "campaign_model.joblib")
            if os.path.exists(camp_path):
                self.campaign_artifact = joblib.load(camp_path)
                print("Loaded campaign model.")
        except Exception as e:
            print(f"Warning: Could not load campaign model: {e}")

        try:
            anom_path = os.path.join(MODEL_DIR, "anomaly_model.joblib")
            if os.path.exists(anom_path):
                self.anomaly_artifact = joblib.load(anom_path)
                print("Loaded anomaly model.")
        except Exception as e:
            print(f"Warning: Could not load anomaly model: {e}")

    def predict_campaign(self, req: CampaignPredictionRequest) -> CampaignPredictionResponse:
        if self.campaign_artifact:
            X = pd.DataFrame([{
                "spend": req.spend,
                "impressions": req.impressions,
                "clicks": req.clicks,
                "ctr": req.ctr,
                "cpc": req.cpc,
                "trend_alignment": req.trend_alignment
            }])
            roas = float(self.campaign_artifact["roas_model"].predict(X)[0])
            conv = float(self.campaign_artifact["conv_model"].predict(X)[0])
            confidence = 0.88
        else:
            # Deterministic ML baseline fallback
            roas = max(0.8, 2.0 + 12.0 * req.ctr + 0.025 * req.trend_alignment - 0.15 * np.log10(max(req.cpc, 0.1)))
            conv = max(0.02, 0.04 + 0.0005 * req.trend_alignment + 0.25 * req.ctr)
            confidence = 0.75

        roas = round(float(roas), 2)
        conv = round(float(conv), 4)
        expected_revenue = round(req.spend * roas, 2)
        
        if roas >= 3.5:
            rec = "SCALE_AGGRESSIVELY: High efficiency and strong trend resonance."
        elif roas >= 2.0:
            rec = "MAINTAIN_AND_OPTIMIZE: Healthy ROAS within profitable operating margins."
        else:
            rec = "INVESTIGATE_OR_REFINE: Sub-target return; optimize creative or align with higher velocity trend."

        return CampaignPredictionResponse(
            predicted_roas=roas,
            predicted_conversion_rate=conv,
            confidence=confidence,
            expected_revenue=expected_revenue,
            recommendation=rec
        )

    def segment_customer(self, req: CustomerSegmentRequest) -> CustomerSegmentResponse:
        if self.segmentation_artifact:
            model = self.segmentation_artifact["model"]
            X = np.array([[
                req.engagement,
                req.purchase_frequency,
                req.price_sensitivity,
                req.trend_sensitivity,
                req.conversion_rate
            ]])
            cluster_id = int(model.predict(X)[0])
            labels = self.segmentation_artifact.get("labels", {})
            label = labels.get(cluster_id, f"Cluster {cluster_id}")
            
            # calculate distance to cluster center
            center = model.cluster_centers_[cluster_id]
            dist = np.linalg.norm(X[0] - center)
            affinity = max(0.1, round(1.0 - float(dist), 3))
        else:
            # Rule-based fallback
            if req.trend_sensitivity > 0.8:
                cluster_id = 0
                label = "Tech Enthusiast"
            elif req.price_sensitivity > 0.75:
                cluster_id = 1
                label = "Budget Conscious"
            elif req.engagement > 0.8:
                cluster_id = 2
                label = "Trend Chaser"
            elif req.purchase_frequency > 0.7:
                cluster_id = 3
                label = "Luxury / Premium"
            else:
                cluster_id = 4
                label = "Eco & Value Driven"
            affinity = 0.85

        traits = []
        if req.trend_sensitivity > 0.7:
            traits.append("High Trend Responsiveness")
        if req.price_sensitivity > 0.7:
            traits.append("Discount Sensitive")
        if req.engagement > 0.7:
            traits.append("Active Social Commenter")

        return CustomerSegmentResponse(
            segment_id=cluster_id,
            segment_label=label,
            cluster_affinity=affinity,
            traits=traits or ["Standard Consumer Profile"]
        )

    def detect_anomaly(self, req: AnomalyDetectionRequest) -> AnomalyDetectionResponse:
        reasons = []
        is_anom = False
        anom_score = 0.0
        severity = "NORMAL"

        if self.anomaly_artifact:
            model = self.anomaly_artifact["model"]
            X = pd.DataFrame([{
                "spend": req.spend,
                "ctr": req.ctr,
                "cpc": req.cpc,
                "conversion_rate": req.conversion_rate,
                "roas": req.roas
            }])
            pred = model.predict(X)[0] # -1 for anomaly, 1 for normal
            raw_score = model.score_samples(X)[0]
            is_anom = bool(pred == -1)
            anom_score = round(float(abs(raw_score)), 3)
        else:
            if req.cpc > 4.5:
                is_anom = True
                anom_score = 0.85
            if req.roas < 1.0 and req.spend > 1500:
                is_anom = True
                anom_score = 0.90

        if req.cpc > 3.5:
            reasons.append(f"High CPC anomaly detected: ${req.cpc:.2f} per click")
        if req.ctr < 0.01:
            reasons.append(f"Critical low CTR: {(req.ctr * 100):.2f}%")
        if req.roas < 1.2 and req.spend > 1000:
            reasons.append(f"Unprofitable ROAS ({req.roas:.2f}x) at high spend level")

        if is_anom or len(reasons) > 0:
            is_anom = True
            severity = "HIGH" if len(reasons) >= 2 or req.roas < 0.8 else "MEDIUM"
        else:
            severity = "NORMAL"

        return AnomalyDetectionResponse(
            is_anomaly=is_anom,
            anomaly_score=anom_score,
            severity=severity,
            anomaly_reasons=reasons or ["Metrics within standard distribution bounds."]
        )

    def score_trend(self, req: TrendScoreRequest) -> TrendScoreResponse:
        w = req.weights or {
            "growth": 0.30,
            "interest": 0.20,
            "velocity": 0.15,
            "recency": 0.15,
            "relevance": 0.20
        }
        
        score = (
            w.get("growth", 0.3) * req.growth +
            w.get("interest", 0.2) * req.interest +
            w.get("velocity", 0.15) * req.velocity +
            w.get("recency", 0.15) * req.recency +
            w.get("relevance", 0.2) * req.relevance
        )
        score = round(float(score), 2)
        
        if score >= 85:
            tier = "TIER_1_VIRAL"
            status = "EXPLOSIVE_GROWTH"
        elif score >= 70:
            tier = "TIER_2_ESTABLISHED"
            status = "STRONG_MOMENTUM"
        elif score >= 50:
            tier = "TIER_3_EMERGING"
            status = "MODERATE_INTEREST"
        else:
            tier = "TIER_4_NICHE"
            status = "LOW_TRACTION"

        breakdown = {
            "growth_contrib": round(w.get("growth", 0.3) * req.growth, 2),
            "interest_contrib": round(w.get("interest", 0.2) * req.interest, 2),
            "velocity_contrib": round(w.get("velocity", 0.15) * req.velocity, 2),
            "recency_contrib": round(w.get("recency", 0.15) * req.recency, 2),
            "relevance_contrib": round(w.get("relevance", 0.2) * req.relevance, 2)
        }

        return TrendScoreResponse(
            score=score,
            tier=tier,
            status=status,
            breakdown=breakdown
        )

ml_service = MLService()
