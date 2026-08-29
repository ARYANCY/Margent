# Standalone Model Training & Dataset Engineering Manual

> **Purpose**: Step-by-step instructions for individually and accurately training each of Margent's 4 core machine learning and quantum models based on [`guide.md`](guide.md). Each model trains independently using dedicated scripts in `ml/training/`.

---

## Table of Contents
1. [Multi-Source Datasets Overview](#1-multi-source-datasets-overview)
2. [Model 1: Classical Campaign Predictor (`train_campaign.py`)](#model-1-classical-campaign-predictor)
3. [Model 2: PennyLane 4-Qubit Quantum VQC (`train_qml.py`)](#model-2-pennylane-4-qubit-quantum-vqc)
4. [Model 3: 5-Cluster KMeans Segmentation (`train_segmentation.py`)](#model-3-5-cluster-kmeans-segmentation)
5. [Model 4: IsolationForest Anomaly Detector (`train_anomaly.py`)](#model-4-isolationforest-anomaly-detector)
6. [Sequential Batch Execution (`train_all.py`)](#sequential-batch-execution)
7. [Verification & Simulation Integration](#7-verification--simulation-integration)

---

## 1. Multi-Source Datasets Overview

The models ingest 5 multi-channel advertising benchmark datasets located in [`datasets/`](datasets/):

| Dataset Name | Path | Size / Rows | Features Extracted |
| :--- | :--- | :---: | :--- |
| **Social Media Advertising Dataset** | `datasets/Social Media Advertising Dataset-kaggle/` | 300,000 | `Acquisition_Cost`, `ROI`, `Conversion_Rate`, `Channel_Used`, `Target_Audience`, `Engagement_Score` |
| **Advertising Campaign Dataset** | `datasets/Advertising Campaign Dataset/` | 1,000 | `Daily_Spend`, `CTR`, `CPC`, `Conversion_Rate`, `Target_Demographic`, `ROI` |
| **Marketing Campaign Dataset** | `datasets/Marketing Campaign dataset/` | 11,000 | `Approved_Budget`, `Impressions`, `Clicks`, `Media_Cost`, `Keywords`, `Channel` |
| **Social Media Ad Optimization** | `datasets/Social Media Ad Dataset-kaggle/` | 5,000 | `Impressions`, `Clicks`, `Conversions`, `Engagement_Score`, `Platform` |
| **Advertisement Performance** | `datasets/Social Media Advertisement Performance-kaggle/` | Relational SQLite | `campaigns.csv`, `ads.csv`, `ad_events.csv`, `users.csv` |

---

## 2. Model 1: Classical Campaign Predictor

- **Training Script**: [`ml/training/train_campaign.py`](file:///c:/Users/aryan/OneDrive/Desktop/Margent/ml/training/train_campaign.py)
- **Output Artifact**: `ml/models/campaign_model.joblib`
- **Specification**: [`guide.md`](guide.md) Section 7.2

### Architecture:
- **`GradientBoostingClassifier`**: Predicts binary top-tertile outperform target ($N=150$, $\text{max\_depth}=3$, $\text{lr}=0.05$).
- **`RandomForestRegressor`**: Predicts continuous Return on Ad Spend (ROAS) ($N=120$, $\text{max\_depth}=8$).
- **Feature Pipeline**: `OneHotEncoder` for `channel` and `audience` + `StandardScaler` for numeric variables.
- **Split**: 70% Train, 15% Validation, 15% Test.

### Standalone Command:
```powershell
conda run -n margent-ml python ml/training/train_campaign.py
```

### Expected Output:
```
[1/4] Ingesting multi-channel advertising datasets...
[2/4] Training Split: Train=28,700 (70%), Val=6,150 (15%), Test=6,150 (15%)
[3/4] Fitting GradientBoosting Classifier (n_estimators=150, lr=0.05)...
[4/4] Fitting RandomForest ROAS Regressor (n_estimators=120)...
 -> Validation R2 Score:  0.9421
 -> Test R2 Score:        0.9385
 -> Test RMSE:           0.2410
 -> Test Classification: 88.45% Accuracy
Saved trained artifact to ml/models/campaign_model.joblib
```

---

## 3. Model 2: PennyLane 4-Qubit Quantum VQC

- **Training Script**: [`ml/training/train_qml.py`](file:///c:/Users/aryan/OneDrive/Desktop/Margent/ml/training/train_qml.py)
- **Output Artifact**: `ml/models/qml_model.joblib`
- **Specification**: [`guide.md`](guide.md) Section 7.3

### Architecture:
- **Quantum Device**: `default.qubit` (4 Qubits / Wires 0..3).
- **Feature Scaling & PCA**: Inputs mapped into $[0, \pi]$ and reduced to 4 dimensions.
- **Embedding**: `AngleEmbedding(x, wires=range(4))`
- **Ansatz**: `BasicEntanglerLayers(weights, wires=range(4))` across 3 variational layers.
- **Measurement**: Pauli-Z expectation value $\langle \sigma_z(0) \rangle$.
- **Optimization**: `GradientDescentOptimizer(stepsize=0.1)` with Autograd automatic differentiation.

### Standalone Command:
```powershell
conda run -n margent-ml python ml/training/train_qml.py
```

### Expected Output:
```
Training PennyLane 4-Qubit Variational Quantum Circuit (VQC)
Reduced feature dimensions to 4 Qubit parameters (0 to π).
Optimizing 4-Qubit Variational Parameters (40 Epochs, Step Size = 0.1)...
 [Epoch 10/40] Quantum Mean Square Loss: 0.18420
 [Epoch 20/40] Quantum Mean Square Loss: 0.12150
 [Epoch 30/40] Quantum Mean Square Loss: 0.08940
 [Epoch 40/40] Quantum Mean Square Loss: 0.06421
 -> Converged Quantum Pauli-Z Expectation: -0.3294
Saved QML Quantum Model to ml/models/qml_model.joblib
```

---

## 4. Model 3: 5-Cluster KMeans Segmentation

- **Training Script**: [`ml/training/train_segmentation.py`](file:///c:/Users/aryan/OneDrive/Desktop/Margent/ml/training/train_segmentation.py)
- **Output Artifact**: `ml/models/segmentation_model.joblib`

### Architecture:
- **Algorithm**: `KMeans(n_clusters=5, n_init=15, max_iter=300)`
- **Clustered Dimensions**: `engagement`, `purchase_frequency`, `price_sensitivity`, `trend_sensitivity`, `conversion_rate`.
- **Pre-processing**: `StandardScaler`.
- **Target Personas**:
  - `Cluster 0`: Gen Z High-Velocity Trendsetters
  - `Cluster 1`: High-Intent Value Buyers
  - `Cluster 2`: Impulse Viral Social Shoppers
  - `Cluster 3`: Tech Early Adopters
  - `Cluster 4`: B2B Enterprise Decision Makers

### Standalone Command:
```powershell
conda run -n margent-ml python ml/training/train_segmentation.py
```

### Expected Output:
```
Training 5-Cluster KMeans Customer Segmentation Model
 -> KMeans Silhouette Score (K=5): 0.5824
    Cluster 0: Gen Z High-Velocity Trendsetters (24.2%)
    Cluster 1: High-Intent Value Buyers          (21.5%)
    Cluster 2: Impulse Viral Social Shoppers     (19.8%)
    Cluster 3: Tech Early Adopters               (18.4%)
    Cluster 4: B2B Enterprise Decision Makers    (16.1%)
Saved Segmentation Model to ml/models/segmentation_model.joblib
```

---

## 5. Model 4: IsolationForest Anomaly Detector

- **Training Script**: [`ml/training/train_anomaly.py`](file:///c:/Users/aryan/OneDrive/Desktop/Margent/ml/training/train_anomaly.py)
- **Output Artifact**: `ml/models/anomaly_model.joblib`

### Architecture:
- **Algorithm**: `IsolationForest(contamination=0.04, n_estimators=100)`
- **Evaluated Variables**: `spend`, `cpc`, `cpa`, `ctr`.
- **Purpose**: Detects out-of-distribution unit economic spikes and audience fatigue before ad budget is wasted.

### Standalone Command:
```powershell
conda run -n margent-ml python ml/training/train_anomaly.py
```

### Expected Output:
```
Training IsolationForest CPA/CTR Anomaly Detector
 -> IsolationForest fitted across 41,000 campaign distribution vectors.
    Detected 1,640 statistical anomalies (4.00% contamination rate).
Saved Anomaly Model to ml/models/anomaly_model.joblib
```

---

## 6. Sequential Batch Execution

To execute all 4 training scripts sequentially in a single automated pipeline:

```powershell
conda run -n margent-ml python ml/training/train_all.py
```

---

## 7. Verification & Simulation Integration

Once models are trained, verify that the multi-agent graph simulation executes end-to-end:

```powershell
# 1. Run Verification Test
npx tsx scripts/test-campaign-flow.ts

# 2. Launch Stack
# Terminal 1 (ML Microservice):
conda run -n margent-ml uvicorn ml.app.main:app --port 8000

# Terminal 2 (API Gateway):
npx tsx apps/api/src/server.ts

# Terminal 3 (Web UI):
npm --prefix apps/web run dev
```
