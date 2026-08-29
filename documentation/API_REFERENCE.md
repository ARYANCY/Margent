# API Reference Specification

> Complete technical contract for Margent's Python FastAPI ML Microservice (Port 8000), Express & Socket.IO API Gateway (Port 4000), and Real-Time Event Streams.

---

## 1. Python ML & Quantum Microservice (Port 8000)

### `POST /ensemble/predict`
Executes Bayesian multi-modal fusion across all 4 intelligence pipelines ($0.30 \text{ ML} + 0.30 \text{ PyTrends} + 0.30 \text{ Groq} + 0.10 \text{ Rule}$).

#### Request Body:
```json
{
  "spend": 1800,
  "impressions": 65000,
  "clicks": 3200,
  "ctr": 0.049,
  "cpc": 0.56,
  "trend": "Autonomous AI",
  "channel": "Instagram",
  "audience": "Gen Z Tech Trendsetters (18-24)",
  "caption": "Next-Gen Multi-Agent Autonomous Marketing Intelligence.",
  "hashtags": ["#AgenticAI", "#QML"]
}
```

#### Response:
```json
{
  "ensemble_summary": {
    "decision": "SCALE",
    "priority": "HIGH",
    "consensus_roas": 3.85,
    "ensemble_confidence": 0.912,
    "summary": "All 4 pipelines converged on a profitable SCALE recommendation with 3.85x consensus ROAS.",
    "evidence": [
      "Trained ML Models: Predicted ROAS 3.82x with healthy unit economics.",
      "PyTrends Google Signals: Search velocity reached 92.4/100 for 'Autonomous AI'.",
      "Groq LLaMA 3.3: Creative hook scored at 88/100 with positive sentiment (+0.65).",
      "PennyLane QML Circuits: Measured 4-qubit Hilbert entanglement with 89.4% resonance."
    ],
    "recommended_actions": [
      "Scale budget by 35% on Instagram targeting verified demographic clusters.",
      "Maintain 80% exploitation and 20% exploration allocation on emerging trend angles."
    ],
    "guardrail_notes": ["All campaign unit economics pass compliance guardrails."],
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
    "trained_ml": {
      "agents": "ChannelAnalyzer #1–10, ModelEnsemble #11–20, RootCause #21–30",
      "predicted_roas": 3.82,
      "predicted_conversion_rate": 0.088,
      "confidence": 0.92,
      "status": "GradientBoosting + RandomForest Active"
    },
    "pytrends_search": {
      "agents": "TrendAgent #1–30",
      "current_interest": 86.0,
      "growth_rate_pct": 92.4,
      "velocity_score": 88.5,
      "status": "RISING",
      "historical_curve": [55, 62, 70, 78, 84, 91, 95]
    },
    "groq_llm": {
      "agents": "RecommenderAgent #1–30",
      "creative_score": 88.0,
      "hook_strength": 90.0,
      "sentiment_score": 0.65,
      "target_appeal": "Tech Creators & Trendsetters",
      "critique": "High cultural resonance with modern tech creators. Copy tone aligns well with current AI discourse.",
      "grok_estimated_roas": 3.96
    },
    "qml_quantum": {
      "agents": "QuantumVQC #1–10",
      "quantum_predicted_roas": 3.85,
      "quantum_confidence": 0.90,
      "quantum_resonance_score": 89.4,
      "expectation_value": -0.3294,
      "entanglement_interactions": [
        { "pair": "Spend-CTR", "entanglement": 0.88 },
        { "pair": "Velocity-Affinity", "entanglement": 0.92 }
      ]
    },
    "rule_guardrail": {
      "weight": 0.10,
      "rule_score_roas": 3.20,
      "notes": ["All campaign unit economics pass compliance guardrails."]
    }
  }
}
```

---

## 2. Express & Socket.IO Gateway (Port 4000)

### REST Endpoints:

| Endpoint | Method | Params / Body | Description |
| :--- | :--- | :--- | :--- |
| `/api/agents` | `GET` | — | Returns list of all 101 registered agents with specializations and live statuses. |
| `/api/campaigns` | `GET` | `?channel=...&search=...&limit=...` | Returns filtered history of canonical campaigns. |
| `/api/campaigns/:id` | `GET` | `id` | Returns single campaign metrics by ID. |
| `/api/campaigns/create` | `POST` | `FormData` (`campaignName`, `channel`, `goal`, `audience`, `spend`, `trendAlignment`, `photo`) | Validates and dispatches new campaign, triggering immediate 101-agent simulation tick. |
| `/api/simulation/start` | `POST` | — | Starts continuous real-time simulation clock. |
| `/api/simulation/pause` | `POST` | — | Pauses simulation clock. |
| `/api/simulation/step` | `POST` | — | Advances simulation clock by exactly 1 tick. |
| `/api/simulation/speed` | `POST` | `{ "speed": 2.0 }` | Sets simulation multiplier speed (`0.5x`, `1.0x`, `2.0x`, `5.0x`). |

---

### WebSocket Real-Time Events (`Socket.IO`):

- **`connect` / `disconnect`**: Gateway lifecycle status.
- **`simulation:state`**: Broadcasts global simulation snapshot every tick:
  ```json
  {
    "tick": 14,
    "status": "RUNNING",
    "speed": 1.0,
    "activeAgentIds": ["ml_002", "pytrend_015", "groq_008", "qml_003", "admin_001"],
    "topTrends": [...],
    "activeCampaign": {...},
    "adminAnalysis": {...}
  }
  ```
- **`agent:event`**: Emits granular agent events (`CLASSICAL ML INFERENCE`, `PYTRENDS GOOGLE`, `GROQ COGNITIVE`, `PENNYLANE QML`, `ADMIN CONSENSUS`).
- **`admin:analysis`**: Broadcasts master consensus decision, automatically opening the sliding dashboard.
