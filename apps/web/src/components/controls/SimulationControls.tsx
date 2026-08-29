import React from "react";
import { Play, Pause, StepForward } from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";

export const SimulationControls: React.FC = () => {
  const simulationStatus = useSimulationStore((s) => s.simulationStatus);
  const speed = useSimulationStore((s) => s.speed);
  const tick = useSimulationStore((s) => s.tick);
  const startSimulation = useSimulationStore((s) => s.startSimulation);
  const pauseSimulation = useSimulationStore((s) => s.pauseSimulation);
  const setSpeed = useSimulationStore((s) => s.setSpeed);
  const stepSimulation = useSimulationStore((s) => s.stepSimulation);

  const isRunning = simulationStatus === "RUNNING";
  const speedOptions = [0.5, 1.0, 2.0, 5.0];

  return (
    <div className="flex items-center space-x-2.5 bg-white border border-slate-300 shadow-md px-3.5 py-2 select-none">
      {/* 1. Play / Pause Button */}
      <button
        onClick={isRunning ? pauseSimulation : startSimulation}
        className={`px-3.5 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition uppercase tracking-wider shadow-sm border ${
          isRunning
            ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
            : "bg-slate-900 hover:bg-slate-800 text-white border-slate-900"
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

      {/* 2. Step Tick Button */}
      <button
        onClick={stepSimulation}
        disabled={isRunning}
        className="px-3 py-1.5 text-xs font-mono font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 disabled:opacity-40 flex items-center gap-1 transition uppercase tracking-wider shadow-sm"
        title="Execute Single Simulation Tick"
      >
        <StepForward className="w-3.5 h-3.5" />
        <span>Step</span>
      </button>

      {/* 3. Tick Counter Badge */}
      <div className="px-3 py-0.5 bg-slate-50 border border-slate-200 text-center font-mono">
        <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider leading-none">TICK</span>
        <span className="text-xs font-bold text-slate-900 leading-none">{tick}</span>
      </div>

      {/* 4. Speed Multipliers */}
      <div className="flex items-center border border-slate-200 bg-slate-50 p-0.5 font-mono shadow-sm">
        <span className="px-1.5 text-[8px] font-bold text-slate-500 uppercase">SPEED:</span>
        {speedOptions.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase transition border ${
              speed === s
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
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
