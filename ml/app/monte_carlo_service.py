"""
Monte Carlo Simulation Engine for Stochastic Campaign Outcome Forecasting
Simulates N market iterations considering CTR decay, competitor bidding shocks, and volatility.
"""
import numpy as np
from typing import Dict, Any, List

class MonteCarloSimulator:
    def __init__(self, default_simulations: int = 500):
        self.default_simulations = default_simulations

    def run_simulation(
        self,
        base_roas: float = 3.5,
        spend: float = 1800.0,
        volatility: float = 0.15,
        competitor_intensity: float = 0.20,
        days: int = 14,
        num_sims: int = 500
    ) -> Dict[str, Any]:
        """
        Executes a geometric Brownian motion with mean-reversion for campaign returns.
        """
        # Daily drift and volatility
        daily_drift = 0.01 - (competitor_intensity * 0.02)
        daily_vol = volatility / np.sqrt(days)

        # Simulation matrix: (num_sims, days)
        np.random.seed(42)
        shocks = np.random.normal(daily_drift, daily_vol, (num_sims, days))
        
        # Cumulative multiplier trajectory
        trajectories = np.zeros((num_sims, days))
        trajectories[:, 0] = base_roas

        for t in range(1, days):
            # Log-normal stochastic process with decay
            decay_factor = 1.0 - (0.015 * (t / days)) # CTR wearout
            trajectories[:, t] = np.maximum(0.5, trajectories[:, t-1] * np.exp(shocks[:, t]) * decay_factor)

        # Calculate percentiles across all simulations per day
        p10 = np.percentile(trajectories, 10, axis=0).round(2)
        p50 = np.percentile(trajectories, 50, axis=0).round(2)
        p90 = np.percentile(trajectories, 90, axis=0).round(2)

        time_series = []
        for d in range(days):
            time_series.append({
                "day": f"Day {d+1}",
                "p10_bear": float(p10[d]),
                "p50_base": float(p50[d]),
                "p90_bull": float(p90[d]),
                "expected_gross_revenue": round(float(p50[d]) * spend, 2)
            })

        # Value at Risk (VaR 95%)
        final_roas_dist = trajectories[:, -1]
        var_95_roas = float(np.percentile(final_roas_dist, 5).round(2))
        max_roas = float(np.max(final_roas_dist).round(2))
        prob_profitable = float((np.mean(final_roas_dist > 1.0) * 100).round(1))

        return {
            "metadata": {
                "num_simulations": num_sims,
                "days_horizon": days,
                "base_roas": base_roas,
                "volatility": volatility,
                "competitor_intensity": competitor_intensity,
                "probability_of_profit": prob_profitable
            },
            "risk_metrics": {
                "var_95_roas": var_95_roas,
                "expected_terminal_roas": float(p50[-1]),
                "bull_case_roas": float(p90[-1]),
                "bear_case_roas": float(p10[-1]),
                "max_potential_roas": max_roas
            },
            "trajectories": time_series
        }

monte_carlo_engine = MonteCarloSimulator()
