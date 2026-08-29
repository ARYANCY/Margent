# API Reference Specification

## 1. Python ML & Quantum Microservice (Port 8000)

### `POST /ensemble/predict`
Executes Bayesian multi-modal fusion across all 4 intelligence pipelines.

**Request Body:**
```json
{
  "spend": 2000,
  "impressions": 75000,
  "clicks": 3600,
  "ctr": 0.048,
  "cpc": 0.55,
  "trend": "Autonomous Multi-Agent Systems",
  "channel": "TikTok",
  "caption": "Deploying autonomous agentic marketing intelligence."
}
```

**Response:**
```json
{
  "ensemble_summary": {
    "decision": "SCALE",
    "priority": "HIGH",
    "consensus_roas": 3.85,
    "ensemble_confidence": 0.894,
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
    "ml_models": { "predicted_roas": 4.65, "predicted_conversion_rate": 0.11 },
    "pytrends_google": { "velocity_score": 92.1, "growth_rate_pct": 94.5 },
    "groq_llm": { "creative_score": 88.0, "sentiment_score": 0.55 },
    "qml_quantum": { "quantum_resonance_score": 89.4, "expectation_value": -0.824 }
  }
}
```

---

## 2. Express & Socket.IO Server (Port 4000)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/agents` | `GET` | Returns list of all 101 registered agents with traits and statuses. |
| `/api/campaigns` | `GET` | Returns history of simulated canonical campaigns. |
| `/api/campaigns/create` | `POST` | Dispatches new campaign with ad creative photo, triggering 101-agent simulation. |
| `/api/simulation/start` | `POST` | Starts continuous real-time simulation ticks. |
| `/api/simulation/pause` | `POST` | Pauses simulation clock. |
| `/api/simulation/step` | `POST` | Advances simulation by a single tick. |
| `/api/simulation/speed` | `POST` | Sets multiplier speed (`0.5x`, `1x`, `2x`, `5x`). |

### WebSocket Events (`Socket.IO`):
- `connect` / `disconnect`: Gateway connectivity.
- `simulation:state`: Broadcasts updated tick, active nodes, edge pulses, and top trends.
- `agent:event`: Emits granular agent events (comments, critiques, QML entanglements, anomaly alerts).
- `admin:analysis`: Emits master executive consensus decisions to automatically trigger sliding dashboard.
