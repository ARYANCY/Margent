# Operator Setup & Action Checklist (`todo.md`)

This checklist contains the exact step-by-step tasks you need to complete to configure your environment, drop datasets, set API keys (Groq/Grok), run Quantum QML circuits, and launch all 3 services with live WebSocket connectivity.

---

## Quick Navigation
1. [Step 1: Conda Environment & Dependencies](#step-1-conda-environment--dependencies)
2. [Step 2: API Keys Configuration (Groq / Grok)](#step-2-api-keys-configuration-groq--grok)
3. [Step 3: Download & Drop Custom Datasets](#step-3-download--drop-custom-datasets)
4. [Step 4: Train All 101 Nodes (1-Click)](#step-4-train-all-101-nodes-1-click)
5. [Step 5: Launch the 3 Multi-Modal Services](#step-5-launch-the-3-multi-modal-services)
6. [Step 6: Verify Connectivity & Simulation](#step-6-verify-connectivity--simulation)

---

## Step 1: Conda Environment & Dependencies

- [ ] **Open PowerShell / Terminal** and verify Conda is available:
  ```powershell
  conda --version
  ```
- [ ] **Create & Activate the `ai-product-hackathon` Environment**:
  ```powershell
  conda create -n ai-product-hackathon python=3.11 -y
  conda activate ai-product-hackathon
  ```
- [ ] **Install Required Python Packages**:
  ```powershell
  pip install fastapi uvicorn pandas numpy scikit-learn joblib pydantic pytrends groq pennylane pennylane-lightning python-multipart
  ```
- [ ] **Install Node.js Monorepo Dependencies**:
  ```powershell
  npm install
  ```

---

## Step 2: API Keys Configuration (Groq / Grok)

- [ ] **Obtain a Free Groq API Key**:
  - Visit: [https://console.groq.com/keys](https://console.groq.com/keys)
  - Create a new API Key (Free tier provides ultra-fast LLaMA 3.3 70B inference).
- [ ] **(Optional) Obtain an xAI Grok API Key**:
  - Visit: [https://console.x.ai/](https://console.x.ai/)
- [ ] **Create `.env` Files**:
  
  **File 1: `ml/.env`** (for Python FastAPI ML microservice)
  ```ini
  GROQ_API_KEY=gsk_your_actual_groq_api_key_here
  XAI_API_KEY=your_xai_key_if_available
  PORT=8000
  ```

  **File 2: `apps/api/.env`** (for Express & Socket.IO backend)
  ```ini
  PORT=4000
  ML_SERVICE_URL=http://127.0.0.1:8000
  CORS_ORIGIN=http://127.0.0.1:5173
  ```

  *(Note: If no API key is provided, the platform automatically utilizes its high-precision deterministic qualitative reasoning engine as a zero-downtime fallback).*

---

## Step 3: Download & Drop Custom Datasets

Download your marketing or e-commerce campaign data from Kaggle (e.g. *Marketing Campaign Performance Dataset*, *Social Media Ad Conversion Data*) or export from Google Ads / Meta Ads, and drop them directly into the `datasets/` folder:

- [ ] **File 1: `datasets/campaigns.csv`** (Primary Training Dataset)
  - Required columns:
    ```csv
    campaign_id,channel,audience,spend,impressions,clicks,conversions,revenue,trend_alignment
    camp_001,TikTok,Gen Z Trendsetters,1500,48000,2400,280,5600,92
    camp_002,Instagram,Tech Enthusiasts,2200,65000,3100,340,7920,88
    camp_003,LinkedIn,B2B Leaders,3500,82000,2800,290,9800,84
    camp_004,YouTube,Creators,4200,95000,3800,410,12600,95
    ```
  - *Tip: If `ctr`, `cpc`, or `roas` columns are missing, `train_nodes.py` auto-computes them.*

- [ ] **File 2: `datasets/trends.json`** (Real-Time Search Signals)
  - Drop or customize trending topics:
    ```json
    [
      {
        "trendId": "trend_001",
        "name": "Autonomous Multi-Agent Systems",
        "hashtag": "#AgenticAI",
        "growth": 95.2,
        "interest": 94.0,
        "velocity": 91.0,
        "status": "RISING"
      },
      {
        "trendId": "trend_002",
        "name": "Quantum Machine Learning",
        "hashtag": "#QML",
        "growth": 88.4,
        "interest": 86.0,
        "velocity": 89.0,
        "status": "RISING"
      }
    ]
    ```

- [ ] **File 3: `datasets/customer_segments.csv`** (Audience Clustering)
  - Vectors for KMeans customer persona clustering:
    ```csv
    engagement,purchase_frequency,price_sensitivity,trend_sensitivity,conversion_rate
    0.85,0.70,0.35,0.90,0.15
    0.45,0.30,0.80,0.50,0.04
    0.92,0.85,0.25,0.95,0.18
    ```

---

## Step 4: Train All 101 Nodes (1-Click)

- [ ] **Run the Master Training Pipeline**:
  ```powershell
  conda run -n ai-product-hackathon python datasets/train_nodes.py
  ```
- [ ] **Verify Generated Model Artifacts** in `ml/models/`:
  - `ml/models/campaign_model.joblib` (RandomForest ROAS & Conversion Regressors)
  - `ml/models/anomaly_model.joblib` (IsolationForest Anomaly Detector)
  - `ml/models/segmentation_model.joblib` (KMeans 5-Cluster Segmenter)
  - `ml/models/qml_model.joblib` (PennyLane 4-Qubit Variational Quantum Classifier)

---

## Step 5: Launch the 3 Multi-Modal Services

Open 3 separate PowerShell terminal tabs:

### Terminal 1: Python FastAPI ML & Quantum Microservice (Port 8000)
```powershell
conda activate ai-product-hackathon
python -m uvicorn ml.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Terminal 2: Node.js Express & Socket.IO Orchestrator (Port 4000)
```powershell
npx tsx apps/api/src/server.ts
```

### Terminal 3: Vite React Web Visualizer (Port 5173)
```powershell
npm --prefix apps/web run dev
```

---

## Step 6: Verify Connectivity & Simulation

- [ ] **Run the Automated End-to-End Test Suite**:
  ```powershell
  npx tsx scripts/test-campaign-flow.ts
  ```
  *Expected Output: `=== ALL 30-30-30-10 MULTI-MODAL ENSEMBLE TESTS PASSED! ===`*

- [ ] **Open the Web Application**:
  - URL: **[http://127.0.0.1:5173](http://127.0.0.1:5173)**
- [ ] **Check Live Simulation & Controls**:
  - Click **`RUN SIMULATION`** on the bottom floating bar and watch animated streaming paths pulse into the Admin Master node.
  - Click **`+ NEW CAMPAIGN`** to post a creative ad asset (photo, copy, spend, trend alignment).
  - Click **`ANALYTICS DASHBOARD`** to view the 4-way consensus comparison (30 ML + 30 PyTrends + 30 Groq + 10 QML) and approve/reject the executive recommendation.
  - Click any node on the graph to inspect its Hilbert state vector, quantum expectation value, or RandomForest parameters in the **Node Inspector Modal**.
