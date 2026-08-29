import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  BackgroundVariant,
  MarkerType,
  useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSimulationStore } from "../../stores/simulationStore";
import { AgentNode } from "./AgentNode";
import { AdminNode } from "./AdminNode";
import { Share2, Grid } from "lucide-react";

const nodeTypes = {
  agentNode: AgentNode,
  adminNode: AdminNode
};

interface AgentGraphProps {
  sidebarWidth?: number;
}

export const AgentGraph: React.FC<AgentGraphProps> = ({ sidebarWidth = 320 }) => {
  const agents = useSimulationStore((s) => s.agents);
  const activeAgentIds = useSimulationStore((s) => s.activeAgentIds);
  const activeEdges = useSimulationStore((s) => s.activeEdges);
  const adminAnalysis = useSimulationStore((s) => s.adminAnalysis);
  const selectedAgentId = useSimulationStore((s) => s.selectedAgentId);
  const setSelectedAgentId = useSimulationStore((s) => s.setSelectedAgentId);
  const searchQuery = useSimulationStore((s) => s.searchQuery);
  const filterRole = useSimulationStore((s) => s.filterRole);

  const [isWebMeshLayout, setIsWebMeshLayout] = useState(false);

  const { fitView } = useReactFlow();

  const agentsList = useMemo(() => Object.values(agents), [agents]);

  // Card Geometry
  const CARD_WIDTH = 256;
  const CARD_HEIGHT = 142;
  const COL_GAP = 24;
  const ROW_GAP = 24;
  const SECTION_GAP = 72;
  const START_Y = 360;
  const ADMIN_WIDTH = 420;
  const COL_PITCH = CARD_WIDTH + COL_GAP; // 280px
  const ROW_PITCH = CARD_HEIGHT + ROW_GAP; // 166px

  // Compute Layout Nodes
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

    // Section Coordinates for Pipeline Grid
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
    const admin_grid_X = grid_midpoint_X - ADMIN_WIDTH / 2;

    // Admin Master Node
    const admin = agentsList.find((a) => a.type === "admin");
    if (admin) {
      calculatedNodes.push({
        id: admin.agentId,
        type: "adminNode",
        position: isWebMeshLayout ? { x: 1350, y: 50 } : { x: admin_grid_X, y: 60 },
        data: {
          agent: admin,
          adminAnalysis,
          isActive: activeAgentIds.length > 0
        }
      });
    }

    if (isWebMeshLayout) {
      // ══════════════════════════════════════════════════════════════════
      // NEURAL WEB MESH TOPOLOGY: Organic multi-lobe constellation layout
      // ══════════════════════════════════════════════════════════════════
      const getClusterPosition = (
        index: number,
        total: number,
        centerX: number,
        centerY: number
      ) => {
        let radius = 280;
        let angle = 0;

        if (total <= 10) {
          // 2 concentric orbital tiers
          if (index < 4) {
            radius = 240;
            angle = (index / 4) * 2 * Math.PI;
          } else {
            radius = 460;
            angle = ((index - 4) / 6) * 2 * Math.PI + 0.35;
          }
        } else {
          // 3 concentric orbital tiers for 30 agents
          if (index < 6) {
            radius = 230;
            angle = (index / 6) * 2 * Math.PI;
          } else if (index < 16) {
            radius = 450;
            angle = ((index - 6) / 10) * 2 * Math.PI + 0.25;
          } else {
            radius = 670;
            angle = ((index - 16) / 14) * 2 * Math.PI + 0.12;
          }
        }

        const posX = centerX + radius * Math.cos(angle) - CARD_WIDTH / 2;
        const posY = centerY + radius * Math.sin(angle) - CARD_HEIGHT / 2;
        return { x: Math.round(posX), y: Math.round(posY) };
      };

      // 1. ML Lobe (West / Top-Left)
      const mlAgents = filtered.filter((a) => a.type === "ml");
      mlAgents.forEach((a, index) => {
        const pos = getClusterPosition(index, mlAgents.length, 520, 680);
        calculatedNodes.push({
          id: a.agentId,
          type: "agentNode",
          position: pos,
          data: {
            agent: a,
            isActive: activeAgentIds.includes(a.agentId),
            isSelected: selectedAgentId === a.agentId
          }
        });
      });

      // 2. PyTrends Lobe (South-West / Bottom-Left)
      const pytrendAgents = filtered.filter((a) => a.type === "pytrend");
      pytrendAgents.forEach((a, index) => {
        const pos = getClusterPosition(index, pytrendAgents.length, 750, 1680);
        calculatedNodes.push({
          id: a.agentId,
          type: "agentNode",
          position: pos,
          data: {
            agent: a,
            isActive: activeAgentIds.includes(a.agentId),
            isSelected: selectedAgentId === a.agentId
          }
        });
      });

      // 3. Groq LLM Lobe (East / Top-Right)
      const groqAgents = filtered.filter((a) => a.type === "groq");
      groqAgents.forEach((a, index) => {
        const pos = getClusterPosition(index, groqAgents.length, 2400, 680);
        calculatedNodes.push({
          id: a.agentId,
          type: "agentNode",
          position: pos,
          data: {
            agent: a,
            isActive: activeAgentIds.includes(a.agentId),
            isSelected: selectedAgentId === a.agentId
          }
        });
      });

      // 4. QML Quantum Lobe (South-East / Bottom-Right)
      const qmlAgents = filtered.filter((a) => a.type === "qml");
      qmlAgents.forEach((a, index) => {
        const pos = getClusterPosition(index, qmlAgents.length, 2200, 1680);
        calculatedNodes.push({
          id: a.agentId,
          type: "agentNode",
          position: pos,
          data: {
            agent: a,
            isActive: activeAgentIds.includes(a.agentId),
            isSelected: selectedAgentId === a.agentId
          }
        });
      });
    } else {
      // ══════════════════════════════════════════════════════════════════
      // PIPELINE GRID TOPOLOGY: Symmetrical enterprise columns
      // ══════════════════════════════════════════════════════════════════
      // 1. ML Agents (3 cols x 10 rows)
      filtered.filter((a) => a.type === "ml").forEach((a, index) => {
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

      // 2. PyTrends Agents (3 cols x 10 rows)
      filtered.filter((a) => a.type === "pytrend").forEach((a, index) => {
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

      // 3. Groq Agents (3 cols x 10 rows)
      filtered.filter((a) => a.type === "groq").forEach((a, index) => {
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

      // 4. QML Quantum Agents (2 cols x 5 rows)
      filtered.filter((a) => a.type === "qml").forEach((a, index) => {
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
  }, [agentsList, activeAgentIds, activeEdges, adminAnalysis, selectedAgentId, searchQuery, filterRole, isWebMeshLayout]);

  // Auto-fit nodes on layout change, node list updates, or sidebar resize
  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.08, duration: 250 });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [nodes.length, isWebMeshLayout, sidebarWidth, fitView]);

  // Compute Sleek Flowing Stream Threads & Web Synaptic Edges
  const edges: Edge[] = useMemo(() => {
    const edgeList: Edge[] = [];

    if (isWebMeshLayout) {
      // ══════════════════════════════════════════════════════════════════
      // 1. NEURAL WEB MESH STRANDS (Intra-cluster interconnects)
      // ══════════════════════════════════════════════════════════════════
      const createClusterWeb = (prefix: string, count: number) => {
        for (let i = 1; i <= count; i++) {
          const idA = `${prefix}_${i.toString().padStart(3, "0")}`;
          // Ring neighbor
          const next = i === count ? 1 : i + 1;
          const idB = `${prefix}_${next.toString().padStart(3, "0")}`;
          edgeList.push({
            id: `e-web-${idA}-${idB}`,
            source: idA,
            target: idB,
            type: "straight",
            className: "edge-web-strand"
          });

          // Cross chord for web mesh density
          if (i % 3 === 0) {
            const cross = ((i + 5) % count) + 1;
            const idCross = `${prefix}_${cross.toString().padStart(3, "0")}`;
            edgeList.push({
              id: `e-web-cross-${idA}-${idCross}`,
              source: idA,
              target: idCross,
              type: "straight",
              className: "edge-web-strand"
            });
          }
        }
      };

      createClusterWeb("ml", 30);
      createClusterWeb("pytrend", 30);
      createClusterWeb("groq", 30);
      createClusterWeb("qml", 10);

      // ══════════════════════════════════════════════════════════════════
      // 2. SYNAPTIC BRIDGES (Inter-pipeline data handoffs)
      // ══════════════════════════════════════════════════════════════════
      const synapticBridges = [
        { from: "ml_001", to: "pytrend_001" },
        { from: "ml_010", to: "pytrend_010" },
        { from: "pytrend_005", to: "groq_005" },
        { from: "groq_001", to: "qml_001" },
        { from: "qml_004", to: "ml_020" },
        { from: "groq_015", to: "qml_008" }
      ];

      synapticBridges.forEach((b, idx) => {
        edgeList.push({
          id: `e-bridge-${b.from}-${b.to}-${idx}`,
          source: b.from,
          target: b.to,
          type: "smoothstep",
          className: "edge-web-bridge"
        });
      });
    }

    // ══════════════════════════════════════════════════════════════════
    // 3. STRUCTURAL HUB CONDUITS TO ADMIN MASTER
    // ══════════════════════════════════════════════════════════════════
    const structuralHubs = [
      { id: "ml_001", color: "#BAE6FD" },
      { id: "ml_002", color: "#BAE6FD" },
      { id: "pytrend_001", color: "#FDE68A" },
      { id: "pytrend_002", color: "#FDE68A" },
      { id: "groq_001", color: "#A7F3D0" },
      { id: "groq_002", color: "#A7F3D0" },
      { id: "qml_001", color: "#FBCFE8" },
      { id: "qml_002", color: "#FBCFE8" }
    ];

    structuralHubs.forEach((hub) => {
      edgeList.push({
        id: `e-struct-${hub.id}-admin`,
        source: hub.id,
        target: "admin_001",
        type: "smoothstep",
        style: { stroke: hub.color, strokeWidth: 1.5, opacity: isWebMeshLayout ? 0.4 : 0.6 }
      });
    });

    // ══════════════════════════════════════════════════════════════════
    // 4. ACTIVE ANIMATED SIMULATION EDGES (Real-time live pulses)
    // ══════════════════════════════════════════════════════════════════
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
          strokeWidth: 2.2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 10,
          height: 10
        }
      });
    });

    return edgeList;
  }, [activeAgentIds, activeEdges, isWebMeshLayout]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedAgentId(node.id);
  }, [setSelectedAgentId]);

  return (
    <div className="w-full h-full relative bg-slate-50 overflow-hidden">
      {/* Layout Toggle Button Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center border border-slate-300 bg-white/95 backdrop-blur shadow-md p-0.5 gap-1 transition-all">
        <button
          onClick={() => setIsWebMeshLayout(false)}
          className={`px-3 py-1 text-[11px] font-mono font-bold flex items-center gap-1.5 uppercase transition border ${
            !isWebMeshLayout
              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
              : "bg-white text-slate-700 border-transparent hover:bg-slate-100"
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Pipeline Grid</span>
        </button>
        <button
          onClick={() => setIsWebMeshLayout(true)}
          className={`px-3 py-1 text-[11px] font-mono font-bold flex items-center gap-1.5 uppercase transition border ${
            isWebMeshLayout
              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
              : "bg-white text-slate-700 border-transparent hover:bg-slate-100"
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Neural Web Mesh</span>
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.08}
        maxZoom={1.8}
        defaultViewport={{ x: 0, y: 0, zoom: 0.35 }}
      >
        <Background color="#CBD5E1" gap={24} size={1.2} variant={BackgroundVariant.Dots} />
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
