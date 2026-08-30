import { UnifiedMarketingRecommendation, EnsembleBreakdown } from "../../../../packages/shared/src/types/index";

export function generateMarketingRecommendation(
  analysisId: string,
  topic: string,
  channel: string,
  trendName: string,
  confidence: number,
  simulatedRoas: number,
  breakdown: EnsembleBreakdown
): UnifiedMarketingRecommendation {
  // 1. Determine direction
  let directionValue: "UP" | "DOWN" | "STABLE" | "UNCERTAIN" = "STABLE";
  let directionLabel = "Stable";
  let directionStrength: "WEAK" | "MODERATE" | "STRONG" = "MODERATE";

  const pytrendsVal = breakdown.pytrends_velocity;
  const mlRoas = breakdown.ml_roas;

  if (pytrendsVal > 72) {
    directionValue = "UP";
    directionLabel = "Increasing";
    directionStrength = pytrendsVal > 85 ? "STRONG" : "MODERATE";
  } else if (pytrendsVal < 45) {
    directionValue = "DOWN";
    directionLabel = "Decreasing";
    directionStrength = pytrendsVal < 30 ? "STRONG" : "MODERATE";
  } else {
    directionValue = "STABLE";
    directionLabel = "Stable";
    directionStrength = "WEAK";
  }

  // 2. Determine decision action
  let action: "INVEST" | "INCREASE" | "HOLD" | "TEST" | "REDUCE" | "AVOID" | "WAIT" = "HOLD";
  let priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM";
  let decisionLabel = "Maintain current strategy and monitor.";

  if (directionValue === "UP" && simulatedRoas > 3.0) {
    action = "INVEST";
    priority = "HIGH";
    decisionLabel = "Market opportunities are strengthening. Increase investment.";
  } else if (directionValue === "UP" && confidence < 0.75) {
    action = "TEST";
    priority = "MEDIUM";
    decisionLabel = "Promising signals but limited confidence. Run a small test budget.";
  } else if (directionValue === "DOWN" || simulatedRoas < 2.0) {
    action = "REDUCE";
    priority = "HIGH";
    decisionLabel = "Performance signals are weakening. Consider reducing budget.";
  } else if (simulatedRoas < 1.5) {
    action = "AVOID";
    priority = "CRITICAL";
    decisionLabel = "High downside risk detected. Avoid further budget allocations.";
  }

  // 3. Risk level
  let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM";
  let riskExplanation = "Normal marketing fluctuations expected.";
  if (simulatedRoas < 2.0) {
    riskLevel = "HIGH";
    riskExplanation = "Underperforming ROI curves indicate high risk of ad spend waste.";
  } else if (simulatedRoas > 3.5 && directionValue === "UP") {
    riskLevel = "LOW";
    riskExplanation = "Strong consumer search trend supports high conversion odds.";
  }

  // 4. Reasons
  const reasons: string[] = [];
  reasons.push(`TrendRadar interest momentum for '${trendName}' is ${directionLabel.toLowerCase()} (${pytrendsVal.toFixed(0)}/100 velocity).`);
  reasons.push(`ChannelPulse predictive analytics projects ${mlRoas.toFixed(2)}x expected ROAS on ${channel}.`);
  reasons.push(`DecisionCore reports a Multi-Modal Weighted Consensus of ${Math.round(confidence * 100)}% agreement.`);

  return {
    analysisId,
    topic,
    summary: `Margent DecisionCore recommends that we ${action.toLowerCase()} in the ${channel} channel matching trend keyword '${trendName}'.`,
    direction: {
      value: directionValue,
      label: directionLabel,
      strength: directionStrength
    },
    decision: {
      action,
      priority,
      label: decisionLabel
    },
    confidence: {
      level: confidence > 0.85 ? "HIGH" : confidence > 0.65 ? "MEDIUM" : "LOW",
      score: Math.round(confidence * 100),
      explanation: `Margent DecisionCore is currently ${confidence > 0.85 ? "very strong" : confidence > 0.65 ? "moderately aligned" : "divided"} on this channel's expected ROI.`
    },
    risk: {
      level: riskLevel,
      explanation: riskExplanation
    },
    reasons,
    recommendedAction: {
      primary: action === "INVEST" ? `Increase budget allocations on ${channel} to capitalize on '${trendName}' search breakout.` : `Maintain standby posture or run minor tests on ${channel}.`,
      budgetGuidance: action === "INVEST" ? "Increase" : action === "TEST" ? "Test with small budget" : "Reduce",
      urgency: priority === "CRITICAL" || priority === "HIGH" ? "NOW" : "THIS_WEEK"
    },
    expectedImpact: {
      direction: simulatedRoas > 2.5 ? "POSITIVE" : "NEGATIVE",
      description: `Dispatched spend is projected to return up to $${(simulatedRoas).toFixed(2)} for every $1 spent.`
    }
  };
}
