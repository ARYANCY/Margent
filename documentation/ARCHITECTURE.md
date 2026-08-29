# System Architecture & Technical Specifications

> **Margent** is an autonomous marketing intelligence and campaign optimization platform powered by a **101-Node Quantum-Classical Multi-Modal Ensemble**. It bridges quantum variational circuits in Hilbert space, supervised statistical ML models, real-time Google search trends, and qualitative LLM reasoning.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    User([Marketing Operator]) -->|Dispatches Ad Creative / Campaign| Web[Vite + React Web App :5173]
    Web -->|HTTP POST / WebSocket Stream| API[Express + Socket.IO Server :4000]
    API -->|Orchestrates 101 Agents| Graph[Multi-Modal Graph Engine]
    
    Graph -->|Super-Step 1| BranchML[30 Classical ML Agents]
    Graph -->|Super-Step 2| BranchTrends[30 PyTrends Google Agents]
    Graph -->|Super-Step 3| BranchGroq[30 Groq LLM Reasoning Agents]
    Graph -->|Super-Step 4| BranchQML[10 PennyLane QML Quantum Agents]
    
    BranchML -->|Inference Call| PyML[FastAPI Microservice :8000]
    BranchTrends -->|Search Velocity| PyML
    BranchGroq -->|Linguistic Analysis| PyML
    BranchQML -->|Hilbert VQC State| PyML
    
    PyML -->|Bayesian Fusion + Guardrails| Admin[Admin Master Node #admin_001]
    Admin -->|Executive Recommendation| API
    API -->|Real-Time Edge Telemetry| Web
    Web -->|GSAP Slide-In| Dashboard[Sliding Analytics Dashboard]
```

---

## 2. 101-Agent Multi-Modal Distribution Matrix (`guide.md` Section 3)

| Pipeline Segment | Agent Count | Specific Agent Roles | Engine / Library | Purpose & Metrics |
| :--- | :---: | :--- | :--- | :--- |
| **Classical ML** | **30** | `ChannelAnalyzer` (1–10)<br/>`ModelEnsembleAgent` (11–20)<br/>`RootCauseAgent` (21–30) | `GradientBoostingClassifier`<br/>`RandomForestRegressor`<br/>`KMeans`<br/>`IsolationForest` | Evaluates channel performance, clusters consumer profiles into 5 personas, and detects CPA/CTR anomaly drifts. |
| **PyTrends Signals** | **30** | `TrendAgent` (1–30) | Google Trends API + Velocity Engine | Computes 90-day search interest curves, breakout query indicators, and growth velocity. |
| **Groq / Grok LLM** | **30** | `RecommenderAgent` (1–30) | Groq `LLaMA 3.3 70B Versatile` | Copywriting critique, hook resonance, and customer perspective sentiment. |
| **PennyLane QML** | **10** | `QuantumVQC` (1–10) | PennyLane 4-Qubit Variational Quantum Circuit | Pauli-Z expectation $\langle \sigma_z(0) \rangle$, multi-feature quantum entanglement matrix. |
| **Admin Master** | **1** | `AdminOrchestrator` (`admin_001`) | Bayesian Multi-Modal Consensus Aggregator | Weighted multi-objective executive decision (`SCALE`, `MAINTAIN`, `INVESTIGATE`, `STOP`). |

---

## 3. Mathematical Consensus Formulation (`guide.md` Section 7)

$$\text{final\_score} = 0.30 \cdot \text{grok\_score} + 0.30 \cdot \text{qml\_score} + 0.30 \cdot \text{simple\_score} + 0.10 \cdot \text{rule\_score}$$

### Pipeline Component Formulations:
1. **Classical Simple Score ($\text{simple\_score}$)**:
   $$\text{ROAS}_{\text{ML}} = \text{Regressor}(\mathbf{X})$$
2. **PyTrends Search Velocity ($\text{velocity\_score}$)**:
   $$\text{ROAS}_{\text{PyTrends}} = 1.80 + \left(\frac{\text{Velocity}}{100}\right) \cdot 2.20$$
3. **Groq Persuasion Score ($\text{grok\_score}$)**:
   $$\text{ROAS}_{\text{Groq}} = 1.50 + \left(\frac{\text{Creative Score}}{100}\right) \cdot 2.80$$
4. **PennyLane Quantum Resonance ($\text{qml\_score}$)**:
   $$\langle \sigma_z(0) \rangle = \langle \psi(\theta, \mathbf{x}) | \sigma_z | \psi(\theta, \mathbf{x}) \rangle$$
5. **Rule Guardrail ($\text{rule\_score}$)**:
   $$\text{Penalty} = \begin{cases} 0.65 & \text{if } \text{CPA} > \$18.00 \\ 0.70 & \text{if } \text{Impressions} < 500 \\ 1.00 & \text{otherwise} \end{cases}$$

---

## 4. Multi-Dataset Ingestion Architecture

Ingests and harmonizes 5 Kaggle multi-channel datasets in `datasets/`:
1. `datasets/Social Media Advertising Dataset-kaggle/` (300,000 campaigns across Instagram, Facebook, Pinterest, Twitter).
2. `datasets/Advertising Campaign Dataset/` (Croissant metadata + user engagement metrics).
3. `datasets/Marketing Campaign dataset/` (Multi-channel ad delivery).
4. `datasets/Social Media Ad Dataset-kaggle/` (Ad optimization metrics).
5. `datasets/Social Media Advertisement Performance-kaggle/` (Relational campaigns & ads).
