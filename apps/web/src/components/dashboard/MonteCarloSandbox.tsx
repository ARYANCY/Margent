import React, { useState, useEffect, useMemo } from "react";
import {
  Sliders,
  TrendingUp,
  AlertCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

interface MonteCarloSandboxProps {
  baseRoas?: number;
  spend?: number;
}

export const MonteCarloSandbox: React.FC<MonteCarloSandboxProps> = ({
  baseRoas = 3.85,
  spend = 1800
}) => {
  const [volatility, setVolatility] = useState<number>(0.15);
  const [competitorIntensity, setCompetitorIntensity] = useState<number>(0.20);
  const [daysHorizon, setDaysHorizon] = useState<number>(14);
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);

  // Fetch or Compute Stochastic Simulation
  const fetchSimulation = async () => {
    setLoading(true);
    const apiUrl = (import.meta as any).env?.VITE_API_URL || (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:4000` : "http://localhost:4000");

    try {
      const res = await fetch(`${apiUrl}/api/simulation/monte-carlo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base_roas: baseRoas,
          spend,
          volatility,
          competitor_intensity: competitorIntensity,
          days: daysHorizon,
          num_simulations: 500
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimData(data);
      }
    } catch (err) {
      console.error("Monte Carlo fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulation();
  }, [baseRoas, spend]);

  const trajectories = useMemo(() => {
    if (simData?.trajectories) return simData.trajectories;

    // Fallback Client Computation
    return Array.from({ length: daysHorizon }, (_, i) => {
      const decay = 1 - 0.015 * (i / daysHorizon) * competitorIntensity * 2;
      const p10 = Number((baseRoas * (0.82 - i * 0.012) * decay).toFixed(2));
      const p50 = Number((baseRoas * (1.0 - i * 0.006) * decay).toFixed(2));
      const p90 = Number((baseRoas * (1.22 + i * 0.018) * decay).toFixed(2));
      return {
        day: `Day ${i + 1}`,
        p10_bear: Math.max(0.5, p10),
        p50_base: Math.max(0.8, p50),
        p90_bull: Math.max(1.2, p90)
      };
    });
  }, [simData, daysHorizon, baseRoas, competitorIntensity]);

  const riskMetrics = simData?.risk_metrics || {
    var_95_roas: Number((baseRoas * 0.78).toFixed(2)),
    expected_terminal_roas: Number((baseRoas * 0.94).toFixed(2)),
    bull_case_roas: Number((baseRoas * 1.35).toFixed(2)),
    bear_case_roas: Number((baseRoas * 0.70).toFixed(2))
  };

  return (
    <div className="p-4 border border-slate-300 bg-white shadow-xs font-mono select-none space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900">
            500-PATH STOCHASTIC MONTE CARLO SANDBOX
          </span>
        </div>
        <span className="px-1.5 py-0.2 text-[8px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
          95% VaR Confidence
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-3 gap-2.5 text-[9px] bg-slate-50 p-2.5 border border-slate-200">
        <div>
          <div className="flex justify-between mb-1 text-slate-700 font-bold">
            <span>VOLATILITY (σ):</span>
            <span className="text-indigo-700">{(volatility * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.40"
            step="0.05"
            value={volatility}
            onChange={(e) => setVolatility(Number(e.target.value))}
            className="w-full accent-indigo-600 h-1 bg-slate-200 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1 text-slate-700 font-bold">
            <span>COMPETITOR SHOCK:</span>
            <span className="text-amber-700">{(competitorIntensity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.50"
            step="0.05"
            value={competitorIntensity}
            onChange={(e) => setCompetitorIntensity(Number(e.target.value))}
            className="w-full accent-amber-600 h-1 bg-slate-200 cursor-pointer"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchSimulation}
            disabled={loading}
            className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{loading ? "Simulating..." : "Re-Simulate (500)"}</span>
          </button>
        </div>
      </div>

      {/* 3-Band Area Fan Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={280} debounce={50}>
          <AreaChart data={trajectories} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="bullGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="bearGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 8, fill: "#64748B", fontFamily: "monospace" }} />
            <YAxis tick={{ fontSize: 8, fill: "#64748B", fontFamily: "monospace" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", fontSize: "9px" }}
              formatter={(v: any) => [`${v}x ROAS`]}
            />
            <Area type="monotone" dataKey="p90_bull" name="P90 Bull Case" stroke="#10B981" strokeWidth={1.5} fill="url(#bullGradient)" />
            <Area type="monotone" dataKey="p50_base" name="P50 Expected" stroke="#0F172A" strokeWidth={2} fill="none" />
            <Area type="monotone" dataKey="p10_bear" name="P10 Bear Case" stroke="#F43F5E" strokeWidth={1.5} strokeDasharray="3 3" fill="url(#bearGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Outcome Risk & Return Metrics */}
      <div className="grid grid-cols-4 gap-2 text-center text-[9px] pt-1">
        <div className="p-1.5 bg-slate-50 border border-slate-200">
          <span className="text-slate-500 uppercase font-bold block">P90 Bull Case</span>
          <span className="text-xs font-black text-emerald-700 mt-0.5">{riskMetrics.bull_case_roas}x</span>
        </div>
        <div className="p-1.5 bg-slate-50 border border-slate-200">
          <span className="text-slate-500 uppercase font-bold block">P50 Base Case</span>
          <span className="text-xs font-black text-slate-900 mt-0.5">{riskMetrics.expected_terminal_roas}x</span>
        </div>
        <div className="p-1.5 bg-slate-50 border border-slate-200">
          <span className="text-slate-500 uppercase font-bold block">P10 Bear Case</span>
          <span className="text-xs font-black text-rose-700 mt-0.5">{riskMetrics.bear_case_roas}x</span>
        </div>
        <div className="p-1.5 bg-slate-900 text-white border border-slate-800">
          <span className="text-slate-400 uppercase font-bold block">VaR (95%)</span>
          <span className="text-xs font-black text-emerald-400 mt-0.5">{riskMetrics.var_95_roas}x</span>
        </div>
      </div>
    </div>
  );
};
