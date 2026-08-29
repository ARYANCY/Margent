"""
Anomaly Detection Model using IsolationForest
"""
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib

def train_anomaly_model(output_dir=None):
    if output_dir is None:
        output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
    os.makedirs(output_dir, exist_ok=True)
    np.random.seed(42)
    n_normal = 500
    
    normal_spend = np.random.uniform(500, 3000, n_normal)
    normal_ctr = np.random.uniform(0.02, 0.07, n_normal)
    normal_cpc = normal_spend / (normal_spend * 30 * normal_ctr)
    normal_conv = np.random.uniform(0.04, 0.12, n_normal)
    normal_roas = np.random.uniform(2.0, 5.5, n_normal)
    
    n_anom = 25
    anom_spend = np.random.uniform(4000, 8000, n_anom)
    anom_ctr = np.random.uniform(0.002, 0.008, n_anom)
    anom_cpc = np.random.uniform(5.0, 15.0, n_anom)
    anom_conv = np.random.uniform(0.001, 0.01, n_anom)
    anom_roas = np.random.uniform(0.1, 0.6, n_anom)
    
    spends = np.concatenate([normal_spend, anom_spend])
    ctrs = np.concatenate([normal_ctr, anom_ctr])
    cpcs = np.concatenate([normal_cpc, anom_cpc])
    convs = np.concatenate([normal_conv, anom_conv])
    roas = np.concatenate([normal_roas, anom_roas])
    
    feature_cols = ["spend", "ctr", "cpc", "conversion_rate", "roas"]
    X = pd.DataFrame({
        "spend": spends,
        "ctr": ctrs,
        "cpc": cpcs,
        "conversion_rate": convs,
        "roas": roas
    })
    
    iso_forest = IsolationForest(contamination=0.05, random_state=42)
    iso_forest.fit(X)
    
    artifact = {
        "model": iso_forest,
        "feature_cols": feature_cols
    }
    
    model_path = os.path.join(output_dir, "anomaly_model.joblib")
    joblib.dump(artifact, model_path)
    print(f"Anomaly model saved to {model_path}")
    return model_path

if __name__ == "__main__":
    train_anomaly_model()
