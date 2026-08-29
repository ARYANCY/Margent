#### **COMPLETE BUILD & TRAINING GUIDE** 

# **Multi-Agent Marketing Performance Analyzer** 

USP · MVP · Architecture · Datasets · 7-Day Plan · Ensemble Model Training (Grok + QML + Classical) · Pytrends Hybrid Signal · Starter Code 

An AI agent system that pulls real Instagram/Facebook performance data, analyzes what's working and what isn't across channels, explains likely reasons behind results, and recommends where the marketing team should focus next — synthesized by an orchestrator agent into one report. 

> [!CAUTION]
> This guide does not include "simulated user" bots that post, follow, or engage on Instagram/Facebook to fake activity. That violates Meta's Platform Terms and can constitute ad fraud. Everything here uses official free-tier APIs and licensed/free datasets on accounts and data you actually own or are permitted to use. 

---

## **Table of Contents** 

- **1** Unique Selling Points (USP) 
- **2** MVP Scope — What Ships in Week 1 
- **3** Architecture Overview 
- **4** Datasets — Free Sources & Direct Links 
- **5** Day-by-Day Build Plan 
- **6** Free / Zero-Cost Tech Stack 
- **7** Ensemble Model Design (Grok 30 / QML 30 / Simple 30 / Rule 10) 
- **8** Pytrends Hybrid Integration 
- **9** Starter Code Appendix 
- **10** Compliance — What Not to Build 
- **11** Post-MVP Roadmap 
- **12** Summary Checklist 

---

## **1 Unique Selling Points (USP)** 

- **Single source of truth across channels** — Instagram, Facebook, TikTok, and Google Ads merged into one normalized view instead of siloed native dashboards. 
- **Explains "why," not just "what"** — a RootCause agent turns numbers into a plain-English hypothesis instead of leaving interpretation to the reader. 
- **Action, not just analysis** — output is ranked next-step recommendations, not another chart. 
- **Fully compliant data sources** — official APIs and licensed/free datasets only, no scraping or fake engagement. 
- **Free to run at small scale** — free-tier APIs, free orchestration frameworks, optional local LLM. 
- **Extensible** — new channels (TikTok, LinkedIn) are new worker agents, not a rebuild. 

---

## **2 MVP Scope — What Ships in Week 1** 

### **In scope** 
- Multi-channel ad ingestion (Instagram, Facebook, TikTok, Google Ads)
- Daily pull of post-level and ad-level metrics: reach, engagement rate, spend, CTR, CPA, ROAS
- Google Trends signal for campaign keywords via PyTrends
- Multi-modal ensemble agents + Orchestrator agent
- Real-time Visualizer UI + Actionable Intelligence Dashboard

### **Success criteria** 
- Pipeline runs end-to-end unattended
- Report correctly identifies top/bottom performers matching empirical distribution
- At least one specific, actionable recommendation per execution

---

## **3 Architecture Overview** 

Data flows: Ingestion → Storage → Worker Agents → Orchestrator → Report.

| **Agent** | **Input** | **Output** |
|---|---|---|
| **ChannelAnalyzer** | Post/ad metrics per channel | Ranked top & bottom performers with metric deltas |
| **TrendAgent** | Google Trends data for campaign keywords | Rising/falling topic interest signal |
| **ModelEnsembleAgent** | Feature table (metrics + trend features) | Weighted outperform/underperform score |
| **RootCauseAgent** | Flagged campaigns + metadata + ensemble breakdown | Plain-English hypotheses for results |
| **RecommenderAgent** | RootCause output | Concrete next-step suggestions |
| **AdminOrchestrator** | All of the above | One unified, prioritized report |

---

## **4 Datasets & Ingestion Sources** 

1. **Advertising Campaign Dataset (`datasets/Advertising Campaign Dataset/`)**:
   - User demographics, CTR, conversion rate, CPC, ROI, engagement level.
2. **Marketing Campaign Dataset (`datasets/Marketing Campaign dataset/`)**:
   - Multi-channel ad performance, approved budget, impressions, clicks, media cost, keywords.
3. **Social Media Ad Optimization Dataset (`datasets/Social Media Ad Dataset-kaggle/`)**:
   - Platform, category, impressions, clicks, conversion, time spent, engagement score.
4. **Social Media Advertisement Performance (`datasets/Social Media Advertisement Performance-kaggle/`)**:
   - Relational campaigns, ads, events, user profiles, SQLite database.
5. **Social Media Advertising Dataset (`datasets/Social Media Advertising Dataset-kaggle/`)**:
   - 300,000 campaigns across Instagram, Facebook, Pinterest, Twitter with ROI, acquisition cost, and conversion rates.

---

## **5 Day-by-Day Build Plan** 

- **Day 1**: Auth & Data Access (Meta Graph API / CSV ingestion).
- **Day 2**: Data pipeline & schema normalization.
- **Day 3**: Agent framework setup (LangGraph / Multi-Modal nodes).
- **Day 4**: Root cause + orchestrator + ensemble modeling.
- **Day 5**: Output, dashboard, & automated alerting.
- **Day 6**: Testing with multi-channel real datasets.
- **Day 7**: Production verification.

---

## **6 Free / Zero-Cost Tech Stack** 

- **Social Data**: Graph API / Kaggle Benchmark Datasets.
- **Trend Data**: Google Trends via `pytrends`.
- **Database**: SQLite / JSON Store.
- **Agent Orchestration**: LangGraph / Multi-Agent State Machine.
- **LLM Reasoning**: Groq LLaMA 3.3 70B & xAI Grok.
- **QML Framework**: PennyLane on local simulator (`default.qubit`).
- **Web Interface**: React 18 + React Flow + GSAP.

---

## **7 Ensemble Model Design (30 Grok / 30 QML / 30 Simple / 10 Rule Guardrail)** 

$$\text{final\_score} = 0.30 \cdot \text{grok\_score} + 0.30 \cdot \text{qml\_score} + 0.30 \cdot \text{simple\_score} + 0.10 \cdot \text{rule\_score}$$

### **7.1 Label & Feature Definition**
- Label definition: Binary outperform flag based on top vs bottom tertile by ROAS / Conversion Rate.
- Time split: 70% Train, 15% Validation, 15% Test.

### **7.2 Simple Classical Model**
```python
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline

preprocessor = ColumnTransformer(
    [("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)],
    remainder="passthrough"
)
model = Pipeline([
    ("prep", preprocessor),
    ("clf", GradientBoostingClassifier(n_estimators=150, max_depth=3, learning_rate=0.05))
])
model.fit(X_train, y_train)
```

### **7.3 QML Model (PennyLane)**
```python
import pennylane as qml
from sklearn.decomposition import PCA

pca = PCA(n_components=4) # 4 qubits
X_reduced = pca.fit_transform(X_scaled)
dev = qml.device("default.qubit", wires=4)

@qml.qnode(dev)
def circuit(weights, x):
    qml.AngleEmbedding(x, wires=range(4))
    qml.BasicEntanglerLayers(weights, wires=range(4))
    return qml.expval(qml.PauliZ(0))

opt = qml.GradientDescentOptimizer(stepsize=0.1)
```

### **7.4 Grok Voter (LLM)**
Reasons over metrics, target audience, ad copy, and search trend momentum.

### **7.5 Rule Guardrail + Combiner**
- Penalizes CPA > 3x average.
- Penalizes low-impression campaigns (< 500 impressions).
- Dampens confidence when learned models diverge significantly.

---

## **8 PyTrends Hybrid Integration**
- **Path A (Quantitative)**: Numeric trend score, 7-day momentum, and z-score fed into Classical + QML models.
- **Path B (Qualitative)**: Trend direction (rising, falling, flat) fed into Groq / Grok LLM prompt.
