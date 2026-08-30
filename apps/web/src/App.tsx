import React, { useEffect, useState } from "react";
import { useSimulationStore } from "./stores/simulationStore";
import { HeaderBar } from "./components/navbar/HeaderBar";
import { AgentGraph } from "./components/graph/AgentGraph";
import { LiveEventStream } from "./components/events/LiveEventStream";
import { SimulationControls } from "./components/controls/SimulationControls";
import { CampaignForm } from "./components/campaign/CampaignForm";
import { SlidingDashboard } from "./components/dashboard/SlidingDashboard";
import { AgentInspectorModal } from "./components/inspector/AgentInspectorModal";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { LoginScreen } from "./components/auth/LoginScreen";
import { SwarmManagerCRUD } from "./components/dashboard/SwarmManagerCRUD";
import { Plus, Trash2 } from "lucide-react";

import { ReactFlowProvider } from "@xyflow/react";

export function App() {
  const initSocket = useSimulationStore((s) => s.initSocket);
  const isCampaignModalOpen = useSimulationStore((s) => s.isCampaignModalOpen);
  const setIsCampaignModalOpen = useSimulationStore((s) => s.setIsCampaignModalOpen);
  const currentView = useSimulationStore((s) => s.currentView);
  const campaigns = useSimulationStore((s) => s.campaigns);
  const loadInitialData = useSimulationStore((s) => s.loadInitialData);

  const handleActivateCampaign = async (campaignId: string) => {
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:4000`;
      const res = await fetch(`${apiUrl}/api/campaigns/${campaignId}/activate`, {
        method: "POST"
      });
      if (res.ok) {
        // Reload simulation data to update active status
        await loadInitialData();
        // Redirect to dashboard view
        useSimulationStore.getState().setView("dashboard");
      }
    } catch (e) {
      console.error("Failed to activate campaign", e);
    }
  };

  const handleUpdateStatus = async (e: React.MouseEvent, campaignId: string, status: "ACTIVE" | "PAUSED" | "REJECTED") => {
    e.stopPropagation(); // Avoid activating the campaign on click!
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:4000`;
      const res = await fetch(`${apiUrl}/api/campaigns/${campaignId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await loadInitialData();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("margent_authenticated") === "true";
  });

  const [sidebarWidth, setSidebarWidth] = React.useState(320);
  const isResizing = React.useRef(false);

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    e.preventDefault();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 240 && newWidth <= 520) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      initSocket();
      loadInitialData();
    }
  }, [initSocket, isAuthenticated, loadInitialData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      const store = useSimulationStore.getState();

      if (e.code === "Space") {
        e.preventDefault();
        if (store.simulationStatus === "RUNNING") {
          store.pauseSimulation();
        } else {
          store.startSimulation();
        }
      } else if (e.key === ".") {
        e.preventDefault();
        store.stepSimulation();
      } else if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        store.setIsDashboardOpen(!store.isDashboardOpen);
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        store.setIsCampaignModalOpen(!store.isCampaignModalOpen);
      } else if (e.key === "1") {
        store.setSpeed(1.0);
      } else if (e.key === "2") {
        store.setSpeed(2.0);
      } else if (e.key === "5") {
        store.setSpeed(5.0);
      } else if (e.key === "Escape") {
        store.setIsCampaignModalOpen(false);
        store.setIsDashboardOpen(false);
        store.setSelectedAgentId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden select-none">
        {/* Header Bar */}
        <HeaderBar />

        {/* Dynamic Workspace based on currentView */}
        {currentView === "home" ? (
          <div className="flex-1 flex overflow-hidden relative">
            {/* 101-Node React Flow Graph Canvas */}
            <div className="flex-1 h-full relative bg-slate-950">
              <ReactFlowProvider>
                <AgentGraph sidebarWidth={sidebarWidth} />
              </ReactFlowProvider>

              {/* Floating Bottom Center Simulation Controls */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                <SimulationControls />
              </div>
            </div>

            {/* Resizer Handle */}
            <div
              onMouseDown={startResizing}
              className="w-1.5 h-full bg-slate-800 hover:bg-slate-700 cursor-col-resize active:bg-slate-600 transition-colors z-30 select-none shrink-0"
              style={{
                borderLeft: "1px solid #1E293B"
              }}
            />

            {/* Right Event Stream Column */}
            <div 
              className="h-full shrink-0 bg-slate-950"
              style={{ width: `${sidebarWidth}px` }}
            >
              <LiveEventStream />
            </div>
          </div>
        ) : currentView === "manage-agents" ? (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50 text-slate-900">
            <div className="max-w-6xl mx-auto bg-white border border-slate-200 p-6 shadow-md rounded-lg">
              <h2 className="text-sm font-mono font-black uppercase tracking-wider text-slate-900 mb-6 border-b border-slate-200 pb-3">
                🛡️ Swarm Core Control & CRUD Panel
              </h2>
              <SwarmManagerCRUD />
            </div>
          </div>
        ) : currentView === "dashboard" ? (
          <div className="flex-1 overflow-hidden relative bg-white">
            <SlidingDashboard />
          </div>
        ) : (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50 text-slate-900">
            <div className="max-w-6xl mx-auto bg-white border border-slate-200 p-6 shadow-md rounded-lg">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
                <h2 className="text-sm font-mono font-black uppercase tracking-wider text-slate-900">
                  📢 Dispatched Campaigns History
                </h2>
                <button
                  onClick={() => setIsCampaignModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 rounded transition uppercase shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-300" />
                  <span>New Campaign</span>
                </button>
              </div>

              {campaigns.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded text-slate-400 font-sans text-xs">
                  No active campaigns dispatched. Click "New Campaign" to launch one!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((c: any) => (
                    <div 
                      key={c.campaignId} 
                      onClick={() => handleActivateCampaign(c.campaignId)}
                      className="p-4 border border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-400 hover:shadow-xs transition-all rounded-lg flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-black text-slate-900 text-xs">{c.campaignName}</span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] uppercase font-bold rounded">{c.channel}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-sans mt-2 leading-relaxed">"{c.caption}"</p>
                        <div className="grid grid-cols-4 gap-2 border-t border-slate-200 pt-3 mt-3 text-center">
                          <div>
                            <span className="text-[8px] uppercase font-mono text-slate-400 block">Spend</span>
                            <span className="font-bold text-[11px] text-slate-855">${c.spend.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase font-mono text-slate-400 block">Clicks</span>
                            <span className="font-bold text-[11px] text-slate-855">{c.clicks}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase font-mono text-slate-400 block">Convs</span>
                            <span className="font-bold text-[11px] text-slate-855">{c.conversions}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase font-mono text-slate-400 block">ROAS</span>
                            <span className="font-bold text-[11px] text-indigo-600">{c.roas}x</span>
                          </div>
                        </div>

                        {/* Approve & Reject Options */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
                          <span className="text-[9px] font-mono text-slate-400 uppercase">
                            Status: <strong className={c.status === "ACTIVE" ? "text-emerald-600" : "text-rose-600"}>{c.status}</strong>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleUpdateStatus(e, c.campaignId, "ACTIVE")}
                              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded border transition cursor-pointer ${
                                c.status === "ACTIVE" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleUpdateStatus(e, c.campaignId, "PAUSED")}
                              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded border transition cursor-pointer ${
                                c.status === "PAUSED"
                                  ? "bg-rose-50 text-rose-700 border-rose-300"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Side GSAP-Animated Sliding Dashboard Drawer (only when not in full-page dashboard mode) */}
        {currentView !== "dashboard" && <SlidingDashboard />}

        {/* Campaign Post Creation Modal */}
        {isCampaignModalOpen && (
          <CampaignForm onClose={() => setIsCampaignModalOpen(false)} />
        )}

        {/* On-Click Agent Inspector Modal */}
        <AgentInspectorModal />
      </div>
    </ErrorBoundary>
  );
}

export default App;

