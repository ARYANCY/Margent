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
      ? "bg-emerald-500 text-white shadow-sm font-bold"
      : adminAnalysis?.decision === "STOP"
      ? "bg-rose-500 text-white shadow-sm font-bold"
      : adminAnalysis?.decision === "INVESTIGATE"
      ? "bg-amber-500 text-white shadow-sm font-bold"
      : "bg-slate-500 text-white shadow-sm font-bold";

  return (
    <div className="relative px-6 py-5 bg-white/95 backdrop-blur border border-slate-200 shadow-xl rounded-2xl w-[420px] select-none">
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-400 !border-0 !rounded-full" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" className="!w-2 !h-2 !bg-slate-400 !border-0 !rounded-full" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="!w-2 !h-2 !bg-slate-400 !border-0 !rounded-full" />

      {/* Header Badge */}
      {isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-0.5 rounded-full text-[8px] font-bold uppercase flex items-center gap-1.5 tracking-wider shadow-md border border-slate-800">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span>Synthesizing Multi-Modal Stream</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center rounded-lg shadow-md shadow-indigo-100">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider block">Master Orchestrator</span>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-800 uppercase">{agent.name}</h3>
          </div>
        </div>
        <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-slate-100 text-slate-600 tracking-wider">
          Admin #001
        </span>
      </div>

      {/* Consensus Decision */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3">
        <div className="flex items-center justify-between mb-1.5 text-xs font-semibold">
          <span className="text-slate-600 font-bold uppercase tracking-wider text-[10px]">Consensus:</span>
          <span className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[9px] ${decisionBadgeColor}`}>
            {adminAnalysis?.decision || "SCALE"}
          </span>
        </div>
        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          {adminAnalysis?.summary || "Synthesizing 30 ML, 30 PyTrends, 30 Groq, and 10 PennyLane QML nodes into unified Bayesian consensus."}
        </p>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Consensus ROAS</span>
          <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{adminAnalysis?.simulatedRoas || 3.85}x</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Confidence</span>
          <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
            {adminAnalysis ? `${Math.round(adminAnalysis.confidence * 100)}%` : "91%"}
          </span>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Total Nodes</span>
          <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">101</span>
        </div>
      </div>
    </div>
  );
});
