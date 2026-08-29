"""
Sequential Standalone Model Training Orchestrator
Executes each model's standalone training module in sequence:
1. train_campaign.py      (Classical GradientBoosting + RandomForest - guide.md Sec 7.2)
2. train_qml.py           (PennyLane 4-Qubit Variational Quantum Circuit - guide.md Sec 7.3)
3. train_segmentation.py  (5-Cluster KMeans Customer Demographic Segmentor)
4. train_anomaly.py       (IsolationForest CPA/CTR Anomaly Detector)
"""
import sys
import os
import time

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, ROOT_DIR)

from ml.training.train_campaign import train_campaign_model
from ml.training.train_qml import train_qml_model
from ml.training.train_segmentation import train_segmentation_model
from ml.training.train_anomaly import train_anomaly_model

def run_all_training():
    start_time = time.time()
    print("\n" + "="*70)
    print(" MARGENT MULTI-AGENT INTELLIGENCE PLATFORM: MODEL TRAINING PIPELINE")
    print("="*70)

    # 1. Classical Campaign Performance Model
    print("\n>>> STEP 1/4: Training Classical Campaign Performance Models...")
    train_campaign_model()

    # 2. PennyLane Quantum Variational Circuit
    print("\n>>> STEP 2/4: Training PennyLane 4-Qubit Variational Quantum Circuit...")
    train_qml_model()

    # 3. 5-Cluster KMeans Customer Segmentation
    print("\n>>> STEP 3/4: Training 5-Cluster KMeans Customer Segmentation...")
    train_segmentation_model()

    # 4. IsolationForest Anomaly Detector
    print("\n>>> STEP 4/4: Training IsolationForest Anomaly Detector...")
    train_anomaly_model()

    elapsed = time.time() - start_time
    print("="*70)
    print(f" ALL 4 STANDALONE MODELS TRAINED & SERIALIZED IN {elapsed:.2f}s")
    print(f" Model Artifacts saved to: {os.path.join(ROOT_DIR, 'ml', 'models')}")
    print("="*70 + "\n")

if __name__ == "__main__":
    run_all_training()
