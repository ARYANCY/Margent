import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { AgentProfile, AdminAnalysis } from "@shared/types";
import { ShieldCheck, Activity, Zap } from "lucide-react";

interface AdminNodeProps {
  data: {
    agent: AgentProfile;
    adminAnalysis?: AdminAnalysis;
    isActive: boolean;
  };
}

export const AdminNode = memo(({ data }: AdminNodeProps) => {
  const { agent, adminAnalysis, isActive } = data;

  const decisionBadgeColor =
    adminAnalysis?.decision === "SCALE"
      ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs"
      : adminAnalysis?.decision === "STOP"
      ? "bg-rose-50 text-rose-800 border-rose-300 font-bold shadow-xs"
      : adminAnalysis?.decision === "INVESTIGATE"
      ? "bg-amber-50 text-amber-800 border-amber-300 font-bold shadow-xs"
      : "bg-slate-50 text-slate-800 border-slate-300 font-bold shadow-xs";

  return (
    <div className={`relative px-5 py-4 bg-white border-2 border-slate-800 shadow-xl w-[420px] select-none transition-all duration-300 ${
      isActive ? "ring-4 ring-indigo-100/80 scale-101" : ""
    }`}>
      {/* Precision Handles */}
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-slate-800 !border !border-white !rounded-none" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" className="!w-2.5 !h-2.5 !bg-slate-800 !border !border-white !rounded-none !-bottom-1.5" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="!w-2.5 !h-2.5 !bg-slate-800 !border !border-white !rounded-none !-bottom-1.5" />

      {/* Synthesis Active Pulse Tag */}
      {isActive && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2.5 py-0.2 border border-slate-700 text-[8px] font-mono font-bold uppercase flex items-center gap-1.5 tracking-wider shadow-sm animate-pulse">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full beacon-live" />
          <span>SYNTHESIZING MULTI-MODAL STREAM</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">MASTER ORCHESTRATOR</span>
            <h3 className="text-xs font-black tracking-tight text-slate-900 uppercase">{agent.name}</h3>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-slate-100 border border-slate-200 text-slate-800 tracking-wider">
          ADMIN #001
        </span>
      </div>

      {/* Consensus Decision */}
      <div className="p-2.5 bg-slate-50 border border-slate-200 mb-2.5 transition-colors">
        <div className="flex items-center justify-between mb-1 text-[10px] font-mono">
          <span className="text-slate-600 font-bold uppercase">Consensus Decision:</span>
          <span className={`px-2 py-0.2 uppercase tracking-wider text-[10px] border transition-all ${decisionBadgeColor}`}>
            {adminAnalysis?.decision || "SCALE"}
          </span>
        </div>
        <p className="text-xs text-slate-800 font-medium leading-snug">
          {adminAnalysis?.summary || "Synthesizing 30 ML, 30 PyTrends, 30 Groq, and 10 PennyLane QML nodes into unified Bayesian consensus."}
        </p>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 text-center font-mono">
        <div className="p-1.5 bg-slate-50 border border-slate-200 transition hover:border-slate-300">
          <span className="text-slate-500 block text-[8px] font-bold uppercase">ROAS</span>
          <span className="font-bold text-slate-900 text-xs">{adminAnalysis?.simulatedRoas || 3.85}x</span>
        </div>
        <div className="p-1.5 bg-slate-50 border border-slate-200 transition hover:border-slate-300">
          <span className="text-slate-500 block text-[8px] font-bold uppercase">CONFIDENCE</span>
          <span className="font-bold text-slate-900 text-xs">
            {adminAnalysis ? `${Math.round(adminAnalysis.confidence * 100)}%` : "91%"}
          </span>
        </div>
        <div className="p-1.5 bg-slate-50 border border-slate-200 transition hover:border-slate-300">
          <span className="text-slate-500 block text-[8px] font-bold uppercase">TOTAL NODES</span>
          <span className="font-bold text-slate-900 text-xs">101</span>
        </div>
      </div>
    </div>
  );
});
