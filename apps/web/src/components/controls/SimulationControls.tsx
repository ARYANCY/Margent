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
    <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg px-4.5 py-2.5 rounded-2xl select-none">
      {/* 1. Play / Pause Button */}
      <button
        onClick={isRunning ? pauseSimulation : startSimulation}
        className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 uppercase tracking-wider rounded-xl shadow-xs border ${
          isRunning
            ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-amber-100"
            : "bg-slate-900 hover:bg-slate-850 text-white border-slate-900 shadow-slate-200"
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
        className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 disabled:opacity-40 rounded-xl flex items-center gap-1.5 transition-all uppercase tracking-wider shadow-xs"
        title="Execute Single Simulation Tick"
      >
        <StepForward className="w-3.5 h-3.5 text-slate-500" />
        <span>Step</span>
      </button>

      {/* 3. Tick Counter Badge */}
      <div className="px-3.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider leading-none">Tick</span>
        <span className="text-xs font-extrabold text-slate-800 leading-none mt-0.5 block">{tick}</span>
      </div>

      {/* 4. Speed Multipliers */}
      <div className="flex items-center border border-slate-200 bg-slate-50 p-1 rounded-xl shadow-inner">
        <span className="px-2 text-[8px] font-bold text-slate-400 uppercase tracking-wider">Speed:</span>
        {speedOptions.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
              speed === s
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
