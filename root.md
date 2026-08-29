# Margent: 101-Node Quantum-Classical Multi-Modal Intelligence Engine

**Margent** is an autonomous marketing intelligence simulator that combines:
1. **30 Classical Machine Learning Models** (RandomForest ROAS & Conversion Regressors + KMeans Customer Segmentation + IsolationForest Anomaly Detectors).
2. **30 PyTrends Google Search Signals** (Real-Time Search Interest Curves, Breakout Queries, Velocity Momentum).
3. **30 Groq LLM Qualitative Nodes** (LLaMA 3.3 70B & xAI Grok Structured Reasoning, Persona Friction Analysis).
4. **10 PennyLane QML Quantum Nodes** (4-Qubit Variational Quantum Circuits in Hilbert Space with non-linear feature entanglement).
5. **1 Admin Master Orchestrator Node** (Bayesian Consensus Fusion Engine).

---

## 1. Mathematical Consensus Formulation

The executive consensus Return on Ad Spend (ROAS) is computed via Bayesian multi-modal fusion:

$$\text{ROAS}_{\text{consensus}} = 0.30 \cdot \text{ROAS}_{\text{ML}} + 0.30 \cdot \text{ROAS}_{\text{PyTrends}} + 0.30 \cdot \text{ROAS}_{\text{Groq}} + 0.10 \cdot \text{ROAS}_{\text{QML}}$$

### Decision Boundary Logic:
- **`SCALE`** (High Priority): Consensus $\text{ROAS} \ge 3.20$ and Ensemble Confidence $\ge 0.75$.
- **`MAINTAIN`** (Medium Priority): Consensus $2.20 \le \text{ROAS} < 3.20$.
- **`INVESTIGATE`** (Alert): Anomaly detected by IsolationForest or conflicting multi-modal signals.
- **`STOP`** (Critical): Consensus $\text{ROAS} < 2.20$ or Negative Sentiment Drift.

---

## 2. Monorepo Structure

```
Margent/
├── apps/
│   ├── api/                    # Express + Socket.IO Backend Server (Port 4000)
│   └── web/                    # Vite + React 18 + React Flow + GSAP Visualizer (Port 5173)
├── ml/                         # Python FastAPI ML & Quantum Microservice (Port 8000)
│   ├── app/                    # Multi-modal inference microservices
│   ├── models/                 # Serialized model artifacts (.joblib)
│   └── training/               # Standalone training pipelines
├── packages/
│   ├── shared/                 # Shared TypeScript types, schemas, and metrics
│   ├── agents/                 # 101 Agent Registry & profile generators
│   └── graph/                  # LangGraph multi-modal simulation state machine
├── datasets/                   # User-dropped CSVs & 1-Click training script
├── documentation/              # Architecture and API documentation
├── scripts/                    # Automated testing and verification suites
├── todo.md                     # Operator action checklist & step-by-step instructions
├── issue.md                    # Code quality & architectural audit
├── uiissue.md                  # UI/UX design tokens & layout specification
└── README.md                   # Project overview & quickstart guide
```

---

## 3. Quickstart Commands

```powershell
# 1. Train all 101 Nodes
conda run -n margent-ml python datasets/train_nodes.py

# 2. Run End-to-End Test Suite
npx tsx scripts/test-campaign-flow.ts

# 3. Launch Services
# Terminal 1:
conda run -n margent-ml uvicorn ml.app.main:app --port 8000

# Terminal 2:
npx tsx apps/api/src/server.ts

# Terminal 3:
npm --prefix apps/web run dev
```

Open **[http://127.0.0.1:5173](http://127.0.0.1:5173)** in your browser.
