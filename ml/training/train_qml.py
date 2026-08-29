"""
Standalone Training Script: PennyLane 4-Qubit Variational Quantum Circuit (guide.md Section 7.3)
Architecture:
- Device: default.qubit (4 Wires: wires 0..3)
- Embedding: AngleEmbedding(x, wires=range(4))
- Ansatz: BasicEntanglerLayers(weights, wires=range(4))
- Measurement: expval(PauliZ(0))
- Optimization: Differentiable Autograd GradientDescentOptimizer(stepsize=0.1)
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.decomposition import PCA

try:
    import pennylane as qml
    from pennylane import numpy as pnp
except ImportError:
    raise ImportError("PennyLane is required. Run 'pip install pennylane pennylane-lightning'")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(ROOT_DIR, "ml", "models")
PROCESSED_DATA_PATH = os.path.join(ROOT_DIR, "datasets", "processed", "campaign_features.csv")

def train_qml_model():
    os.makedirs(MODELS_DIR, exist_ok=True)
    print("\n" + "="*60)
    print(" Training PennyLane 4-Qubit Variational Quantum Circuit (VQC)")
    print("="*60)

    # 1. Load Processed Dataset
    if os.path.exists(PROCESSED_DATA_PATH):
        df = pd.read_csv(PROCESSED_DATA_PATH)
        print(f"Ingested {len(df)} records from {PROCESSED_DATA_PATH}")
    else:
        print("Processed features not found, generating sample training matrix...")
        df = pd.DataFrame({
            "spend": np.random.uniform(500, 5000, 500),
            "impressions": np.random.uniform(10000, 100000, 500),
            "clicks": np.random.uniform(400, 5000, 500),
            "ctr": np.random.uniform(0.02, 0.08, 500),
            "cpc": np.random.uniform(0.3, 2.5, 500),
            "roas": np.random.uniform(1.2, 5.5, 500)
        })

    # 2. Dimensionality Reduction to 4 Qubits (wires 0..3)
    num_cols = ["spend", "impressions", "clicks", "ctr", "cpc"]
    X_raw = df[num_cols].values[:600]
    
    roas_med = df["roas"].median()
    y_raw = np.where(df["roas"].values[:600] >= roas_med, 1.0, -1.0) # PauliZ targets (-1, 1)

    scaler = MinMaxScaler(feature_range=(0, np.pi))
    X_scaled = scaler.fit_transform(X_raw)

    pca = PCA(n_components=4)
    X_reduced = pca.fit_transform(X_scaled)
    X_tensor = pnp.array(X_reduced, requires_grad=False)
    y_tensor = pnp.array(y_raw, requires_grad=False)

    print(f"Reduced {len(num_cols)} feature dimensions to 4 Qubit parameters (0 to π).")

    # 3. Define Quantum Circuit (guide.md Sec 7.3)
    dev = qml.device("default.qubit", wires=4)

    @qml.qnode(dev, interface="autograd")
    def quantum_circuit(weights, x):
        qml.AngleEmbedding(x, wires=range(4))
        qml.BasicEntanglerLayers(weights, wires=range(4))
        return qml.expval(qml.PauliZ(0))

    # 4. Quantum Cost Function & Gradient Descent
    n_layers = 3
    shape = qml.BasicEntanglerLayers.shape(n_layers=n_layers, n_wires=4)
    np.random.seed(42)
    weights = pnp.array(np.random.uniform(0, 2 * np.pi, shape), requires_grad=True)

    def square_loss(labels, predictions):
        return pnp.mean((labels - predictions) ** 2)

    def cost(w, X_b, y_b):
        preds = pnp.stack([quantum_circuit(w, x) for x in X_b])
        return square_loss(y_b, preds)

    opt = qml.GradientDescentOptimizer(stepsize=0.1)
    batch_size = 25
    epochs = 40

    print(f"Optimizing 4-Qubit Variational Parameters ({epochs} Epochs, Step Size = 0.1)...")

    for epoch in range(epochs):
        indices = np.random.choice(len(X_tensor), batch_size, replace=False)
        X_batch = X_tensor[indices]
        y_batch = y_tensor[indices]

        weights, loss = opt.step_and_cost(lambda w: cost(w, X_batch, y_batch), weights)

        if (epoch + 1) % 10 == 0 or epoch == 0:
            print(f" [Epoch {epoch+1:02d}/{epochs:02d}] Quantum Mean Square Loss: {float(loss):.5f}")

    # Evaluate final expectation
    test_sample = X_tensor[0]
    final_expval = float(quantum_circuit(weights, test_sample))
    print(f" -> Converged Quantum Pauli-Z Expectation: {final_expval:.4f}")

    artifact = {
        "weights": np.array(weights),
        "n_layers": n_layers,
        "n_qubits": 4,
        "pca": pca,
        "scaler": scaler,
        "final_loss": float(loss),
        "expectation_baseline": final_expval
    }

    out_path = os.path.join(MODELS_DIR, "qml_model.joblib")
    joblib.dump(artifact, out_path)
    print(f"Saved QML Quantum Model to {out_path} ({os.path.getsize(out_path):,} bytes)\n")

if __name__ == "__main__":
    train_qml_model()
