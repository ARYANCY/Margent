import React from "react";
import { Play, Pause, StepForward, Activity, Zap, RefreshCw } from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";

export const SimulationControls: React.FC = () => {
  const simulationStatus = useSimulationStore((s) => s.simulationStatus);
  const speed = useSimulationStore((s) => s.speed);
  const tick = useSimulationStore((s) => s.tick);
  const activeAgentIds = useSimulationStore((s) => s.activeAgentIds);
  const isConnected = useSimulationStore((s) => s.isConnected);
  const startSimulation = useSimulationStore((s) => s.startSimulation);
  const pauseSimulation = useSimulationStore((s) => s.pauseSimulation);
  const setSpeed = useSimulationStore((s) => s.setSpeed);
  const stepSimulation = useSimulationStore((s) => s.stepSimulation);

  const isRunning = simulationStatus === "RUNNING";
  const speedOptions = [0.5, 1.0, 2.0, 5.0];

  return (
    <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-md border-2 border-slate-900 shadow-2xl px-4 py-2 select-none transition-all duration-200">
      {/* 1. Live Running Beacon */}
      <div className="flex items-center gap-2 pr-2 border-r border-slate-200 font-mono">
        <div className="relative flex items-center justify-center">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRunning ? "bg-emerald-500 beacon-live" : "bg-slate-400"
            }`}
          />
          {isRunning && (
            <span className="absolute w-4 h-4 rounded-full bg-emerald-400/40 animate-ping" />
          )}
        </div>
        <div className="leading-none">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">
            STATUS
          </span>
          <span
            className={`text-[10px] font-black uppercase tracking-wider ${
              isRunning ? "text-emerald-700" : "text-slate-700"
            }`}
          >
            {isRunning ? "RUNNING" : "PAUSED"}
          </span>
        </div>
      </div>

      {/* 2. Play / Pause Button */}
      <button
        onClick={isRunning ? pauseSimulation : startSimulation}
        className={`px-4 py-1.5 text-xs font-mono font-black flex items-center gap-2 transition-all duration-150 uppercase tracking-wider shadow-md cursor-pointer border ${
          isRunning
            ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 active:scale-95"
            : "bg-slate-900 hover:bg-slate-800 text-white border-slate-900 active:scale-95"
        }`}
      >
        {isRunning ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Simulation</span>
          </>
        )}
      </button>

      {/* 3. Step Tick Button */}
      <button
        onClick={stepSimulation}
        disabled={isRunning}
        className="px-3 py-1.5 text-xs font-mono font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 disabled:opacity-40 flex items-center gap-1.5 transition-all duration-150 uppercase tracking-wider shadow-xs cursor-pointer active:scale-95"
        title="Advance 1 Discrete Simulation Tick (Hotkey: .)"
      >
        <StepForward className="w-3.5 h-3.5 text-slate-700" />
        <span>Step</span>
      </button>

      {/* 4. Tick Counter Badge */}
      <div className="px-3 py-1 bg-slate-50 border border-slate-300 text-center font-mono shadow-xs">
        <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider leading-none">
          TICK
        </span>
        <span className="text-xs font-black text-slate-900 leading-none">{tick}</span>
      </div>

      {/* 5. Active Nodes Count Beacon */}
      <div className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-center font-mono shadow-xs hidden sm:block">
        <span className="text-[8px] text-indigo-600 block uppercase font-bold tracking-wider leading-none">
          ACTIVE NODES
        </span>
        <span className="text-xs font-black text-indigo-900 leading-none">
          {isRunning ? (activeAgentIds.length || 101) : activeAgentIds.length} / 101
        </span>
      </div>

      {/* 6. Speed Multipliers */}
      <div className="flex items-center border border-slate-200 bg-slate-50 p-0.5 font-mono shadow-xs">
        <span className="px-1.5 text-[8px] font-bold text-slate-500 uppercase">SPEED:</span>
        {speedOptions.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-all duration-150 border cursor-pointer ${
              speed === s
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-transparent text-slate-600 border-transparent hover:text-slate-900"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
