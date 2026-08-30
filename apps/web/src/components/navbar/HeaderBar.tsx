import React from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Activity,
  Layers,
  Radio,
  LogOut
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
    { label: "ALL NODES (101)", role: "ALL" },
    { label: "30 ROI PREDICTORS", role: "ML", activeClass: "bg-sky-600 text-white border-sky-600 font-bold" },
    { label: "30 TREND RADARS", role: "PYTREND", activeClass: "bg-amber-600 text-white border-amber-600 font-bold" },
    { label: "30 CONTENT GRADERS", role: "GROQ", activeClass: "bg-emerald-600 text-white border-emerald-600 font-bold" },
    { label: "10 PATTERN LINKERS", role: "QML", activeClass: "bg-pink-600 text-white border-pink-600 font-bold" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("margent_authenticated");
    window.location.reload();
  };

  return (
    <header className="h-14 px-5 bg-white border-b border-slate-300 flex items-center justify-between z-40 shrink-0 select-none shadow-xs sticky top-0 font-mono">
      {/* 1. Left: Brand & Telemetry */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5">
          <span className="text-sm font-black tracking-tight text-slate-900 uppercase">
            MARGENT
          </span>
          <span className="text-[10px] text-slate-400 font-sans">|</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-200 text-[9px] font-bold text-slate-800 uppercase">
            <span className={`w-1.5 h-1.5 ${isConnected ? "bg-emerald-500 beacon-live" : "bg-rose-500"}`} />
            <span>{isConnected ? "101 NODES SYNCED" : "OFFLINE STANDBY"}</span>
          </div>
        </div>
      </div>

      {/* 2. Center: Search & Pipeline Segmented Controls */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative w-56">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents by ID/role..."
            className="w-full pl-8 pr-3 py-1 bg-slate-50 focus:bg-white border border-slate-300 focus:border-slate-800 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-50 p-0.5 border border-slate-300 gap-0.5">
          {filters.map((f) => (
            <button
              key={f.role}
              onClick={() => setFilterRole(f.role)}
              className={`px-2.5 py-1 text-[9px] font-bold tracking-tight transition border ${
                filterRole === f.role
                  ? f.activeClass || "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-transparent text-slate-700 border-transparent hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Right: Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsCampaignModalOpen(true)}
          className="px-3 py-1.5 text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 flex items-center gap-1.5 transition uppercase shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-slate-700" />
          <span>New Campaign</span>
        </button>

        <button
          onClick={() => setIsDashboardOpen(!isDashboardOpen)}
          className="px-3 py-1.5 text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition shadow-xs uppercase border border-slate-900 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
          <span>Dashboard</span>
          {adminAnalysis && (
            <span className="px-1.5 py-0.2 text-[8px] font-bold bg-indigo-500 text-white uppercase">
              {adminAnalysis.decision}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-[11px] font-bold bg-white hover:bg-rose-50 text-rose-600 border border-slate-300 flex items-center gap-1.5 transition uppercase shadow-xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
