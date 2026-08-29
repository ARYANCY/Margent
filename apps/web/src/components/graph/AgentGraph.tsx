import React, { useMemo, useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  BackgroundVariant,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSimulationStore } from "../../stores/simulationStore";
import { AgentNode } from "./AgentNode";
import { AdminNode } from "./AdminNode";
import { Shuffle, Grid } from "lucide-react";

const nodeTypes = {
  agentNode: AgentNode,
  adminNode: AdminNode
};

export const AgentGraph: React.FC = () => {
  const agents = useSimulationStore((s) => s.agents);
  const activeAgentIds = useSimulationStore((s) => s.activeAgentIds);
  const activeEdges = useSimulationStore((s) => s.activeEdges);
  const adminAnalysis = useSimulationStore((s) => s.adminAnalysis);
  const selectedAgentId = useSimulationStore((s) => s.selectedAgentId);
  const setSelectedAgentId = useSimulationStore((s) => s.setSelectedAgentId);
  const searchQuery = useSimulationStore((s) => s.searchQuery);
  const filterRole = useSimulationStore((s) => s.filterRole);

  const [isRandomLayout, setIsRandomLayout] = useState(false);

  const agentsList = useMemo(() => Object.values(agents), [agents]);

  // Symmetrical Grid Geometry
  const CARD_WIDTH = 256;
  const CARD_HEIGHT = 142;
  const COL_GAP = 24;
  const ROW_GAP = 24;
  const SECTION_GAP = 72;
  const START_Y = 360;
  const ADMIN_WIDTH = 420;
  const COL_PITCH = CARD_WIDTH + COL_GAP; // 280px
  const ROW_PITCH = CARD_HEIGHT + ROW_GAP; // 166px

  // Compute Layout
  const nodes: Node[] = useMemo(() => {
    const calculatedNodes: Node[] = [];
    if (agentsList.length === 0) return [];

    const filtered = agentsList.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.agentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.specialization && a.specialization.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchRole = filterRole === "ALL" || a.type === filterRole.toLowerCase();
      return matchSearch && matchRole;
    });

    // Section Coordinates
    const sec1_X = 60;
    const sec1_width = 3 * CARD_WIDTH + 2 * COL_GAP;
    
    const sec2_X = sec1_X + sec1_width + SECTION_GAP;
    const sec2_width = 3 * CARD_WIDTH + 2 * COL_GAP;
    
    const sec3_X = sec2_X + sec2_width + SECTION_GAP;
    const sec3_width = 3 * CARD_WIDTH + 2 * COL_GAP;
    
    const sec4_X = sec3_X + sec3_width + SECTION_GAP;
    const sec4_width = 2 * CARD_WIDTH + 1 * COL_GAP;
    const grid_total_end_X = sec4_X + sec4_width;

    const grid_midpoint_X = (sec1_X + grid_total_end_X) / 2;
    const admin_X = grid_midpoint_X - ADMIN_WIDTH / 2;

    // Admin Master Node
    const admin = agentsList.find((a) => a.type === "admin");
    if (admin) {
      calculatedNodes.push({
        id: admin.agentId,
        type: "adminNode",
        position: isRandomLayout ? { x: 1450, y: 40 } : { x: admin_X, y: 60 },
        data: {
          agent: admin,
          adminAnalysis,
          isActive: activeAgentIds.length > 0
        }
      });
    }

    if (isRandomLayout) {
      const nonAdmin = filtered.filter((a) => a.type !== "admin");
      nonAdmin.forEach((a, index) => {
        const seed = a.agentId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const angle = (index / nonAdmin.length) * 2 * Math.PI + (seed % 10) * 0.1;
        const radius = 380 + ((seed * 17) % 650);
        const x = grid_midpoint_X + radius * Math.cos(angle) + ((seed * 7) % 90);
        const y = 700 + (radius * 0.75) * Math.sin(angle) + ((seed * 11) % 70);

        calculatedNodes.push({
          id: a.agentId,
          type: "agentNode",
          position: { x, y },
          data: {
            agent: a,
            isActive: activeAgentIds.includes(a.agentId),
            isSelected: selectedAgentId === a.agentId
          }
        });
      });
    } else {
      // 1. 30 ML Agents (3 cols x 10 rows)
      const mlAgents = filtered.filter((a) => a.type === "ml");
      mlAgents.forEach((a, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        calculatedNodes.push({
          id: a.agentId,
          type: "agentNode",
          position: {
            x: sec1_X + col * COL_PITCH,
            y: START_Y + row * ROW_PITCH
          },
          data: {
            agent: a,
            isActive: activeAgentIds.includes(a.agentId),
            isSelected: selectedAgentId === a.agentId
          }
        });
      });

      // 2. 30 PyTrends Agents (3 cols x 10 rows)
      const pytrendAgents = filtered.filter((a) => a.type === "pytrend");
      pytrendAgents.forEach((a, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        calculatedNodes.push({
          id: a.agentId,
          type: "agentNode",
          position: {
            x: sec2_X + col * COL_PITCH,
            y: START_Y + row * ROW_PITCH
          },
          data: {
            agent: a,
            isActive: activeAgentIds.includes(a.agentId),
            isSelected: selectedAgentId === a.agentId
          }
        });
      });

      // 3. 30 Groq Agents (3 cols x 10 rows)
      const groqAgents = filtered.filter((a) => a.type === "groq");
      groqAgents.forEach((a, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        calculatedNodes.push({
          id: a.agentId,
          type: "agentNode",
          position: {
            x: sec3_X + col * COL_PITCH,
            y: START_Y + row * ROW_PITCH
          },
          data: {
            agent: a,
            isActive: activeAgentIds.includes(a.agentId),
            isSelected: selectedAgentId === a.agentId
          }
        });
      });

      // 4. 10 QML Quantum Agents (2 cols x 5 rows)
      const qmlAgents = filtered.filter((a) => a.type === "qml");
      qmlAgents.forEach((a, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        calculatedNodes.push({
          id: a.agentId,
          type: "agentNode",
          position: {
            x: sec4_X + col * COL_PITCH,
            y: START_Y + row * ROW_PITCH
          },
          data: {
            agent: a,
            isActive: activeAgentIds.includes(a.agentId),
            isSelected: selectedAgentId === a.agentId
          }
        });
      });
    }

    return calculatedNodes;
  }, [agentsList, activeAgentIds, activeEdges, adminAnalysis, selectedAgentId, searchQuery, filterRole, isRandomLayout]);

  // Compute Sleek Flowing Stream Threads
  const edges: Edge[] = useMemo(() => {
    const edgeList: Edge[] = [];

    // Structural Hub Lines
    const structuralHubs = [
      { id: "ml_001", color: "#BAE6FD" },
      { id: "ml_002", color: "#BAE6FD" },
      { id: "ml_003", color: "#BAE6FD" },
      { id: "pytrend_001", color: "#FDE68A" },
      { id: "pytrend_002", color: "#FDE68A" },
      { id: "pytrend_003", color: "#FDE68A" },
      { id: "groq_001", color: "#A7F3D0" },
      { id: "groq_002", color: "#A7F3D0" },
      { id: "groq_003", color: "#A7F3D0" },
      { id: "qml_001", color: "#FBCFE8" },
      { id: "qml_002", color: "#FBCFE8" }
    ];

    structuralHubs.forEach((hub) => {
      edgeList.push({
        id: `e-struct-${hub.id}-admin`,
        source: hub.id,
        target: "admin_001",
        type: "smoothstep",
        style: { stroke: hub.color, strokeWidth: 1.5, opacity: 0.6 }
      });
    });

    // Active Animated Simulation Edges (Flowing dashed pulse paths)
    activeAgentIds.forEach((agentId, idx) => {
      if (agentId === "admin_001") return;

      const isML = agentId.startsWith("ml_");
      const isPyTrend = agentId.startsWith("pytrend_");
      const isGroq = agentId.startsWith("groq_");
      const isQML = agentId.startsWith("qml_");

      const edgeColor = isML
        ? "#0284C7"
        : isPyTrend
        ? "#D97706"
        : isGroq
        ? "#059669"
        : isQML
        ? "#DB2777"
        : "#0F172A";

      const className = isML
        ? "edge-active-ml"
        : isPyTrend
        ? "edge-active-pytrend"
        : isGroq
        ? "edge-active-groq"
        : isQML
        ? "edge-active-qml"
        : "";

      edgeList.push({
        id: `e-active-${agentId}-admin-${idx}`,
        source: agentId,
        target: "admin_001",
        animated: true,
        type: "smoothstep",
        className,
        style: {
          stroke: edgeColor,
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 9,
          height: 9
        }
      });
    });

    return edgeList;
  }, [activeAgentIds, activeEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedAgentId(node.id);
  }, [setSelectedAgentId]);

  return (
    <div className="w-full h-full relative bg-slate-50 overflow-hidden">
      {/* Layout Toggle Button Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center border border-slate-200 bg-white/95 backdrop-blur shadow-sm p-0.5 gap-1 transition-all">
        <button
          onClick={() => setIsRandomLayout(false)}
          className={`px-2.5 py-1 text-[11px] font-mono font-bold flex items-center gap-1.5 uppercase transition border ${
            !isRandomLayout
              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
              : "bg-white text-slate-700 border-transparent hover:bg-slate-100"
          }`}
        >
          <Grid className="w-3 h-3" />
          <span>Pipeline Grid</span>
        </button>
        <button
          onClick={() => setIsRandomLayout(true)}
          className={`px-2.5 py-1 text-[11px] font-mono font-bold flex items-center gap-1.5 uppercase transition border ${
            isRandomLayout
              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
              : "bg-white text-slate-700 border-transparent hover:bg-slate-100"
          }`}
        >
          <Shuffle className="w-3 h-3" />
          <span>Random Scatter</span>
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
      >
        <Background color="#CBD5E1" gap={20} size={1} variant={BackgroundVariant.Dots} />
        <Controls position="bottom-left" />
        <MiniMap
          nodeColor={(n) => {
            if (n.id === "admin_001") return "#6366F1";
            if (n.id.startsWith("ml_")) return "#0284C7";
            if (n.id.startsWith("pytrend_")) return "#D97706";
            if (n.id.startsWith("groq_")) return "#059669";
            if (n.id.startsWith("qml_")) return "#DB2777";
            return "#64748B";
          }}
          maskColor="rgba(248, 250, 252, 0.75)"
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
};
