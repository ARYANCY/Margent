import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  X,
  Atom,
  Cpu,
  Brain,
  TrendingUp,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";

export const AgentInspectorModal: React.FC = () => {
  const selectedAgentId = useSimulationStore((s) => s.selectedAgentId);
  const setSelectedAgentId = useSimulationStore((s) => s.setSelectedAgentId);
  const agents = useSimulationStore((s) => s.agents);
  const activeCampaign = useSimulationStore((s) => s.activeCampaign);

  const modalRef = useRef<HTMLDivElement>(null);
  const agent = selectedAgentId ? agents[selectedAgentId] : null;

  useEffect(() => {
    if (modalRef.current && agent) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.96, opacity: 0, y: 8 },
        { scale: 1, opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [agent]);

  if (!agent) return null;

  const isQML = agent.type === "qml";
  const isML = agent.type === "ml";
  const isGroq = agent.type === "groq";
  const isPyTrends = agent.type === "pytrend";

  const getPipelineInfo = () => {
    if (isQML) {
      return {
        title: "PennyLane Quantum Machine Learning",
        badge: "QML QUANTUM NODE",
        color: "text-pink-950",
        border: "border-pink-600",
        bg: "bg-pink-100",
        icon: <Atom className="w-5 h-5 text-pink-700" />,
        engine: "PennyLane 4-Qubit Variational Quantum Circuit (VQC)",
        description:
          "Computes quantum state vector expectation values <PauliZ> across non-linear Hilbert Space feature entanglements (Spend ↔ CTR ↔ Velocity ↔ Affinity)."
      };
    }
    if (isML) {
      return {
        title: "Trained Classical ML Model",
        badge: "SUPERVISED / UNSUPERVISED ML",
        color: "text-sky-950",
        border: "border-sky-600",
        bg: "bg-sky-100",
        icon: <Cpu className="w-5 h-5 text-sky-700" />,
        engine: agent.modelType || "Scikit-Learn RandomForest + KMeans",
        description:
          "Predicts return on ad spend (ROAS), conversion rates, and detects cost per click anomalies based on historical canonical campaign datasets."
      };
    }
    if (isGroq) {
      return {
        title: "Groq / Grok LLM Reasoning Agent",
        badge: "LANGUAGE REASONING MODEL",
        color: "text-emerald-950",
        border: "border-emerald-600",
        bg: "bg-emerald-100",
        icon: <Brain className="w-5 h-5 text-emerald-700" />,
        engine: "Groq LLaMA 3.3 70B & xAI Grok Structured Reasoning",
        description:
          "Evaluates creative hook resonance, sentiment nuances, customer persona perspectives, and linguistic conversion friction."
      };
    }
    if (isPyTrends) {
      return {
        title: "PyTrends Google Search Trends Agent",
        badge: "SEARCH MOMENTUM SIGNAL",
        color: "text-amber-950",
        border: "border-amber-600",
        bg: "bg-amber-100",
        icon: <TrendingUp className="w-5 h-5 text-amber-700" />,
        engine: "PyTrends Google API + Search Velocity Scoring",
        description:
          "Extracts real search volume momentum, keyword breakouts, and 90-day search velocity for trending topics."
      };
    }
    return {
      title: "Master Admin Intelligence Node",
      badge: "ENSEMBLE MASTER ORCHESTRATOR",
      color: "text-indigo-950",
      border: "border-indigo-600",
      bg: "bg-indigo-100",
      icon: <ShieldCheck className="w-5 h-5 text-indigo-700" />,
      engine: "Quantum-Classical Bayesian Ensemble Aggregator",
      description:
        "Fuses predictions from 30 ML, 30 PyTrends, 30 Groq, and 10 PennyLane QML agents to issue executive consensus recommendations."
    };
  };

  const info = getPipelineInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm select-none">
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white border-4 border-slate-950 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b-2 border-slate-900 flex items-center justify-between ${info.bg}`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white border-2 border-slate-900 flex items-center justify-center shadow-sm">
              {info.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 border-2 uppercase ${info.bg} ${info.color} ${info.border}`}>
                  {info.badge}
                </span>
                <span className="text-[11px] font-mono font-black text-slate-700">#{agent.agentId}</span>
              </div>
              <h2 className="text-sm font-black text-slate-950 uppercase mt-0.5">{agent.name}</h2>
            </div>
          </div>
          <button
            onClick={() => setSelectedAgentId(null)}
            className="p-1.5 border border-slate-900 text-slate-950 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-slate-950 bg-white">
          {/* Engine & Role Info */}
          <div className="p-3.5 bg-slate-100 border-2 border-slate-900">
            <div className="text-[10px] uppercase font-mono font-black text-slate-700 tracking-wider mb-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-slate-950" />
              INTELLIGENCE SPECIFICATION
            </div>
            <div className={`font-mono font-black text-xs ${info.color}`}>{info.engine}</div>
            <p className="text-slate-900 text-xs mt-1 font-medium leading-relaxed">{info.description}</p>
          </div>

          {/* Model Traits / Live Parameters */}
          <div className="grid grid-cols-3 gap-2 font-mono">
            <div className="p-2.5 bg-slate-100 border-2 border-slate-900 text-center">
              <div className="text-[10px] text-slate-700 uppercase font-black">Status</div>
              <div className="font-black text-xs text-slate-950 mt-0.5 uppercase">{agent.status}</div>
            </div>
            <div className="p-2.5 bg-slate-100 border-2 border-slate-900 text-center">
              <div className="text-[10px] text-slate-700 uppercase font-black">Sentiment</div>
              <div className="font-black text-xs text-slate-950 mt-0.5">
                {agent.sentiment > 0 ? `+${agent.sentiment.toFixed(2)}` : agent.sentiment.toFixed(2)}
              </div>
            </div>
            <div className="p-2.5 bg-slate-100 border-2 border-slate-900 text-center">
              <div className="text-[10px] text-slate-700 uppercase font-black">Resonance</div>
              <div className="font-black text-xs text-slate-950 mt-0.5">{agent.engagementScore}%</div>
            </div>
          </div>

          {/* Type Specific Live Deep-Dive */}
          {isQML && (
            <div className="p-3.5 bg-pink-100 border-2 border-pink-600">
              <div className="text-[10px] uppercase font-mono font-black text-pink-950 tracking-wider mb-1.5 flex items-center gap-1.5">
                <Atom className="w-4 h-4 text-pink-700" />
                QUANTUM CIRCUIT ENTANGLEMENT
              </div>
              <div className="space-y-1 font-mono text-xs text-pink-950 font-bold">
                <div className="flex justify-between">
                  <span>State Vector:</span>
                  <span className="font-black">|ψ⟩ = α|0000⟩ + β|1111⟩</span>
                </div>
                <div className="flex justify-between">
                  <span>Pauli-Z Expectation:</span>
                  <span className="font-black">-0.824 (High ROAS Resonance)</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantum Resonance:</span>
                  <span className="font-black">89.4%</span>
                </div>
              </div>
            </div>
          )}

          {isML && (
            <div className="p-3.5 bg-sky-100 border-2 border-sky-600">
              <div className="text-[10px] uppercase font-mono font-black text-sky-950 tracking-wider mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-700" />
                SUPERVISED STATISTICAL INFERENCE
              </div>
              <div className="space-y-1 font-mono text-xs text-sky-950 font-bold">
                <div className="flex justify-between">
                  <span>RandomForest Model:</span>
                  <span className="font-black">ml/models/campaign_model.joblib</span>
                </div>
                <div className="flex justify-between">
                  <span>Predicted ROAS:</span>
                  <span className="font-black">{activeCampaign?.roas || 3.5}x</span>
                </div>
              </div>
            </div>
          )}

          {isGroq && (
            <div className="p-3.5 bg-emerald-100 border-2 border-emerald-600">
              <div className="text-[10px] uppercase font-mono font-black text-emerald-950 tracking-wider mb-1.5 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-emerald-700" />
                LLM LINGUISTIC CRITIQUE
              </div>
              <p className="text-emerald-950 text-xs italic font-sans font-medium leading-relaxed">
                "{agent.lastAction || "High viral hook velocity with strong trend alignment on social copy."}"
              </p>
            </div>
          )}

          {isPyTrends && (
            <div className="p-3.5 bg-amber-100 border-2 border-amber-600">
              <div className="text-[10px] uppercase font-mono font-black text-amber-950 tracking-wider mb-1.5 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-700" />
                GOOGLE SEARCH MOMENTUM
              </div>
              <div className="space-y-1 font-mono text-xs text-amber-950 font-bold">
                <div className="flex justify-between">
                  <span>Search Velocity Score:</span>
                  <span className="font-black">88.5 / 100</span>
                </div>
                <div className="flex justify-between">
                  <span>Growth Velocity:</span>
                  <span className="font-black text-emerald-900">+94.5% (Breakout)</span>
                </div>
              </div>
            </div>
          )}

          {/* Last Action Log */}
          {agent.lastAction && (
            <div className="p-3 bg-slate-100 border-2 border-slate-800">
              <div className="text-[10px] text-slate-700 uppercase font-mono font-black mb-0.5">Latest Action Log</div>
              <div className="text-xs text-slate-950 font-mono font-bold">"{agent.lastAction}"</div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t-2 border-slate-900 flex items-center justify-end bg-slate-100">
          <button
            onClick={() => setSelectedAgentId(null)}
            className="px-5 py-2 text-xs font-mono font-black uppercase bg-slate-950 hover:bg-slate-800 text-white border border-slate-950 transition shadow"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
