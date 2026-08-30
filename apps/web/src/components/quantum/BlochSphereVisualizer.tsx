import React, { useState, useMemo } from "react";
import { Atom, Compass, RotateCw, Activity, Layers } from "lucide-react";

interface BlochVector {
  qubit: number;
  label: string;
  x: number;
  y: number;
  z: number;
  theta_deg: number;
  phi_deg: number;
}

interface BlochSphereProps {
  vectors?: BlochVector[];
  resonanceScore?: number;
  entropy?: number;
}

export const BlochSphereVisualizer: React.FC<BlochSphereProps> = ({
  vectors = [
    { qubit: 0, label: "Spend Q0", x: 0.654, y: 0.321, z: 0.685, theta_deg: 46.8, phi_deg: 26.1 },
    { qubit: 1, label: "CTR Q1", x: -0.412, y: 0.723, z: 0.554, theta_deg: 56.4, phi_deg: 119.7 },
    { qubit: 2, label: "Velocity Q2", x: 0.812, y: -0.214, z: 0.542, theta_deg: 57.2, phi_deg: 345.2 },
    { qubit: 3, label: "Affinity Q3", x: 0.124, y: 0.854, z: -0.504, theta_deg: 120.3, phi_deg: 81.7 }
  ],
  resonanceScore = 89.4,
  entropy = 0.412
}) => {
  const [rotationAngle, setRotationAngle] = useState(25);
  const [activeQubitIdx, setActiveQubitIdx] = useState(0);

  const colors = ["#0284C7", "#D97706", "#059669", "#DB2777"];

  // 3D Isometric Projection Transformation
  const projectedPoints = useMemo(() => {
    const rad = (rotationAngle * Math.PI) / 180;
    const r = 70; // Sphere radius in SVG pixels
    const cx = 100;
    const cy = 95;

    return vectors.map((v, i) => {
      // 3D rotation around Y-axis
      const rotX = v.x * Math.cos(rad) - v.y * Math.sin(rad);
      const rotY = v.x * Math.sin(rad) + v.y * Math.cos(rad);
      const rotZ = v.z;

      // Isometric 2D projection
      const px = cx + rotX * r;
      const py = cy - rotZ * r + rotY * (r * 0.3);

      return {
        ...v,
        px,
        py,
        color: colors[i % colors.length],
        depth: rotY
      };
    });
  }, [vectors, rotationAngle]);

  const activeQubit = vectors[activeQubitIdx] || vectors[0];

  return (
    <div className="p-4 bg-slate-900 text-white border border-slate-700 shadow-md font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
            3D QUANTUM BLOCH SPHERE STATEVECTOR (4-QUBIT VQC)
          </span>
        </div>

        <button
          onClick={() => setRotationAngle((prev) => (prev + 45) % 360)}
          className="px-2 py-0.5 text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition uppercase cursor-pointer"
          title="Rotate Sphere Perspective"
        >
          <RotateCw className="w-3 h-3" />
          <span>Rotate ({rotationAngle}°)</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        {/* SVG Bloch Sphere Graphic */}
        <div className="col-span-6 flex items-center justify-center relative">
          <svg width="200" height="190" className="overflow-visible">
            {/* Outer Sphere Boundary */}
            <circle cx="100" cy="95" r="70" fill="#0B1120" stroke="#334155" strokeWidth="1.5" />
            
            {/* Equator & Meridian Ellipses */}
            <ellipse cx="100" cy="95" rx="70" ry="22" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
            <ellipse cx="100" cy="95" rx="22" ry="70" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />

            {/* Principal Axes */}
            {/* Z-Axis (North |0> to South |1>) */}
            <line x1="100" y1="20" x2="100" y2="170" stroke="#475569" strokeWidth="1" />
            <text x="100" y="16" fill="#94A3B8" fontSize="8" textAnchor="middle" fontWeight="bold">|0⟩</text>
            <text x="100" y="180" fill="#94A3B8" fontSize="8" textAnchor="middle" fontWeight="bold">|1⟩</text>

            {/* X-Axis */}
            <line x1="25" y1="95" x2="175" y2="95" stroke="#334155" strokeWidth="0.8" />
            <text x="180" y="98" fill="#64748B" fontSize="7">|+⟩</text>

            {/* State Vectors */}
            {projectedPoints.map((pt, i) => (
              <g key={i} className="cursor-pointer transition-all" onClick={() => setActiveQubitIdx(i)}>
                {/* Vector line from origin (100, 95) */}
                <line
                  x1="100"
                  y1="95"
                  x2={pt.px}
                  y2={pt.py}
                  stroke={pt.color}
                  strokeWidth={activeQubitIdx === i ? 2.5 : 1.5}
                  strokeOpacity={activeQubitIdx === i ? 1.0 : 0.65}
                />
                {/* Arrowhead endpoint */}
                <circle
                  cx={pt.px}
                  cy={pt.py}
                  r={activeQubitIdx === i ? 4.5 : 3}
                  fill={pt.color}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  className="transition-transform hover:scale-150"
                />
                <text
                  x={pt.px + (pt.px > 100 ? 6 : -6)}
                  y={pt.py + 3}
                  fill={pt.color}
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor={pt.px > 100 ? "start" : "end"}
                >
                  Q{i}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Selected Qubit Telemetry Sidebar */}
        <div className="col-span-6 space-y-2 text-[10px]">
          <div className="p-2 bg-slate-800/80 border border-slate-700">
            <div className="flex items-center justify-between text-slate-300 font-bold mb-1">
              <span>SELECTED: {activeQubit.label}</span>
              <span className="px-1.5 py-0.2 bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[8px]">
                QUBIT #{activeQubitIdx}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center font-mono">
              <div className="p-1 bg-slate-900 border border-slate-700">
                <span className="text-slate-500 text-[8px] block">X</span>
                <span className="text-white font-bold">{activeQubit.x}</span>
              </div>
              <div className="p-1 bg-slate-900 border border-slate-700">
                <span className="text-slate-500 text-[8px] block">Y</span>
                <span className="text-white font-bold">{activeQubit.y}</span>
              </div>
              <div className="p-1 bg-slate-900 border border-slate-700">
                <span className="text-slate-500 text-[8px] block">Z</span>
                <span className="text-white font-bold">{activeQubit.z}</span>
              </div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 pt-1 border-t border-slate-700/60">
              <span>θ (Polar): {activeQubit.theta_deg}°</span>
              <span>φ (Azimuth): {activeQubit.phi_deg}°</span>
            </div>
          </div>

          {/* Qubit Selector Pills */}
          <div className="flex gap-1">
            {vectors.map((v, i) => (
              <button
                key={i}
                onClick={() => setActiveQubitIdx(i)}
                className={`flex-1 py-1 text-[9px] font-bold border transition uppercase cursor-pointer ${
                  activeQubitIdx === i
                    ? "bg-pink-500 text-white border-pink-400"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                }`}
              >
                Q{i}
              </button>
            ))}
          </div>

          {/* Entropy & Hilbert State Resonance */}
          <div className="p-2 bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-[9px]">
            <span className="text-slate-400">von Neumann Entropy:</span>
            <span className="font-bold text-pink-300">{entropy} nats</span>
          </div>
        </div>
      </div>
    </div>
  );
};
