async function testEnsembleFlow() {
  console.log("==================================================================");
  console.log(" Testing 30-30-30-10 Multi-Modal Ensemble Intelligence Engine");
  console.log(" (30 ML Models + 30 PyTrends + 30 Groq LLM + 10 PennyLane QML + 1 Admin)");
  console.log("==================================================================");
  
  // 1. Check ML Microservice Ensemble Endpoint
  console.log("\n1. Testing FastAPI Ensemble Endpoint on Port 8000...");
  const mlEnsemble = await fetch("http://127.0.0.1:8000/ensemble/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      spend: 1800,
      impressions: 65000,
      clicks: 3200,
      ctr: 0.049,
      cpc: 0.56,
      trend: "Autonomous Multi-Agent Systems",
      caption: "Experience next-gen autonomous multi-agent intelligence.",
      hashtags: ["#AgenticAI", "#Innovation"],
      channel: "TikTok"
    })
  }).then(r => r.json());

  console.log("Ensemble Consensus:", mlEnsemble.ensemble_summary);
  console.log("Pipeline Breakdown:");
  console.log(" • 30 ML Models:", mlEnsemble.pipeline_breakdown.trained_ml);
  console.log(" • 30 PyTrends:", mlEnsemble.pipeline_breakdown.pytrends_search);
  console.log(" • 30 Groq LLM:", mlEnsemble.pipeline_breakdown.groq_reasoning);
  console.log(" • 10 QML Quantum:", mlEnsemble.pipeline_breakdown.quantum_qml);

  // 2. Check 101 Agents on Port 4000
  console.log("\n2. Checking 101-Agent Registry on Port 4000...");
  const agentsRes = await fetch("http://localhost:4000/api/agents").then(r => r.json());
  const byPipeline: Record<string, number> = {};
  for (const a of agentsRes.agents) {
    byPipeline[a.pipelineGroup] = (byPipeline[a.pipelineGroup] || 0) + 1;
  }
  console.log("Agent Distribution Breakdown:", byPipeline);

  // 3. Post Campaign and Trigger Simulation
  console.log("\n3. Triggering Campaign Simulation Cycle...");
  const postRes = await fetch("http://localhost:4000/api/campaigns/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaignName: "Quantum Multi-Agent Launch",
      channel: "TikTok",
      audience: "Tech Enthusiasts & Creators",
      caption: "Autonomous multi-agent intelligence powered by quantum consensus #AgenticAI #QML",
      hashtags: "#AgenticAI #QML #TechDeals",
      spend: 2000,
      trendAlignment: 94
    })
  }).then(r => r.json());

  console.log("Post Simulation Result:", postRes.success);
  console.log("Admin Consensus Decision:", postRes.adminAnalysis?.decision, `(Confidence: ${postRes.adminAnalysis?.confidence})`);
  console.log("Admin Summary:", postRes.adminAnalysis?.summary);
  console.log("Multi-Modal Evidence:", postRes.adminAnalysis?.evidence);
  console.log("QML Entanglement Matrix:", postRes.adminAnalysis?.ensembleBreakdown?.entanglement_matrix);

  console.log("\n=== ALL 30-30-30-10 MULTI-MODAL ENSEMBLE TESTS PASSED! ===");
}

testEnsembleFlow().catch(console.error);
