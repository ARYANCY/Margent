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
          icon: <Atom className="w-3 h-3 text-pink-600 shrink-0" />,
          label: "QML QUANTUM",
          badge: "bg-pink-50 text-pink-800 border-pink-200 font-bold",
          accentBar: "bg-pink-500",
          activeRing: "border-pink-500 ring-2 ring-pink-100/80"
        };
      case "ml":
        return {
          icon: <Cpu className="w-3 h-3 text-sky-600 shrink-0" />,
          label: "TRAINED ML",
          badge: "bg-sky-50 text-sky-800 border-sky-200 font-bold",
          accentBar: "bg-sky-500",
          activeRing: "border-sky-500 ring-2 ring-sky-100/80"
        };
      case "groq":
        return {
          icon: <Brain className="w-3 h-3 text-emerald-600 shrink-0" />,
          label: "GROQ LLM",
          badge: "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold",
          accentBar: "bg-emerald-500",
          activeRing: "border-emerald-500 ring-2 ring-emerald-100/80"
        };
      case "pytrend":
        return {
          icon: <TrendingUp className="w-3 h-3 text-amber-600 shrink-0" />,
          label: "PYTRENDS",
          badge: "bg-amber-50 text-amber-800 border-amber-200 font-bold",
          accentBar: "bg-amber-500",
          activeRing: "border-amber-500 ring-2 ring-amber-100/80"
        };
      default:
        return {
          icon: <Shield className="w-3 h-3 text-indigo-600 shrink-0" />,
          label: "AI NODE",
          badge: "bg-slate-50 text-slate-800 border-slate-200 font-bold",
          accentBar: "bg-slate-500",
          activeRing: "border-slate-800 ring-2 ring-slate-100"
        };
    }
  };

  const meta = getPipelineMeta();

  const sentimentColor =
    agent.sentiment > 0.2
      ? "text-emerald-800 bg-emerald-50 border-emerald-200 font-bold"
      : agent.sentiment < -0.2
      ? "text-rose-800 bg-rose-50 border-rose-200 font-bold"
      : "text-slate-700 bg-slate-50 border-slate-200 font-bold";

  return (
    <div
      className={`relative w-64 h-[142px] px-3 py-2.5 bg-white flex flex-col justify-between select-none node-card ${
        isSelected
          ? "border-2 border-slate-900 shadow-md ring-2 ring-slate-200 scale-102 z-30"
          : isActive
          ? `border-2 border-slate-800 shadow-md ring-2 ${meta.activeRing} scale-101 z-20 node-card-active`
          : "border border-slate-200 hover:border-slate-400 shadow-sm"
      }`}
    >
      {/* Precision Handles */}
      <Handle type="source" position={Position.Top} id="source-top" className="!w-2 !h-2 !bg-slate-800 !border !border-white !rounded-none !-top-1 transition-transform hover:scale-125" />
      <Handle type="target" position={Position.Top} id="target-top" className="!w-2 !h-2 !bg-slate-800 !border !border-white !rounded-none !-top-1 transition-transform hover:scale-125" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="!w-2 !h-2 !bg-slate-800 !border !border-white !rounded-none !-bottom-1 transition-transform hover:scale-125" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" className="!w-2 !h-2 !bg-slate-800 !border !border-white !rounded-none !-bottom-1 transition-transform hover:scale-125" />

      {/* Left Colored Accent Bar */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${meta.accentBar} transition-all duration-300`} />

      {/* Active Pulse Tag */}
      {isActive && (
        <div className="absolute -top-2 right-2 bg-slate-900 text-white px-2 py-0.2 border border-slate-700 text-[8px] font-mono font-bold uppercase flex items-center gap-1.5 shadow-sm transition-all duration-200">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full beacon-live" />
          <span className="tracking-wider">LIVE</span>
        </div>
      )}

      {/* 1. Header: Badge + ID */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 pl-1.5">
        <div className={`flex items-center space-x-1.5 px-1.5 py-0.2 border text-[9px] font-mono uppercase transition-colors ${meta.badge}`}>
          {meta.icon}
          <span>{meta.label}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-500 tracking-tight">#{agent.agentId}</span>
      </div>

      {/* 2. Name & Role */}
      <div className="pl-1.5 min-w-0">
        <div className="text-xs font-bold text-slate-900 truncate tracking-tight uppercase leading-tight">
          {agent.name}
        </div>
        <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
          {agent.specialization || agent.roleDescription}
        </div>
      </div>

      {/* 3. Metrics Row */}
      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px] font-mono pl-1.5">
        <span className={`px-1.5 py-0.2 border ${sentimentColor}`}>
          {agent.sentiment > 0 ? `+${agent.sentiment.toFixed(2)}` : agent.sentiment.toFixed(2)}
        </span>
        <span className="px-1.5 py-0.2 bg-slate-50 text-slate-700 border border-slate-200 truncate max-w-[110px] uppercase font-bold text-[9px]">
          {agent.status}
        </span>
      </div>

      {/* 4. Action Log */}
      <div className="text-[9px] text-slate-700 truncate font-mono bg-slate-50 px-1.5 py-0.5 border border-slate-200 pl-1.5">
        {agent.lastAction ? `"${agent.lastAction}"` : "Idle standby"}
      </div>
    </div>
  );
});
