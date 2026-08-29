"""
Customer Segmentation Model Training using KMeans
"""
import os
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
import joblib

def generate_synthetic_customer_data(n_samples=500, random_state=42):
    np.random.seed(random_state)
    a1 = np.column_stack([
        np.random.normal(0.85, 0.08, 100),
        np.random.normal(0.75, 0.10, 100),
        np.random.normal(0.40, 0.12, 100),
        np.random.normal(0.90, 0.06, 100),
        np.random.normal(0.12, 0.03, 100),
    ])
    a2 = np.column_stack([
        np.random.normal(0.50, 0.10, 100),
        np.random.normal(0.35, 0.08, 100),
        np.random.normal(0.90, 0.05, 100),
        np.random.normal(0.40, 0.12, 100),
        np.random.normal(0.06, 0.02, 100),
    ])
    a3 = np.column_stack([
        np.random.normal(0.92, 0.05, 100),
        np.random.normal(0.60, 0.12, 100),
        np.random.normal(0.55, 0.10, 100),
        np.random.normal(0.95, 0.04, 100),
        np.random.normal(0.10, 0.03, 100),
    ])
    a4 = np.column_stack([
        np.random.normal(0.65, 0.12, 100),
        np.random.normal(0.85, 0.08, 100),
        np.random.normal(0.15, 0.08, 100),
        np.random.normal(0.70, 0.10, 100),
        np.random.normal(0.18, 0.04, 100),
    ])
    a5 = np.column_stack([
        np.random.normal(0.70, 0.10, 100),
        np.random.normal(0.65, 0.09, 100),
        np.random.normal(0.50, 0.11, 100),
        np.random.normal(0.75, 0.08, 100),
        np.random.normal(0.11, 0.02, 100),
    ])
    data = np.vstack([a1, a2, a3, a4, a5])
    data = np.clip(data, 0.0, 1.0)
    columns = ["engagement", "purchase_frequency", "price_sensitivity", "trend_sensitivity", "conversion_rate"]
    return pd.DataFrame(data, columns=columns)

def train_segmentation_model(output_dir=None):
    if output_dir is None:
        output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
    os.makedirs(output_dir, exist_ok=True)
    df = generate_synthetic_customer_data()
    
    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    kmeans.fit(df)
    
    model_path = os.path.join(output_dir, "segmentation_model.joblib")
    
    segment_labels = {
        0: "Tech Enthusiast",
        1: "Budget Conscious",
        2: "Trend Chaser",
        3: "Luxury / Premium",
        4: "Eco & Value Driven"
    }
    
    artifact = {
        "model": kmeans,
        "features": list(df.columns),
        "cluster_centers": kmeans.cluster_centers_.tolist(),
        "labels": segment_labels
    }
    
    joblib.dump(artifact, model_path)
    print(f"Segmentation model saved to {model_path}")
    return model_path

if __name__ == "__main__":
    train_segmentation_model()
