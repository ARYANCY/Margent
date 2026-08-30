import React from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  LogOut,
  Home,
  FileText,
  Settings,
  Users
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
  
  // View states
  const currentView = useSimulationStore((s) => s.currentView);
  const setView = useSimulationStore((s) => s.setView);

  const filters = [
    { label: "ALL", role: "ALL" },
    { label: "ML", role: "ML", activeClass: "bg-sky-600 text-white border-sky-600 font-bold" },
    { label: "TRENDS", role: "PYTREND", activeClass: "bg-amber-600 text-white border-amber-600 font-bold" },
    { label: "LLM", role: "GROQ", activeClass: "bg-emerald-600 text-white border-emerald-600 font-bold" },
    { label: "QML", role: "QML", activeClass: "bg-pink-600 text-white border-pink-600 font-bold" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("margent_authenticated");
    window.location.reload();
  };

  const handleGoHome = () => {
    setFilterRole("ALL");
    setSearchQuery("");
    setIsDashboardOpen(false);
    setView("home");
  };

  return (
    <header className="h-14 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between z-40 shrink-0 select-none shadow-md sticky top-0 font-mono text-slate-200">
      {/* 1. Left: Brand & Navlinks */}
      <div className="flex items-center space-x-6">
        {/* Brand */}
        <div onClick={handleGoHome} className="cursor-pointer flex items-center space-x-2">
          <span className="text-sm font-black tracking-wider text-white uppercase">
            MARGENT
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1">
          <button
            onClick={handleGoHome}
            className={`px-3 py-1.5 text-xs font-bold transition rounded flex items-center gap-1.5 uppercase cursor-pointer ${
              currentView === "home" 
                ? "bg-slate-850 text-white border border-slate-700" 
                : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          
          <button
            onClick={() => setView("campaigns")}
            className={`px-3 py-1.5 text-xs font-bold transition rounded flex items-center gap-1.5 uppercase cursor-pointer ${
              currentView === "campaigns" 
                ? "bg-slate-850 text-white border border-slate-700" 
                : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Campaigns</span>
          </button>

          <button
            onClick={() => setView("manage-agents")}
            className={`px-3 py-1.5 text-xs font-bold transition rounded flex items-center gap-1.5 uppercase cursor-pointer ${
              currentView === "manage-agents" 
                ? "bg-slate-850 text-white border border-slate-700" 
                : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Agents</span>
          </button>

          <button
            onClick={() => setView("dashboard")}
            className={`px-3 py-1.5 text-xs font-bold transition rounded flex items-center gap-1.5 uppercase cursor-pointer ${
              currentView === "dashboard" 
                ? "bg-slate-850 text-white border border-slate-700" 
                : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Dashboard</span>
            {adminAnalysis && (
              <span className="px-1 py-0.2 text-[8px] font-mono bg-indigo-500 text-white rounded">
                {adminAnalysis.decision}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* 2. Center: Search & Pipeline Filters (only shown on Home view) */}
      <div className="flex items-center space-x-4">
        {currentView === "home" && (
          <>
            {/* Search */}
            <div className="relative w-44">
              <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search swarm..."
                className="w-full pl-7 pr-3 py-1 bg-slate-900 focus:bg-slate-800 border border-slate-800 focus:border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition rounded"
              />
            </div>

            {/* Filter Segmented Buttons */}
            <div className="flex items-center bg-slate-900 p-0.5 border border-slate-800 rounded gap-0.5">
              {filters.map((f) => (
                <button
                  key={f.role}
                  onClick={() => setFilterRole(f.role)}
                  className={`px-2 py-0.5 text-[9px] font-bold tracking-tight transition rounded-sm ${
                    filterRole === f.role
                      ? f.activeClass || "bg-slate-800 text-white shadow-xs"
                      : "bg-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 3. Right: Authentication Status */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsCampaignModalOpen(true)}
          className="px-3 py-1 text-xs font-bold bg-white hover:bg-slate-100 text-slate-950 flex items-center gap-1.5 transition rounded uppercase cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>

        <button
          onClick={handleLogout}
          className="px-3 py-1 text-xs font-bold bg-transparent hover:bg-rose-950/20 text-rose-500 hover:text-rose-400 border border-rose-950 hover:border-rose-900 flex items-center gap-1.5 transition rounded uppercase cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
