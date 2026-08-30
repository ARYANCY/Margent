"""
FastAPI ML Service for AI Marketing Intelligence (30-30-30-10 Multi-Modal Ensemble)
"""
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from .models import (
    CampaignPredictionRequest, CampaignPredictionResponse,
    CustomerSegmentRequest, CustomerSegmentResponse,
    AnomalyDetectionRequest, AnomalyDetectionResponse,
    TrendScoreRequest, TrendScoreResponse
)
from .services import ml_service
from .pytrends_service import pytrends_service
from .groq_service import groq_service
from .qml_service import qml_service
from .ensemble_service import ensemble_aggregator
from .monte_carlo_service import monte_carlo_engine

app = FastAPI(
    title="AI Marketing Intelligence 30-30-30-10 Ensemble Service",
    version="2.0.0",
    description="Multi-modal service fusing 30 Trained ML, 30 PyTrends, 30 Groq, and 10 PennyLane QML models."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Marketing Intelligence 30-30-30-10 Ensemble",
        "pipelines": {
            "trained_ml_30_nodes": True,
            "pytrends_30_nodes": True,
            "groq_llm_30_nodes": True,
            "qml_quantum_10_nodes": True,
            "admin_ensemble_node": True
        }
    }

@app.post("/predict/campaign", response_model=CampaignPredictionResponse)
def predict_campaign(req: CampaignPredictionRequest):
    try:
        return ml_service.predict_campaign(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/segment/customer", response_model=CustomerSegmentResponse)
def segment_customer(req: CustomerSegmentRequest):
    try:
        return ml_service.segment_customer(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect/anomaly", response_model=AnomalyDetectionResponse)
def detect_anomaly(req: AnomalyDetectionRequest):
    try:
        return ml_service.detect_anomaly(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/score/trend", response_model=TrendScoreResponse)
def score_trend(req: TrendScoreRequest):
    try:
        return ml_service.score_trend(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/pytrends/extract")
def extract_pytrends(payload: Dict[str, Any] = Body(...)):
    try:
        kw = payload.get("keyword", "Autonomous AI")
        return pytrends_service.get_search_momentum(kw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/qml/predict")
def predict_qml(payload: Dict[str, Any] = Body(...)):
    try:
        spend = float(payload.get("spend", 1500))
        ctr = float(payload.get("ctr", 0.045))
        velocity = float(payload.get("velocity", 85.0))
        affinity = float(payload.get("affinity", 80.0))
        return qml_service.evaluate_quantum_resonance(spend, ctr, velocity, affinity)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/groq/reason")
def reason_groq(payload: Dict[str, Any] = Body(...)):
    try:
        return groq_service.evaluate_creative_and_reasoning(
            campaign_name=payload.get("campaignName", "AI Launch"),
            caption=payload.get("caption", "Next-Gen AI"),
            hashtags=payload.get("hashtags", ["#AI"]),
            channel=payload.get("channel", "Instagram")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ensemble/predict")
def predict_ensemble(payload: Dict[str, Any] = Body(...)):
    try:
        return ensemble_aggregator.evaluate_all(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/simulate/monte-carlo")
def simulate_monte_carlo(payload: Dict[str, Any] = Body(...)):
    try:
        base_roas = float(payload.get("base_roas", 3.5))
        spend = float(payload.get("spend", 1800.0))
        volatility = float(payload.get("volatility", 0.15))
        competitor_intensity = float(payload.get("competitor_intensity", 0.20))
        days = int(payload.get("days", 14))
        num_sims = int(payload.get("num_simulations", 500))
        return monte_carlo_engine.run_simulation(
            base_roas=base_roas,
            spend=spend,
            volatility=volatility,
            competitor_intensity=competitor_intensity,
            days=days,
            num_sims=num_sims
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/groq/generate-variants")
def generate_variants(payload: Dict[str, Any] = Body(...)):
    try:
        product_or_topic = payload.get("topic", "Autonomous AI Marketing")
        audience = payload.get("audience", "Gen Z Tech Trendsetters")
        channel = payload.get("channel", "Instagram")
        return {
            "variants": groq_service.generate_creative_variants(product_or_topic, audience, channel)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/groq/chat-persona")
def chat_persona(payload: Dict[str, Any] = Body(...)):
    try:
        persona = payload.get("persona", "Gen Z Early Adopter Persona")
        stance = payload.get("stance", "FOR (Constructive Champion)")
        campaign_context = payload.get("campaignContext", {})
        messages = payload.get("messages", [])
        response_text = groq_service.chat_with_persona(persona, stance, campaign_context, messages)
        return {
            "persona": persona,
            "stance": stance,
            "reply": response_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
