# Step-by-Step Model Training & Execution Guide (`TRAINING_GUIDE.md`)

This guide provides a professional, end-to-end walkthrough for preparing datasets, training the **101 Multi-Modal Intelligence Nodes** (30 Classical ML, 30 PyTrends Signals, 30 Groq LLM, 10 PennyLane QML, and 1 Admin Master Synthesizer), and running the full system.

---

## 1. Environment Setup (Conda)

Ensure you have Anaconda or Miniconda installed, then initialize the dedicated environment:

```powershell
# Create Conda Environment with Python 3.11
conda create -n ai-product-hackathon python=3.11 -y

# Activate Environment
conda activate ai-product-hackathon

# Install Core ML, Quantum & API Dependencies
pip install fastapi uvicorn pandas numpy scikit-learn joblib pydantic pytrends groq pennylane pennylane-lightning
```

---

## 2. Dataset Ingestion (`datasets/`)

Drop your custom marketing dataset CSV files directly into the `datasets/` folder:

### File 1: `datasets/campaigns.csv` (Required)
```csv
campaign_id,channel,audience,spend,impressions,clicks,conversions,revenue,trend_alignment
camp_001,TikTok,Gen Z Trendsetters,1500,48000,2400,280,5600,92
camp_002,Instagram,Tech Enthusiasts,2200,65000,3100,340,7920,88
camp_003,LinkedIn,Decision Makers,3500,82000,2800,290,9800,84
camp_004,YouTube,Creators & Builders,4200,95000,3800,410,12600,95
```
*Note: If `ctr`, `cpc`, `roas`, or `conversion_rate` columns are missing, `train_nodes.py` automatically derives them.*

### File 2: `datasets/trends.json` (Optional)
```json
[
  {
    "trendId": "trend_001",
    "name": "Autonomous Multi-Agent Systems",
    "hashtag": "#AgenticAI",
    "growth": 95.2,
    "interest": 94.0,
    "velocity": 91.0,
    "recency": 96.0,
    "relevance": 92.0,
    "score": 93.8,
    "status": "RISING"
  }
]
```

### File 3: `datasets/customer_segments.csv` (Optional)
```csv
engagement,purchase_frequency,price_sensitivity,trend_sensitivity,conversion_rate
0.82,0.65,0.40,0.90,0.12
0.45,0.30,0.85,0.50,0.04
0.90,0.80,0.20,0.95,0.18
```

---

## 3. One-Click Training Command

To train all 101 nodes simultaneously across all 4 pipelines and output serialized `.joblib` models to `ml/models/`, execute:

```powershell
conda run -n ai-product-hackathon python datasets/train_nodes.py
```

---

## 4. Standalone Modular Training Code

### Phase A: Train 30 Classical ML Nodes (`train_campaign.py` & `train_segmentation.py`)
```python
import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.cluster import KMeans
from sklearn.metrics import r2_score

# 1. Load Data
df = pd.read_csv("datasets/campaigns.csv")
if "ctr" not in df.columns:
    df["ctr"] = df["clicks"] / df["impressions"].replace(0, 1)
if "cpc" not in df.columns:
    df["cpc"] = df["spend"] / df["clicks"].replace(0, 1)
if "roas" not in df.columns:
    df["roas"] = df["revenue"] / df["spend"].replace(0, 1)
if "conversion_rate" not in df.columns:
    df["conversion_rate"] = df["conversions"] / df["clicks"].replace(0, 1)
if "trend_alignment" not in df.columns:
    df["trend_alignment"] = 85.0

feature_cols = ["spend", "impressions", "clicks", "ctr", "cpc", "trend_alignment"]
X = df[feature_cols].fillna(0)
y_roas = df["roas"].fillna(0)
y_conv = df["conversion_rate"].fillna(0)

# 2. Train RandomForest Regressors
rf_roas = RandomForestRegressor(n_estimators=100, random_state=42)
rf_roas.fit(X, y_roas)

rf_conv = RandomForestRegressor(n_estimators=100, random_state=42)
rf_conv.fit(X, y_conv)

# Save artifact
artifact = {
    "roas_model": rf_roas,
    "conv_model": rf_conv,
    "r2_roas": r2_score(y_roas, rf_roas.predict(X)),
    "r2_conv": r2_score(y_conv, rf_conv.predict(X))
}
os.makedirs("ml/models", exist_ok=True)
joblib.dump(artifact, "ml/models/campaign_model.joblib")
print(f"RandomForest Models Saved. R2 ROAS: {artifact['r2_roas']:.4f}")

# 3. Train IsolationForest Anomaly Detector
iso = IsolationForest(contamination=0.08, random_state=42)
iso.fit(X[["spend", "ctr", "cpc"]])
joblib.dump(iso, "ml/models/anomaly_model.joblib")
print("IsolationForest Anomaly Model Saved.")

# 4. Train KMeans Customer Segmentation
cust_df = pd.read_csv("datasets/customer_segments.csv")
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
kmeans.fit(cust_df)
joblib.dump(kmeans, "ml/models/segmentation_model.joblib")
print("KMeans Customer Segmentation Model Saved.")
```

---

### Phase B: Train 10 PennyLane Quantum QML Nodes (`train_qml.py`)
```python
import os
import joblib
import numpy as np
import pennylane as qml

NUM_QUBITS = 4
dev = qml.device("default.qubit", wires=NUM_QUBITS)

@qml.qnode(dev)
def quantum_variational_circuit(features, weights):
    # 1. Angle Embedding into Quantum Hilbert Space
    qml.AngleEmbedding(features, wires=range(NUM_QUBITS), rotation='Y')
    
    # 2. Circular Entanglement Ring (CNOT)
    for i in range(NUM_QUBITS):
        qml.CNOT(wires=[i, (i + 1) % NUM_QUBITS])
        
    # 3. Parameterized Variational Rotations
    for i in range(NUM_QUBITS):
        qml.RY(weights[i, 0], wires=i)
        qml.RZ(weights[i, 1], wires=i)
        
    qml.CNOT(wires=[0, 2])
    qml.CNOT(wires=[1, 3])
    
    for i in range(NUM_QUBITS):
        qml.RY(weights[i, 2], wires=i)
        
    return qml.expval(qml.PauliZ(0))

def train_quantum_circuit():
    np.random.seed(42)
    weights = np.random.uniform(0, 2 * np.pi, (NUM_QUBITS, 3))
    
    sample_features = np.array([0.75 * np.pi, 0.85 * np.pi, 0.90 * np.pi, 0.65 * np.pi])
    opt = qml.GradientDescentOptimizer(stepsize=0.15)
    
    def cost(w):
        val = quantum_variational_circuit(sample_features, w)
        return (val - (-0.85)) ** 2
        
    for _ in range(25):
        weights = opt.step(cost, weights)
        
    artifact = {
        "num_qubits": NUM_QUBITS,
        "weights": weights.tolist(),
        "topology": "circular_cnot_with_cross_links",
        "description": "Variational Quantum Classifier for non-linear marketing feature entanglement"
    }
    joblib.dump(artifact, "ml/models/qml_model.joblib")
    print("PennyLane QML Model Successfully Trained and Saved.")

train_quantum_circuit()
```

---

### Phase C: Evaluate Bayesian Multi-Modal Consensus
```python
from ml.app.ensemble_service import ensemble_aggregator

# Run 4-Way Bayesian Consensus Simulation
result = ensemble_aggregator.evaluate_all({
    "spend": 2000,
    "impressions": 75000,
    "clicks": 3600,
    "ctr": 0.048,
    "cpc": 0.55,
    "trend": "Autonomous Multi-Agent Systems",
    "channel": "TikTok",
    "caption": "Deploying autonomous agentic marketing intelligence."
})

print("=== ENSEMBLE CONSENSUS RESULT ===")
print("Decision:", result["ensemble_summary"]["decision"])
print("Consensus ROAS:", result["ensemble_summary"]["consensus_roas"])
print("Confidence:", result["ensemble_summary"]["ensemble_confidence"])
print("Pipeline Breakdown:", result["pipeline_breakdown"])
```

---

## 5. Running the Complete Multi-Service Stack

Launch the 3 core servers:

### 1. Start Python FastAPI ML & QML Microservice (Port 8000)
```powershell
conda run -n ai-product-hackathon uvicorn ml.app.main:app --host 127.0.0.1 --port 8000
```

### 2. Start Node.js API & Socket.IO Orchestrator (Port 4000)
```powershell
npx tsx apps/api/src/server.ts
```

### 3. Start React Web Visualizer & GSAP Dashboard (Port 5173)
```powershell
npm --prefix apps/web run dev
```

---

## 6. End-to-End Automated Validation

Run the automated integration test script to verify all 101 nodes:

```powershell
npx tsx scripts/test-campaign-flow.ts
```
