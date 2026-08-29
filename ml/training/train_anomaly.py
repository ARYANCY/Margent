"""
Standalone Training Script: IsolationForest Anomaly & CPA Drift Detector
Detects out-of-distribution unit economic spikes and budget inefficiencies across:
- spend, cpc, cpa, ctr
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(ROOT_DIR, "ml", "models")
PROCESSED_DATA_PATH = os.path.join(ROOT_DIR, "datasets", "processed", "campaign_features.csv")

def train_anomaly_model():
    os.makedirs(MODELS_DIR, exist_ok=True)
    print("\n" + "="*60)
    print(" Training IsolationForest CPA/CTR Anomaly Detector")
    print("="*60)

    if os.path.exists(PROCESSED_DATA_PATH):
        df = pd.read_csv(PROCESSED_DATA_PATH)
        spend = df["spend"].values
        cpc = df["cpc"].values
        cpa = df["cpa"].values
        ctr = df["ctr"].values
    else:
        n_samples = 4000
        np.random.seed(42)
        spend = np.random.uniform(200, 8000, n_samples)
        cpc = np.random.uniform(0.2, 4.0, n_samples)
        cpa = np.random.uniform(4.0, 35.0, n_samples)
        ctr = np.random.uniform(0.01, 0.08, n_samples)

    X = pd.DataFrame({
        "spend": spend,
        "cpc": cpc,
        "cpa": cpa,
        "ctr": ctr
    })

    contamination_rate = 0.04
    iso = IsolationForest(contamination=contamination_rate, random_state=42, n_estimators=100, n_jobs=-1)
    iso.fit(X)

    preds = iso.predict(X)
    anom_count = int(np.sum(preds == -1))
    pct = (anom_count / len(X)) * 100

    print(f" -> IsolationForest fitted across {len(X):,} campaign distribution vectors.")
    print(f"    Detected {anom_count:,} statistical anomalies ({pct:.2f}% contamination rate).")

    artifact = {
        "isolation_forest": iso,
        "features": ["spend", "cpc", "cpa", "ctr"],
        "contamination": contamination_rate,
        "n_samples": len(X)
    }

    out_path = os.path.join(MODELS_DIR, "anomaly_model.joblib")
    joblib.dump(artifact, out_path)
    print(f"Saved Anomaly Model to {out_path} ({os.path.getsize(out_path):,} bytes)\n")

if __name__ == "__main__":
    train_anomaly_model()
