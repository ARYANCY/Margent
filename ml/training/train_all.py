"""
Train all machine learning models in sequence
"""
import sys
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from train_segmentation import train_segmentation_model
from train_campaign import train_campaign_model
from train_anomaly import train_anomaly_model

def main():
    print("=== Training AI Marketing Intelligence ML Models ===")
    train_segmentation_model()
    train_campaign_model()
    train_anomaly_model()
    print("=== All models successfully trained and stored in ml/models/ ===")

if __name__ == "__main__":
    main()
