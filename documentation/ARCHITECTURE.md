# System Architecture & Technical Specifications

**Margent** is an autonomous AI marketing intelligence platform powered by a **101-Node Quantum-Classical Multi-Modal Ensemble**. It bridges quantum variational circuits in Hilbert space, supervised statistical ML models, real-time Google search trends, and qualitative LLM reasoning.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    User([Marketing Operator / User]) -->|Dispatches Ad Creative / Campaign| Web[Vite + React Web App :5173]
    Web -->|HTTP POST / WebSocket Stream| API[Express + Socket.IO Server :4000]
    API -->|Orchestrates 101 Agents| Graph[LangGraph Multi-Modal State Machine]
    
    Graph -->|Super-Step 1| BranchML[30 Classical ML Agents]
    Graph -->|Super-Step 2| BranchTrends[30 PyTrends Google Agents]
    Graph -->|Super-Step 3| BranchGroq[30 Groq LLM Reasoning Agents]
    Graph -->|Super-Step 4| BranchQML[10 PennyLane QML Quantum Agents]
    
    BranchML -->|Inference Call| PyML[FastAPI Microservice :8000]
    BranchTrends -->|Search Velocity| PyML
    BranchGroq -->|Linguistic Analysis| PyML
    BranchQML -->|Hilbert VQC State| PyML
    
    PyML -->|Bayesian Fusion| Admin[Admin Master Node #001]
    Admin -->|Executive Recommendation| API
    API -->|Real-Time Edge Telemetry| Web
    Web -->|GSAP Slide-In| Dashboard[Sliding Analytics Dashboard]
```

---

## 2. 101-Agent Multi-Modal Distribution Matrix

| Pipeline Segment | Agent Count | Engine / Library | Purpose & Metrics |
| :--- | :---: | :--- | :--- |
| **Classical ML** | **30** | Scikit-Learn RandomForest + KMeans | ROAS regression, conversion rate, CPC anomaly detection. |
| **PyTrends Signals** | **30** | Google Trends API + Velocity Engine | 90-day search interest curve, breakout keywords, growth momentum. |
| **Groq / Grok LLM** | **30** | Groq LLaMA 3.3 70B & xAI Grok | Copywriting critique, hook resonance, customer perspective sentiment. |
| **PennyLane QML** | **10** | PennyLane 4-Qubit Variational Quantum Circuit | Pauli-Z expectation $\langle \sigma_z \rangle$, multi-feature quantum entanglement matrix. |
| **Admin Master** | **1** | Bayesian Multi-Modal Consensus Aggregator | Weighted multi-objective executive decision (`SCALE`, `MAINTAIN`, `STOP`). |

---

## 3. Directory Layout

```
margent/
├── apps/
│   ├── api/                    # Express + Socket.IO Server (Port 4000)
│   └── web/                    # React 18 + React Flow + GSAP Visualizer (Port 5173)
├── ml/                         # Python ML & Quantum Microservice (Port 8000)
│   ├── app/                    # FastAPI endpoints & inference services
│   ├── models/                 # Serialized .joblib artifacts
│   └── training/               # Standalone training modules
├── packages/
│   ├── shared/                 # TypeScript types, constants, metrics
│   ├── agents/                 # 101 Agent Registry & Persona generators
│   └── graph/                  # LangGraph state machine & super-step orchestration
├── datasets/                   # User-dropped CSVs & 1-Click training script
├── documentation/              # Architecture & API specifications
└── scripts/                    # End-to-end testing & validation suites
```
