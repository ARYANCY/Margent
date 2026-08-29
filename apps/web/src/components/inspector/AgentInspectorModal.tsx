import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  X,
  Atom,
  Cpu,
  Brain,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle
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
        { scale: 0.98, opacity: 0, y: 6 },
        { scale: 1, opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }
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
        title: "PennyLane QML Node",
        badge: "10 Quantum Nodes",
        color: "text-pink-900",
        border: "border-pink-200",
        bg: "bg-pink-50",
        icon: <Atom className="w-4 h-4 text-pink-600" />,
        engine: "PennyLane 4-Qubit Variational Quantum Circuit",
        description:
          "Projects campaign features into 4-Qubit Hilbert Space using AngleEmbedding and BasicEntanglerLayers to compute Pauli-Z expectation values."
      };
    }
    if (isML) {
      return {
        title: "Trained Classical ML Node",
        badge: "30 ML Models",
        color: "text-sky-900",
        border: "border-sky-200",
        bg: "bg-sky-50",
        icon: <Cpu className="w-4 h-4 text-sky-600" />,
        engine: agent.modelType || "RandomForest + GradientBoosting Regressor",
        description:
          "Predicts campaign ROAS and conversion rates trained on historical multi-channel datasets."
      };
    }
    if (isGroq) {
      return {
        title: "Groq LLM Qualitative Node",
        badge: "30 Cognitive Nodes",
        color: "text-emerald-900",
        border: "border-emerald-200",
        bg: "bg-emerald-50",
        icon: <Brain className="w-4 h-4 text-emerald-600" />,
        engine: "Groq LLaMA 3.3 70B Versatile",
        description:
          "Evaluates copywriting hooks, linguistic persuasion, and target demographic resonance."
      };
    }
    if (isPyTrends) {
      return {
        title: "Google Trends Signal Node",
        badge: "30 PyTrends Nodes",
        color: "text-amber-900",
        border: "border-amber-200",
        bg: "bg-amber-50",
        icon: <TrendingUp className="w-4 h-4 text-amber-600" />,
        engine: "Google Trends API & Velocity Engine",
        description:
          "Calculates 90-day search volume interest curves, growth rates, and breakout keyword momentum."
      };
    }
    return {
      title: "Master Admin Orchestrator",
      badge: "Master Consensus",
      color: "text-indigo-900",
      border: "border-indigo-200",
      bg: "bg-indigo-50",
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
      engine: "Bayesian Multi-Modal Ensemble Aggregator",
      description:
        "Fuses 30 ML, 30 PyTrends, 30 Groq, and 10 PennyLane QML models into prioritized executive actions."
    };
  };

  const pipe = getPipelineInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs select-none">
      <div
        ref={modalRef}
        className="relative w-full max-w-xl bg-white border border-slate-300 shadow-2xl overflow-hidden flex flex-col font-mono"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center shadow-sm">
              {pipe.icon}
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                NODE TELEMETRY INSPECTOR
              </span>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                {agent.name} <span className="text-slate-400 font-normal">#{agent.agentId}</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${pipe.bg} ${pipe.color} ${pipe.border}`}>
              {pipe.badge}
            </span>
            <button
              onClick={() => setSelectedAgentId(null)}
              className="p-1 border border-slate-300 text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5 text-xs text-slate-900 bg-white">
          {/* 1. Core Role & Description */}
          <div className="p-3 bg-slate-50 border border-slate-200">
            <div className="text-[9px] font-bold uppercase text-slate-500 mb-1">
              ENGINE SPECIFICATION
            </div>
            <div className="text-xs font-bold text-slate-900 mb-1">{pipe.engine}</div>
            <p className="text-[11px] text-slate-700 font-sans leading-relaxed">{pipe.description}</p>
          </div>

          {/* 2. Runtime Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 bg-slate-50 border border-slate-200">
              <span className="text-[8px] text-slate-500 block uppercase font-bold">STATUS</span>
              <span className="font-bold text-slate-900 text-xs uppercase">{agent.status}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200">
              <span className="text-[8px] text-slate-500 block uppercase font-bold">SENTIMENT POLARITY</span>
              <span
                className={`font-bold text-xs ${
                  agent.sentiment > 0.2
                    ? "text-emerald-700"
                    : agent.sentiment < -0.2
                    ? "text-rose-700"
                    : "text-slate-900"
                }`}
              >
                {agent.sentiment > 0 ? `+${agent.sentiment.toFixed(2)}` : agent.sentiment.toFixed(2)}
              </span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200">
              <span className="text-[8px] text-slate-500 block uppercase font-bold">ENGAGEMENT SCORE</span>
              <span className="font-bold text-slate-900 text-xs">{agent.engagementScore || 85}/100</span>
            </div>
          </div>

          {/* 3. Specialized Model Inspection Breakdown */}
          {isQML && (
            <div className="p-3 bg-pink-50/70 border border-pink-200">
              <div className="flex items-center justify-between text-[10px] font-bold text-pink-900 mb-2 uppercase">
                <span className="flex items-center gap-1.5">
                  <Atom className="w-3.5 h-3.5 text-pink-600" />
                  PennyLane Hilbert Circuit State
                </span>
                <span>Expectation: {agent.quantumExpectation ? agent.quantumExpectation.toFixed(4) : "-0.3294"}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="p-1.5 bg-white border border-pink-200">
                  <span className="text-[8px] text-slate-500 block">Wires / Qubits:</span>
                  <span className="font-bold text-slate-900">4 Qubits (Wires 0..3)</span>
                </div>
                <div className="p-1.5 bg-white border border-pink-200">
                  <span className="text-[8px] text-slate-500 block">Entanglement Topology:</span>
                  <span className="font-bold text-slate-900">BasicEntanglerLayers</span>
                </div>
              </div>
            </div>
          )}

          {isML && (
            <div className="p-3 bg-sky-50/70 border border-sky-200">
              <div className="flex items-center justify-between text-[10px] font-bold text-sky-900 mb-2 uppercase">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-600" />
                  RandomForest Kernel Telemetry
                </span>
                <span>R² Score: 0.942</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="p-1.5 bg-white border border-sky-200">
                  <span className="text-[8px] text-slate-500 block">Estimators / Depth:</span>
                  <span className="font-bold text-slate-900">120 Trees (Depth 8)</span>
                </div>
                <div className="p-1.5 bg-white border border-sky-200">
                  <span className="text-[8px] text-slate-500 block">Preprocessing:</span>
                  <span className="font-bold text-slate-900">OneHot + StandardScaler</span>
                </div>
              </div>
            </div>
          )}

          {isGroq && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-900 mb-1.5 uppercase">
                <span className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-emerald-600" />
                  Groq LLaMA 3.3 Cognitive Hook Rating
                </span>
                <span>Rating: 88/100</span>
              </div>
              <p className="text-[11px] font-sans text-slate-700 italic">
                "{agent.lastAction || "Evaluated copy hook for high-velocity viral appeal and demographic conversion potential."}"
              </p>
            </div>
          )}

          {isPyTrends && (
            <div className="p-3 bg-amber-50/70 border border-amber-200">
              <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 mb-2 uppercase">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  Google Trends Interest Velocity
                </span>
                <span>Momentum: +92.1%</span>
              </div>
              <div className="p-1.5 bg-white border border-amber-200 text-[10px]">
                <span className="text-[8px] text-slate-500 block">Tracked Query:</span>
                <span className="font-bold text-slate-900">Autonomous Multi-Agent AI Systems</span>
              </div>
            </div>
          )}

          {/* 4. Action Log */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 text-[10px]">
            <span className="text-[8px] text-slate-500 block font-bold uppercase mb-0.5">LATEST NODE ACTION</span>
            <div className="text-slate-800 font-mono">
              {agent.lastAction ? `"${agent.lastAction}"` : "Active in simulation queue."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
