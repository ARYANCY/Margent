# AI Marketing Intelligence Datasets & Node Training Guide

Drop your downloaded datasets directly into this `datasets/` folder and run `train_nodes.py` to train all 101 nodes across all 4 pipelines (**30 Trained ML**, **30 PyTrends**, **30 Groq LLM**, **10 PennyLane QML**, and **1 Admin Master Synthesizer**).

---

## 1. Where to Place Your Downloaded Datasets

Simply save or download your dataset files directly into this directory (`datasets/`):

```
datasets/
├── campaigns.csv            # (Required for 30 ML Models) Campaign metrics
├── trends.json              # (Optional) Real trend seeds or keywords
├── customer_segments.csv    # (Optional) Consumer behavioral vectors
├── train_nodes.py           # Master training script for all 101 nodes
└── README.md                # This guide
```

---

## 2. Expected Dataset Formats

### A. `campaigns.csv` (Marketing Campaign Data)
Drop any CSV containing marketing campaign metrics. The trainer automatically recognizes and computes missing features:
```csv
campaign_id,channel,audience,spend,impressions,clicks,conversions,revenue,trend_alignment
camp_001,TikTok,Gen Z Trendsetters,1500,48000,2400,280,5600,92
camp_002,Instagram,Tech Enthusiasts,2200,65000,3100,340,7920,88
camp_003,LinkedIn,Decision Makers,3500,82000,2800,290,9800,84
```
*Note: If `ctr`, `cpc`, `roas`, or `conversion_rate` columns are not present, the script automatically derives them from `spend`, `clicks`, `impressions`, `conversions`, and `revenue`.*

### B. `trends.json` (Trend Signals)
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

### C. `customer_segments.csv` (Behavioral Profiles)
```csv
engagement,purchase_frequency,price_sensitivity,trend_sensitivity,conversion_rate
0.82,0.65,0.40,0.90,0.12
0.45,0.30,0.85,0.50,0.04
```

---

## 3. Train All 101 Nodes in One Command

Whenever you drop a new dataset into `datasets/`, run:

```powershell
conda run -n margent-ml python datasets/train_nodes.py
```

### What this command does:
1. **Trains 30 Classical ML Model Nodes**: Fits RandomForest Regressors for ROAS/Conversion Rate, KMeans for customer segmentation, and IsolationForest for anomaly detection.
2. **Trains 10 PennyLane QML Quantum Nodes**: Optimizes a 4-Qubit Variational Quantum Circuit (VQC) with angle embedding and circular CNOT entanglement rings to detect non-linear Hilbert space correlations.
3. **Synchronizes 30 PyTrends Google Search Nodes**: Pulls real Google Search velocity and 90-day search interest curves.
4. **Initializes 30 Groq / LLM Reasoning Nodes & 1 Admin Node**: Validates qualitative reasoning and Bayesian multi-modal consensus.
5. **Saves All Trained Models**: Outputs artifacts into `ml/models/` (`campaign_model.joblib`, `segmentation_model.joblib`, `anomaly_model.joblib`, `qml_model.joblib`).

---

## 4. Verification & Testing

Verify that all 101 nodes and the API are functioning with the newly trained models:

```powershell
npx tsx scripts/test-campaign-flow.ts
```
