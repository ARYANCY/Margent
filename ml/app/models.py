"""
Pydantic Schemas for ML FastAPI endpoints
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CampaignPredictionRequest(BaseModel):
    spend: float = Field(..., description="Campaign spend in USD")
    impressions: float = Field(..., description="Total impressions")
    clicks: float = Field(..., description="Total clicks")
    ctr: float = Field(..., description="Click-through rate (0-1)")
    cpc: float = Field(..., description="Cost per click in USD")
    trend_alignment: float = Field(..., description="Alignment score with trending topics (0-100)")
    channel: Optional[str] = Field("Instagram", description="Marketing channel")
    audience: Optional[str] = Field("General", description="Target audience")

class CampaignPredictionResponse(BaseModel):
    predicted_roas: float
    predicted_conversion_rate: float
    confidence: float
    expected_revenue: float
    recommendation: str

class CustomerSegmentRequest(BaseModel):
    engagement: float = Field(..., ge=0.0, le=1.0)
    purchase_frequency: float = Field(..., ge=0.0, le=1.0)
    price_sensitivity: float = Field(..., ge=0.0, le=1.0)
    trend_sensitivity: float = Field(..., ge=0.0, le=1.0)
    conversion_rate: float = Field(..., ge=0.0, le=1.0)

class CustomerSegmentResponse(BaseModel):
    segment_id: int
    segment_label: str
    cluster_affinity: float
    traits: List[str]

class AnomalyDetectionRequest(BaseModel):
    spend: float
    ctr: float
    cpc: float
    conversion_rate: float
    roas: float

class AnomalyDetectionResponse(BaseModel):
    is_anomaly: bool
    anomaly_score: float
    severity: str
    anomaly_reasons: List[str]

class TrendScoreRequest(BaseModel):
    growth: float = Field(..., ge=0, le=100)
    interest: float = Field(..., ge=0, le=100)
    velocity: float = Field(..., ge=0, le=100)
    recency: float = Field(..., ge=0, le=100)
    relevance: float = Field(..., ge=0, le=100)
    weights: Optional[Dict[str, float]] = None

class TrendScoreResponse(BaseModel):
    score: float
    tier: str
    status: str
    breakdown: Dict[str, float]
