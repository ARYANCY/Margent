import React, { useEffect } from "react";
import { useSimulationStore } from "./stores/simulationStore";
import { HeaderBar } from "./components/navbar/HeaderBar";
import { AgentGraph } from "./components/graph/AgentGraph";
import { LiveEventStream } from "./components/events/LiveEventStream";
import { SimulationControls } from "./components/controls/SimulationControls";
import { CampaignForm } from "./components/campaign/CampaignForm";
import { SlidingDashboard } from "./components/dashboard/SlidingDashboard";
import { AgentInspectorModal } from "./components/inspector/AgentInspectorModal";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

import { ReactFlowProvider } from "@xyflow/react";

export function App() {
  const initSocket = useSimulationStore((s) => s.initSocket);
  const isCampaignModalOpen = useSimulationStore((s) => s.isCampaignModalOpen);
  const setIsCampaignModalOpen = useSimulationStore((s) => s.setIsCampaignModalOpen);

  const [sidebarWidth, setSidebarWidth] = React.useState(320);
  const isResizing = React.useRef(false);

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    e.preventDefault();
  }, []);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 180 && newWidth <= 650) {
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
