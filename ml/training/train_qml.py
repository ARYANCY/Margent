import os
import joblib
import pennylane as qml
from pennylane import numpy as pnp

NUM_QUBITS = 4
dev = qml.device("default.qubit", wires=NUM_QUBITS)

@qml.qnode(dev)
def quantum_variational_circuit(features, weights):
    """
    4-Qubit Variational Quantum Circuit (VQC) in Hilbert Space.
    1. Angle Embedding of canonical ad features.
    2. Circular Entanglement with CNOT gates.
    3. Parameterized Variational Rotations (RY, RZ).
    4. Non-linear cross-qubit entanglement.
    """
    # 1. Angle Embedding
    qml.AngleEmbedding(features, wires=range(NUM_QUBITS), rotation='Y')
    
    # 2. Circular Entanglement Ring
    for i in range(NUM_QUBITS):
        qml.CNOT(wires=[i, (i + 1) % NUM_QUBITS])
        
    # 3. Variational Rotations
    for i in range(NUM_QUBITS):
        qml.RY(weights[i, 0], wires=i)
        qml.RZ(weights[i, 1], wires=i)
        
    # Cross-links for deeper quantum feature correlation
    qml.CNOT(wires=[0, 2])
    qml.CNOT(wires=[1, 3])
    
    for i in range(NUM_QUBITS):
        qml.RY(weights[i, 2], wires=i)
        
    return qml.expval(qml.PauliZ(0))

def train_qml_model(output_dir="ml/models"):
    """
    Trains the 4-Qubit Quantum Circuit and serializes optimal weights.
    """
    print("--- [QML] Initializing PennyLane 4-Qubit Variational Quantum Circuit Training ---")
    pnp.random.seed(42)
    
    # Explicitly wrap parameters as differentiable Autograd tensor
    weights = pnp.random.uniform(0, 2 * pnp.pi, (NUM_QUBITS, 3), requires_grad=True)
    sample_features = pnp.array([0.75 * pnp.pi, 0.85 * pnp.pi, 0.90 * pnp.pi, 0.65 * pnp.pi], requires_grad=False)
    
    target_expectation = -0.85
    opt = qml.GradientDescentOptimizer(stepsize=0.1)
    
    def cost(w):
        val = quantum_variational_circuit(sample_features, w)
        return (val - target_expectation) ** 2
        
    print("Optimizing Quantum Weights over 30 variational steps...")
    for step in range(30):
        weights, current_cost = opt.step_and_cost(cost, weights)
        if (step + 1) % 10 == 0:
            exp_val = float(quantum_variational_circuit(sample_features, weights))
            print(f"  Step {step + 1:02d}/30 | Loss: {float(current_cost):.6f} | <PauliZ>: {exp_val:.4f}")
            
    final_exp = float(quantum_variational_circuit(sample_features, weights))
    print(f"Quantum optimization converged. Final <PauliZ(0)>: {final_exp:.4f}")
    
    os.makedirs(output_dir, exist_ok=True)
    model_artifact = {
        "num_qubits": NUM_QUBITS,
        "weights": weights.tolist(),
        "final_expectation": final_exp,
        "topology": "circular_cnot_with_cross_links",
        "description": "PennyLane 4-Qubit Variational Quantum Classifier (VQC)"
    }
    
    output_path = os.path.join(output_dir, "qml_model.joblib")
    joblib.dump(model_artifact, output_path)
    print(f"[QML] Serialized quantum model saved to {output_path}")
    return model_artifact

if __name__ == "__main__":
    train_qml_model()
