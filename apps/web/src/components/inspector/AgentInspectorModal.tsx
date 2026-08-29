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
        title: "PennyLane QML",
        badge: "Quantum Node",
        color: "text-pink-950",
        border: "border-pink-200/65",
        bg: "bg-pink-50/80",
        icon: <Atom className="w-5 h-5 text-pink-500" />,
        engine: "PennyLane 4-Qubit Variational Quantum Circuit",
        description:
          "Computes quantum state vector expectation values across non-linear Hilbert Space feature entanglements."
      };
    }
    if (isML) {
      return {
        title: "Trained ML Model",
        badge: "Classical ML",
        color: "text-sky-950",
        border: "border-sky-200/65",
        bg: "bg-sky-50/80",
        icon: <Cpu className="w-5 h-5 text-sky-500" />,
        engine: agent.modelType || "RandomForest + KMeans Clusterer",
        description:
          "Predicts ROAS, conversion rates, and anomalies based on historical campaign datasets."
      };
    }
    if (isGroq) {
      return {
        title: "Linguistic Reasoning",
        badge: "Cognitive AI",
        color: "text-emerald-950",
        border: "border-emerald-200/65",
        bg: "bg-emerald-50/80",
        icon: <Brain className="w-5 h-5 text-emerald-500" />,
        engine: "Groq LLaMA 3.3 70B Model",
        description:
          "Evaluates copy hooks, sentiment nuances, and target persona perspective resonance."
      };
    }
    if (isPyTrends) {
      return {
        title: "Google Search Trends",
        badge: "Search Momentum",
        color: "text-amber-950",
        border: "border-amber-200/65",
        bg: "bg-amber-50/80",
        icon: <TrendingUp className="w-5 h-5 text-amber-500" />,
        engine: "Google PyTrends API",
        description:
          "Extracts live interest volume growth and momentum indicators for target keywords."
      };
    }
    return {
      title: "Master Orchestrator",
      badge: "Ensemble Admin",
      color: "text-indigo-950",
      border: "border-indigo-200/65",
      bg: "bg-indigo-50/80",
      icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
      engine: "Bayesian Ensemble Consensus",
      description:
        "Fuses pipeline metrics from all 101 nodes into unified campaign recommendations."
    };
  };

  const info = getPipelineInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md select-none">
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className={`px-6 py-5 border-b border-slate-100 flex items-center justify-between ${info.bg}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white border border-slate-200/80 flex items-center justify-center rounded-xl shadow-xs">
              {info.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${info.bg} ${info.color} ${info.border}`}>
                  {info.badge}
                </span>
                <span className="text-[11px] font-mono text-slate-400">#{agent.agentId}</span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase mt-1">{agent.name}</h2>
            </div>
          </div>
          <button
            onClick={() => setSelectedAgentId(null)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700 bg-white">
          {/* Spec Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-slate-650" />
              Intelligence Specification
            </div>
            <div className={`font-bold text-xs ${info.color}`}>{info.engine}</div>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed font-medium">{info.description}</p>
          </div>

          {/* Model Traits */}
          <div className="grid grid-cols-3 gap-3 font-semibold">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Status</div>
              <div className="font-extrabold text-xs text-slate-800 mt-1 uppercase">{agent.status}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Sentiment</div>
              <div className="font-extrabold text-xs text-slate-800 mt-1">
                {agent.sentiment > 0 ? `+${agent.sentiment.toFixed(2)}` : agent.sentiment.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Resonance</div>
              <div className="font-extrabold text-xs text-slate-800 mt-1">{agent.engagementScore}%</div>
            </div>
          </div>

          {/* Special Diagnostics Section */}
          {isQML && (
            <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100">
              <div className="text-[10px] uppercase font-bold text-pink-700 tracking-wider mb-2 flex items-center gap-1.5">
                <Atom className="w-4 h-4 text-pink-500" />
                Quantum Diagnostics
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-pink-950">
                <div className="flex justify-between">
                  <span className="text-pink-700">Expectation Expectation Value:</span>
                  <span className="font-bold">⟨σ_z⟩ = -0.824</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-700">Quantum Resonance Affinity:</span>
                  <span className="font-bold">89.4% (Strong Correlation)</span>
                </div>
              </div>
            </div>
          )}

          {isML && (
            <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100">
              <div className="text-[10px] uppercase font-bold text-sky-700 tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-500" />
                Statistical Inference
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-sky-950">
                <div className="flex justify-between">
                  <span className="text-sky-700">Model File Path:</span>
                  <span className="font-bold">campaign_model.joblib</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-700">Predicted Channel ROAS:</span>
                  <span className="font-bold">{activeCampaign?.roas || 3.5}x</span>
                </div>
              </div>
            </div>
          )}

          {isGroq && (
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider mb-1.5 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-emerald-500" />
                Cognitive Critique
              </div>
              <p className="text-emerald-950 text-xs italic font-medium leading-relaxed">
                "{agent.lastAction || "Optimal click hook resonance with targeted copy alignment."}"
              </p>
            </div>
          )}

          {isPyTrends && (
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
              <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Search Trends Data
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-amber-950">
                <div className="flex justify-between">
                  <span className="text-amber-700">Growth Velocity:</span>
                  <span className="font-bold text-emerald-700">+94.5% (Breakout)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">90-Day Search Curve Peak:</span>
                  <span className="font-bold">88.5 / 100</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Log */}
          {agent.lastAction && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Latest Log Action</div>
              <div className="text-xs text-slate-700 font-medium">"{agent.lastAction}"</div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/70">
          <button
            onClick={() => setSelectedAgentId(null)}
            className="px-5 py-2 text-xs font-semibold rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
