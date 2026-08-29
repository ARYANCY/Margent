"""
Campaign Performance Prediction Model
"""
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
import joblib

def load_or_synthesize_campaign_features(raw_path=None):
    if raw_path is None:
        raw_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "raw", "campaigns.csv")
    
    if os.path.exists(raw_path):
        df = pd.read_csv(raw_path)
    else:
        df = pd.DataFrame()
        
    np.random.seed(42)
    n_samples = 400
    
    spends = np.random.uniform(500, 5000, n_samples)
    impressions = spends * np.random.uniform(20, 60, n_samples)
    ctrs = np.random.uniform(0.015, 0.085, n_samples)
    clicks = impressions * ctrs
    cpcs = spends / np.maximum(clicks, 1)
    trend_alignments = np.random.uniform(40, 98, n_samples)
    
    base_roas = 1.8 + 15.0 * ctrs + 0.02 * trend_alignments - 0.2 * np.log10(np.maximum(cpcs, 0.1))
    noise = np.random.normal(0, 0.25, n_samples)
    roas = np.clip(base_roas + noise, 0.5, 8.5)
    
    conv_rates = np.clip(0.04 + 0.0006 * trend_alignments + 0.3 * ctrs + np.random.normal(0, 0.01, n_samples), 0.01, 0.25)
    
    data = pd.DataFrame({
        "spend": spends,
        "impressions": impressions,
        "clicks": clicks,
        "ctr": ctrs,
        "cpc": cpcs,
        "trend_alignment": trend_alignments,
        "roas": roas,
        "conversion_rate": conv_rates
    })
    
    proc_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "processed")
    os.makedirs(proc_dir, exist_ok=True)
    data.to_csv(os.path.join(proc_dir, "campaign_features.csv"), index=False)
    return data

def train_campaign_model(output_dir=None):
    if output_dir is None:
        output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
    os.makedirs(output_dir, exist_ok=True)
    df = load_or_synthesize_campaign_features()
    
    feature_cols = ["spend", "impressions", "clicks", "ctr", "cpc", "trend_alignment"]
    X = df[feature_cols]
    y_roas = df["roas"]
    y_conv = df["conversion_rate"]
    
    X_train, X_test, y_train_roas, y_test_roas = train_test_split(X, y_roas, test_size=0.2, random_state=42)
    _, _, y_train_conv, y_test_conv = train_test_split(X, y_conv, test_size=0.2, random_state=42)
    
    roas_model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    roas_model.fit(X_train, y_train_roas)
    
    conv_model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    conv_model.fit(X_train, y_train_conv)
    
    roas_preds = roas_model.predict(X_test)
    conv_preds = conv_model.predict(X_test)
    
    r2_roas = r2_score(y_test_roas, roas_preds)
    r2_conv = r2_score(y_test_conv, conv_preds)
    
    print(f"ROAS Model R2 Score: {r2_roas:.4f}")
    print(f"Conv Rate Model R2 Score: {r2_conv:.4f}")
    
    artifact = {
        "roas_model": roas_model,
        "conv_model": conv_model,
        "feature_cols": feature_cols,
        "metrics": {
            "roas_r2": float(r2_roas),
            "conv_r2": float(r2_conv)
        }
    }
    
    model_path = os.path.join(output_dir, "campaign_model.joblib")
    joblib.dump(artifact, model_path)
    print(f"Campaign model saved to {model_path}")
    return model_path

if __name__ == "__main__":
    train_campaign_model()
