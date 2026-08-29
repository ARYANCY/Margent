# Project Setup & Execution Guide

This document provides complete instructions on how to set up, configure, train, and run the **Margent** Multi-Modal Autonomous Marketing Intelligence Platform.

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
1. **Node.js** (v18 or higher recommended)
2. **Miniconda** or **Anaconda** (for Python 3.11 environment management)
3. **Git** (for cloning the repository)
4. A **Groq API Key** (Get a free key from the [Groq Console](https://console.groq.com/keys))

---

## ⚙️ Step-by-Step Installation

### 1. Clone the Repository
Clone the codebase and navigate to the project root directory:
```powershell
git clone <repository-url>
cd Margent
```

### 2. Set Up the Python Environment
Initialize the dedicated Conda environment and install the ML, Quantum, and API dependencies:
```powershell
# Create Conda Environment with Python 3.11
conda create -n ai-product-hackathon python=3.11 -y

# Activate Environment
conda activate ai-product-hackathon

# Install Required Python Libraries
pip install fastapi uvicorn pandas numpy scikit-learn joblib pydantic pytrends groq pennylane pennylane-lightning
```

### 3. Install Node.js Dependencies
Install all Node.js workspace dependencies from the root directory:
```powershell
npm install
```

### 4. Configure Environment Variables
Copy the template configuration files to their active locations:
```powershell
# Root Environment Configuration
cp .env.example .env

# Python ML Microservice Configuration
cp ml/.env.example ml/.env

# Node.js API Server Configuration
cp apps/api/.env.example apps/api/.env
```

> [!IMPORTANT]
> - Open `ml/.env` and insert your **Groq API Key** (`GROQ_API_KEY=gsk_...`).
> - Optionally, you can also add your `XAI_API_KEY` (xAI Grok key) in both `ml/.env` and `.env` if available.

---

## 🧠 Model Training

Before launching the servers, you must train the 101 Ensemble Nodes (30 Classical ML, 30 PyTrends, 30 Groq LLM, 10 PennyLane QML, and 1 Admin Master Synthesizer).

Run the one-click training command to generate the serialized `.joblib` models:
```powershell
conda run -n ai-product-hackathon python datasets/train_nodes.py
```
*Note: This command will train all nodes and output the model files under [ml/models/](file:///f:/Hackathon/Ai_Product_Hackathon_2026/Margent/ml/models).*

---

## 🚀 Running the Services

You can launch the complete Margent stack either using a single unified command or by starting the components individually in separate terminals.

### Option A: Unified Launcher (Recommended)
You can run all three services concurrently in a single terminal from the root folder:
```powershell
npm run dev
```
This will automatically launch:
- **Python FastAPI ML Microservice** (Port 8000)
- **Node.js Express & Socket.IO API** (Port 4000)
- **Vite React Web Visualizer** (Port 5173)

---

### Option B: Separate Terminal Launchers
If you prefer to run each service in its own terminal window, open three terminals and run:

* **Terminal 1: Python FastAPI ML Microservice**
  ```powershell
  conda activate ai-product-hackathon
  uvicorn ml.app.main:app --host 127.0.0.1 --port 8000 --reload
  ```

* **Terminal 2: Node.js Express & Socket.IO API Server**
  ```powershell
  npx tsx apps/api/src/server.ts
  ```

* **Terminal 3: Vite React Web Visualizer**
  ```powershell
  npm --prefix apps/web run dev
  ```

Once the services are active, navigate to **[http://127.0.0.1:5173](http://127.0.0.1:5173)** in your web browser.

---

## 🧪 Automated Integration Tests

To verify that the complete end-to-end integration and campaign recommendation flow works correctly across the LangGraph state machine, run the automated verification script:

```powershell
npx tsx scripts/test-campaign-flow.ts
```
