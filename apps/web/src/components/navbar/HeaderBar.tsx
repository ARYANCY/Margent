import React from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Activity
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
    { label: "All Nodes", role: "ALL" },
    { label: "ML", role: "ML", activeClass: "bg-sky-500 text-white shadow-sm font-semibold" },
    { label: "PyTrends", role: "PYTREND", activeClass: "bg-amber-500 text-white shadow-sm font-semibold" },
    { label: "Groq LLM", role: "GROQ", activeClass: "bg-emerald-500 text-white shadow-sm font-semibold" },
    { label: "QML Quantum", role: "QML", activeClass: "bg-pink-500 text-white shadow-sm font-semibold" },
  ];

  return (
    <header className="h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between z-40 shrink-0 select-none shadow-xs sticky top-0">
      {/* 1. Left: Brand & Telemetry */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center rounded-xl shadow-md shadow-indigo-200">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 bg-clip-text text-transparent">
            Margent
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-700">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
            <span>101 Nodes Active</span>
          </div>
        </div>
      </div>

      {/* 2. Center: Search & Pipeline Segmented Controls */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500/70 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition shadow-inner"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-full border border-slate-200/50">
          {filters.map((f) => (
            <button
              key={f.role}
              onClick={() => setFilterRole(f.role)}
              className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-tight transition-all duration-200 ${
                filterRole === f.role
                  ? f.activeClass || "bg-white text-slate-800 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Right: Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsCampaignModalOpen(true)}
          className="px-4 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full flex items-center gap-1.5 transition-all shadow-xs hover:border-slate-300"
        >
          <Plus className="w-4 h-4 text-slate-500" />
          <span>New Campaign</span>
        </button>

        <button
          onClick={() => setIsDashboardOpen(!isDashboardOpen)}
          className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-850 text-white rounded-full flex items-center gap-2 transition-all shadow-md shadow-slate-900/10"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-300" />
          <span>Dashboard</span>
          {adminAnalysis && (
            <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-indigo-500 text-white uppercase tracking-wider">
              {adminAnalysis.decision}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
