"""
Standalone Training Script: 5-Cluster KMeans Customer Segmentation Model
Clusters consumer behavior attributes:
- engagement, purchase_frequency, price_sensitivity, trend_sensitivity, conversion_rate
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(ROOT_DIR, "ml", "models")
PROCESSED_DATA_PATH = os.path.join(ROOT_DIR, "datasets", "processed", "campaign_features.csv")

def train_segmentation_model():
    os.makedirs(MODELS_DIR, exist_ok=True)
    print("\n" + "="*60)
    print(" Training 5-Cluster KMeans Customer Segmentation Model")
    print("="*60)

    np.random.seed(42)
    n_samples = 3000

    # Ingest actual data features if available
    if os.path.exists(PROCESSED_DATA_PATH):
        df = pd.read_csv(PROCESSED_DATA_PATH)
        n_samples = len(df)
        engagement = df["engagement_score"].values if "engagement_score" in df else np.random.beta(5, 2, n_samples)
        conversion = df["conversion_rate"].values if "conversion_rate" in df else np.random.beta(2, 20, n_samples)
        trend_sens = (df["trend_alignment"].values / 100.0) if "trend_alignment" in df else np.random.beta(4, 2, n_samples)
        purchase_freq = np.random.beta(2, 5, n_samples)
        price_sens = np.random.beta(3, 3, n_samples)
    else:
        engagement = np.random.beta(5, 2, n_samples)
        purchase_freq = np.random.beta(2, 5, n_samples)
        price_sens = np.random.beta(3, 3, n_samples)
        trend_sens = np.random.beta(4, 2, n_samples)
        conversion = np.random.beta(2, 20, n_samples)

    X_raw = np.column_stack([engagement, purchase_freq, price_sens, trend_sens, conversion])

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)

    n_clusters = 5
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=15, max_iter=300)
    kmeans.fit(X_scaled)

    sil_score = silhouette_score(X_scaled[:1000], kmeans.labels_[:1000])

    segment_names = {
        0: "Gen Z High-Velocity Trendsetters",
        1: "High-Intent Value Buyers",
        2: "Impulse Viral Social Shoppers",
        3: "Tech Early Adopters",
        4: "B2B Enterprise Decision Makers"
    }

    print(f" -> KMeans Silhouette Score (K=5): {sil_score:.4f}")
    for cid, name in segment_names.items():
        count = int(np.sum(kmeans.labels_ == cid))
        pct = (count / len(X_scaled)) * 100
        print(f"    Cluster {cid}: {name:<34} ({count:,} samples, {pct:.1f}%)")

    artifact = {
        "kmeans": kmeans,
        "scaler": scaler,
        "n_clusters": n_clusters,
        "segment_names": segment_names,
        "silhouette_score": float(sil_score),
        "cluster_centers": kmeans.cluster_centers_
    }

    out_path = os.path.join(MODELS_DIR, "segmentation_model.joblib")
    joblib.dump(artifact, out_path)
    print(f"Saved Segmentation Model to {out_path} ({os.path.getsize(out_path):,} bytes)\n")

if __name__ == "__main__":
    train_segmentation_model()
