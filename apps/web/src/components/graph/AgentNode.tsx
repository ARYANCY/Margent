import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { AgentProfile } from "@shared/types";
import { Cpu, TrendingUp, Brain, Atom, Shield } from "lucide-react";

interface AgentNodeProps {
  data: {
    agent: AgentProfile;
    isActive: boolean;
    isSelected: boolean;
  };
}

export const AgentNode = memo(({ data }: AgentNodeProps) => {
  const { agent, isActive, isSelected } = data;

  const getPipelineMeta = () => {
    switch (agent.type) {
      case "qml":
        return {
          icon: <Atom className="w-3.5 h-3.5 text-pink-500 shrink-0" />,
          label: "Quantum",
          badge: "bg-pink-50 text-pink-700 border-pink-100",
          accentBar: "bg-pink-500",
          activeColor: "border-pink-500 ring-4 ring-pink-100"
        };
      case "ml":
        return {
          icon: <Cpu className="w-3.5 h-3.5 text-sky-500 shrink-0" />,
          label: "ML Model",
          badge: "bg-sky-50 text-sky-750 border-sky-100",
          accentBar: "bg-sky-500",
          activeColor: "border-sky-500 ring-4 ring-sky-100"
        };
      case "groq":
        return {
          icon: <Brain className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
          label: "Cognitive",
          badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
          accentBar: "bg-emerald-500",
          activeColor: "border-emerald-500 ring-4 ring-emerald-100"
        };
      case "pytrend":
        return {
          icon: <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
          label: "PyTrends",
          badge: "bg-amber-50 text-amber-700 border-amber-100",
          accentBar: "bg-amber-500",
          activeColor: "border-amber-500 ring-4 ring-amber-100"
        };
      default:
        return {
          icon: <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
          label: "Node",
          badge: "bg-slate-50 text-slate-700 border-slate-100",
          accentBar: "bg-slate-500",
          activeColor: "border-slate-800 ring-4 ring-slate-100"
        };
    }
  };

  const meta = getPipelineMeta();

  const sentimentColor =
    agent.sentiment > 0.2
      ? "text-emerald-700 bg-emerald-50 border-emerald-150"
      : agent.sentiment < -0.2
      ? "text-rose-700 bg-rose-50 border-rose-150"
      : "text-slate-600 bg-slate-50 border-slate-150";

  return (
    <div
      className={`relative w-64 h-[126px] px-3.5 py-3 bg-white flex flex-col justify-between select-none transition-all duration-200 rounded-2xl ${
        isSelected
          ? "border-2 border-slate-900 shadow-lg ring-4 ring-slate-100 scale-102 z-30"
          : isActive
          ? `border-2 border-slate-850 shadow-md ring-4 ${meta.activeColor} scale-101 z-20`
          : "border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm"
      }`}
    >
      {/* Handles */}
      <Handle type="source" position={Position.Top} id="source-top" className="!w-2 !h-2 !bg-slate-400 !border-0 !rounded-full !-top-1" />
      <Handle type="target" position={Position.Top} id="target-top" className="!w-2 !h-2 !bg-slate-400 !border-0 !rounded-full !-top-1" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="!w-2 !h-2 !bg-slate-400 !border-0 !rounded-full !-bottom-1" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" className="!w-2 !h-2 !bg-slate-400 !border-0 !rounded-full !-bottom-1" />

      {/* Left Accent Stripe */}
      <div className={`absolute top-3 left-0 bottom-3 w-1 rounded-r-full ${meta.accentBar}`} />

      {/* Active Pulse Tag */}
      {isActive && (
        <div className="absolute -top-2.5 right-3 bg-slate-900 text-white px-2 py-0.5 rounded-full text-[8px] font-bold uppercase flex items-center gap-1 shadow-sm border border-slate-800">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span>Active</span>
        </div>
      )}

      {/* 1. Header: Badge + ID */}
      <div className="flex items-center justify-between pb-1 pl-1">
        <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-semibold border ${meta.badge}`}>
          {meta.icon}
          <span>{meta.label}</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-450 font-mono">#{agent.agentId}</span>
      </div>

      {/* 2. Name & Role */}
      <div className="pl-1 min-w-0">
        <div className="text-xs font-bold text-slate-800 truncate tracking-tight uppercase leading-tight">
          {agent.name}
        </div>
        <div className="text-[10px] text-slate-400 truncate mt-0.5">
          {agent.specialization || agent.roleDescription}
        </div>
      </div>

      {/* 3. Metrics Row */}
      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 pl-1">
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${sentimentColor}`}>
          Sentiment: {agent.sentiment > 0 ? `+${agent.sentiment.toFixed(2)}` : agent.sentiment.toFixed(2)}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200/60 truncate max-w-[120px] font-bold text-[9px] uppercase">
          {agent.status}
        </span>
      </div>
    </div>
  );
});
