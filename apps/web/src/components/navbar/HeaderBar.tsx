import React from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Activity,
  Layers
} from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";

export const HeaderBar: React.FC = () => {
  const searchQuery = useSimulationStore((s) => s.searchQuery);
  const setSearchQuery = useSimulationStore((s) => s.setSearchQuery);
  const filterRole = useSimulationStore((s) => s.filterRole);
  const setFilterRole = useSimulationStore((s) => s.setFilterRole);
  const isDashboardOpen = useSimulationStore((s) => s.isDashboardOpen);
  const setIsDashboardOpen = useSimulationStore((s) => s.setIsDashboardOpen);
  const setIsCampaignModalOpen = useSimulationStore((s) => s.setIsCampaignModalOpen);
  const adminAnalysis = useSimulationStore((s) => s.adminAnalysis);
  const isConnected = useSimulationStore((s) => s.isConnected);

  const filters = [
    { label: "All Nodes (101)", role: "ALL" },
    { label: "ML (30)", role: "ML", activeClass: "bg-sky-50 text-sky-900 border-sky-300 font-bold" },
    { label: "PyTrends (30)", role: "PYTREND", activeClass: "bg-amber-50 text-amber-900 border-amber-300 font-bold" },
    { label: "Groq LLM (30)", role: "GROQ", activeClass: "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold" },
    { label: "QML Quantum (10)", role: "QML", activeClass: "bg-pink-50 text-pink-900 border-pink-300 font-bold" },
  ];

  return (
    <header className="h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between z-40 shrink-0 select-none shadow-sm">
      {/* 1. Left: Brand & Telemetry Indicator */}
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center">
          <Activity className="w-4 h-4" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black tracking-wider uppercase text-slate-900">MARGENT</span>
          <span className="text-slate-300">/</span>
          <span className="text-[11px] font-mono text-slate-600 font-semibold tracking-tight">Quantum-Classical Multi-Modal Engine</span>
          <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-slate-100 border border-slate-200 text-[10px] font-mono font-medium text-slate-700">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
            <span>101 NODES</span>
          </div>
        </div>
      </div>

      {/* 2. Center: Search & Pipeline Segmented Controls */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter agents by ID, role..."
            className="w-full pl-8 pr-3 py-1 bg-slate-50 hover:bg-white border border-slate-200 focus:border-slate-400 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100 border border-slate-200 p-0.5">
          {filters.map((f) => (
            <button
              key={f.role}
              onClick={() => setFilterRole(f.role)}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase transition border ${
                filterRole === f.role
                  ? f.activeClass || "bg-white text-slate-900 border-slate-300 font-bold shadow-sm"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Right: Action Buttons */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => setIsCampaignModalOpen(true)}
          className="px-3 py-1.5 text-xs font-mono font-bold bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-slate-400 flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>

        <button
          onClick={() => setIsDashboardOpen(!isDashboardOpen)}
          className="px-3.5 py-1.5 text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 flex items-center gap-2 transition shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Dashboard</span>
          {adminAnalysis && (
            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-white text-slate-900 uppercase">
              {adminAnalysis.decision}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
