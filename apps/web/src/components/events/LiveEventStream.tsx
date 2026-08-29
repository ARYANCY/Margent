import React, { useEffect, useRef } from "react";
import { Radio, AlertTriangle, ShieldCheck, Atom, TrendingUp, Cpu, Brain, Activity } from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";
import { AgentEvent } from "@shared/types";

export const LiveEventStream: React.FC = () => {
  const events = useSimulationStore((s) => s.events);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getEventMeta = (event: AgentEvent) => {
    switch (event.type) {
      case "QML_ENTANGLEMENT":
        return {
          icon: <Atom className="w-3 h-3 text-pink-600" />,
          label: "PENNYLANE QML",
          color: "border-pink-200 bg-pink-50 text-pink-900",
          tag: "bg-pink-100 text-pink-800 border-pink-300"
        };
      case "TREND_UPDATED":
      case "PYTREND_SPIKE":
        return {
          icon: <TrendingUp className="w-3 h-3 text-amber-600" />,
          label: "PYTRENDS GOOGLE",
          color: "border-amber-200 bg-amber-50 text-amber-900",
          tag: "bg-amber-100 text-amber-800 border-amber-300"
        };
      case "COMMENT":
      case "GROQ_CRITIQUE":
        return {
          icon: <Brain className="w-3 h-3 text-emerald-600" />,
          label: "GROQ COGNITIVE",
          color: "border-emerald-200 bg-emerald-50 text-emerald-900",
          tag: "bg-emerald-100 text-emerald-800 border-emerald-300"
        };
      case "ANOMALY_DETECTED":
        return {
          icon: <AlertTriangle className="w-3 h-3 text-rose-600" />,
          label: "RISK / ANOMALY",
          color: "border-rose-200 bg-rose-50 text-rose-900",
          tag: "bg-rose-100 text-rose-800 border-rose-300"
        };
      case "ADMIN_ANALYSIS":
        return {
          icon: <ShieldCheck className="w-3 h-3 text-indigo-600" />,
          label: "ADMIN CONSENSUS",
          color: "border-indigo-200 bg-indigo-50 text-indigo-900",
          tag: "bg-indigo-100 text-indigo-800 border-indigo-300"
        };
      default:
        return {
          icon: <Cpu className="w-3 h-3 text-sky-600" />,
          label: "TRAINED ML",
          color: "border-sky-200 bg-sky-50 text-sky-900",
          tag: "bg-sky-100 text-sky-800 border-sky-300"
        };
    }
  };

  return (
    <aside className="w-full h-full bg-white border-l border-slate-200 flex flex-col select-none shadow-xs font-mono">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="w-3.5 h-3.5 text-slate-800 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
            Live Stream Feed
          </span>
        </div>
        <span className="text-[9px] font-bold text-slate-700 bg-white px-2 py-0.5 border border-slate-200">
          {events.length} SIGNALS
        </span>
      </div>

      {/* Events List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {events.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400 font-medium italic font-sans">
            Awaiting multi-modal telemetry signals...
          </div>
        ) : (
          events.slice(0, 60).map((event) => {
            const meta = getEventMeta(event);
            const message =
              event.payload?.message ||
              event.payload?.summary ||
              event.payload?.critique ||
              event.payload?.comment ||
              (event.payload?.roas ? `Model inferred predicted ROAS: ${event.payload.roas}x` : "Signal verified.");

            return (
              <div
                key={event.eventId}
                className={`p-2.5 border shadow-xs transition-all ${meta.color}`}
              >
                {/* Event Category & Timestamp */}
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider">
                    {meta.icon}
                    <span>{meta.label}</span>
                  </div>
                  <span className="text-slate-500 font-medium">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Node Dispatch Path */}
                <div className="text-[10px] font-bold text-slate-900 flex items-center justify-between">
                  <span>#{event.source}</span>
                  {event.target && <span className="text-slate-500 font-normal">→ #{event.target}</span>}
                </div>

                {/* Human-Readable Narrative Content */}
                <div className="text-[10px] text-slate-800 mt-1 font-sans leading-snug">
                  {message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
