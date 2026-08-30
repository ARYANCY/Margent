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

import { ReactFlowProvider } from "@xyflow/react";

export function App() {
  const initSocket = useSimulationStore((s) => s.initSocket);
  const isCampaignModalOpen = useSimulationStore((s) => s.isCampaignModalOpen);
  const setIsCampaignModalOpen = useSimulationStore((s) => s.setIsCampaignModalOpen);

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
    }
  }, [initSocket, isAuthenticated]);

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
      <div className="flex flex-col h-screen w-screen bg-slate-50 overflow-hidden select-none">
        {/* Header Bar */}
        <HeaderBar />

        {/* Main Graph & Event Stream Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* 101-Node React Flow Graph Canvas */}
          <div className="flex-1 h-full relative">
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
            className="w-1.5 h-full hover:bg-slate-400 cursor-col-resize active:bg-slate-600 transition-colors z-30 select-none shrink-0"
            style={{
              borderLeft: "1px solid #E2E8F0"
            }}
          />

          {/* Right Event Stream Column */}
          <div 
            className="h-full shrink-0"
            style={{ width: `${sidebarWidth}px` }}
          >
            <LiveEventStream />
          </div>
        </div>

        {/* Right Side GSAP-Animated Sliding Dashboard Drawer */}
        <SlidingDashboard />

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

