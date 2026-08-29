import React, { useEffect } from "react";
import { useSimulationStore } from "./stores/simulationStore";
import { HeaderBar } from "./components/navbar/HeaderBar";
import { AgentGraph } from "./components/graph/AgentGraph";
import { LiveEventStream } from "./components/events/LiveEventStream";
import { SimulationControls } from "./components/controls/SimulationControls";
import { CampaignForm } from "./components/campaign/CampaignForm";
import { SlidingDashboard } from "./components/dashboard/SlidingDashboard";
import { AgentInspectorModal } from "./components/inspector/AgentInspectorModal";

export function App() {
  const initSocket = useSimulationStore((s) => s.initSocket);
  const isCampaignModalOpen = useSimulationStore((s) => s.isCampaignModalOpen);
  const setIsCampaignModalOpen = useSimulationStore((s) => s.setIsCampaignModalOpen);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden select-none">
      {/* Header Bar */}
      <HeaderBar />

      {/* Main Graph & Event Stream Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 101-Node React Flow Graph Canvas */}
        <div className="flex-1 h-full relative">
          <AgentGraph />

          {/* Floating Bottom Center Simulation Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <SimulationControls />
          </div>
        </div>

        {/* Right Event Stream Column */}
        <div className="w-80 h-full shrink-0">
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
  );
}

export default App;
