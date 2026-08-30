import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, RefreshCw } from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";

// Dynamic API URL matching simulationStore
const apiUrl = (import.meta as any).env?.VITE_API_URL || (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:4000` : "http://localhost:4000");

export const SwarmManagerCRUD: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"agents" | "trends" | "campaigns">("agents");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Lists loaded from zustand & updated locally
  const agents = useSimulationStore((s) => s.agents);
  const trends = useSimulationStore((s) => s.trends);
  const campaigns = useSimulationStore((s) => s.campaigns);
  const socket = useSimulationStore((s) => s.socket);
  const loadInitialData = useSimulationStore((s) => s.loadInitialData);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Forms states
  const [agentForm, setAgentForm] = useState({
    agentId: "",
    name: "",
    type: "ml",
    roleDescription: "",
    pipelineGroup: "ML_TRAINED",
    status: "IDLE",
    sentiment: 0,
    engagementScore: 50,
  });

  const [trendForm, setTrendForm] = useState({
    trendId: "",
    name: "",
    hashtag: "",
    source: "Google Trends",
    growth: 50,
    interest: 50,
    velocity: 50,
    status: "RISING",
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Trigger refetch / refresh to sync store
  const triggerRefresh = () => {
    loadInitialData();
    if (socket) {
      // Re-emit start / step / fetch to trigger websocket sync
      socket.emit("simulation:state");
    }
  };

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // AGENTS CRUD
  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `${apiUrl}/api/agents/${isEditing}` : `${apiUrl}/api/agents`;
      
      const resp = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentForm)
      });

      if (resp.ok) {
        showMsg(isEditing ? "Agent updated successfully!" : "Agent created successfully!", "success");
        setAgentForm({
          agentId: "",
          name: "",
          type: "ml",
          roleDescription: "",
          pipelineGroup: "ML_TRAINED",
          status: "IDLE",
          sentiment: 0,
          engagementScore: 50,
        });
        setIsEditing(null);
        triggerRefresh();
      } else {
        const data = await resp.json();
        showMsg(data.error || "Action failed", "error");
      }
    } catch (err: any) {
      showMsg(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAgent = (a: any) => {
    setIsEditing(a.agentId);
    setAgentForm({
      agentId: a.agentId,
      name: a.name,
      type: a.type,
      roleDescription: a.roleDescription || "",
      pipelineGroup: a.pipelineGroup || "ML_TRAINED",
      status: a.status || "IDLE",
      sentiment: a.sentiment || 0,
      engagementScore: a.engagementScore || 50,
    });
  };

  const handleDeleteAgent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;
    setLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/api/agents/${id}`, { method: "DELETE" });
      if (resp.ok) {
        showMsg("Agent deleted!", "success");
        triggerRefresh();
      } else {
        showMsg("Delete failed", "error");
      }
    } catch (err: any) {
      showMsg(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // TRENDS CRUD
  const handleTrendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `${apiUrl}/api/trends/${isEditing}` : `${apiUrl}/api/trends`;
      
      const resp = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trendForm)
      });

      if (resp.ok) {
        showMsg(isEditing ? "Trend updated!" : "Trend created!", "success");
        setTrendForm({
          trendId: "",
          name: "",
          hashtag: "",
          source: "Google Trends",
          growth: 50,
          interest: 50,
          velocity: 50,
          status: "RISING",
        });
        setIsEditing(null);
        triggerRefresh();
      } else {
        const data = await resp.json();
        showMsg(data.error || "Action failed", "error");
      }
    } catch (err: any) {
      showMsg(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTrend = (t: any) => {
    setIsEditing(t.trendId);
    setTrendForm({
      trendId: t.trendId,
      name: t.name,
      hashtag: t.hashtag,
      source: t.source || "Google Trends",
      growth: t.growth || 50,
      interest: t.interest || 50,
      velocity: t.velocity || 50,
      status: t.status || "RISING",
    });
  };

  const handleDeleteTrend = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trend?")) return;
    setLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/api/trends/${id}`, { method: "DELETE" });
      if (resp.ok) {
        showMsg("Trend deleted!", "success");
        triggerRefresh();
      } else {
        showMsg("Delete failed", "error");
      }
    } catch (err: any) {
      showMsg(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // CAMPAIGNS CRUD DELETE ONLY (creation has its own specialized flow)
  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    setLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/api/campaigns/${id}`, { method: "DELETE" });
      if (resp.ok) {
        showMsg("Campaign deleted!", "success");
        triggerRefresh();
      } else {
        showMsg("Delete failed", "error");
      }
    } catch (err: any) {
      showMsg(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 gap-4 mb-2">
        <button
          onClick={() => { setActiveSubTab("agents"); setIsEditing(null); }}
          className={`pb-2 text-xs font-mono font-bold uppercase border-b-2 transition ${
            activeSubTab === "agents" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"
          }`}
        >
          Manage Swarm Agents
        </button>
        <button
          onClick={() => { setActiveSubTab("trends"); setIsEditing(null); }}
          className={`pb-2 text-xs font-mono font-bold uppercase border-b-2 transition ${
            activeSubTab === "trends" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"
          }`}
        >
          Manage Google Trends
        </button>
        <button
          onClick={() => { setActiveSubTab("campaigns"); setIsEditing(null); }}
          className={`pb-2 text-xs font-mono font-bold uppercase border-b-2 transition ${
            activeSubTab === "campaigns" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"
          }`}
        >
          Manage Campaigns
        </button>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`p-2.5 text-xs font-mono border ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-rose-50 text-rose-800 border-rose-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 1. AGENTS SUB-TAB */}
      {activeSubTab === "agents" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agent Form */}
          <form onSubmit={handleAgentSubmit} className="p-4 border border-slate-200 bg-slate-50 space-y-3">
            <h3 className="text-xs font-mono font-black uppercase text-slate-900 flex items-center justify-between">
              <span>{isEditing ? `Edit Agent: ${isEditing}` : "Create Swarm Agent"}</span>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setAgentForm({
                      agentId: "",
                      name: "",
                      type: "ml",
                      roleDescription: "",
                      pipelineGroup: "ML_TRAINED",
                      status: "IDLE",
                      sentiment: 0,
                      engagementScore: 50,
                    });
                  }}
                  className="text-[10px] text-indigo-600 normal-case hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-600">Agent ID</label>
                <input
                  type="text"
                  disabled={!!isEditing}
                  value={agentForm.agentId}
                  onChange={(e) => setAgentForm({ ...agentForm, agentId: e.target.value })}
                  placeholder="e.g. ml_031"
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1 disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-600">Agent Name</label>
                <input
                  type="text"
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  placeholder="e.g. XGBoostAgent"
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-600">Pipeline Group</label>
                <select
                  value={agentForm.pipelineGroup}
                  onChange={(e) => setAgentForm({ ...agentForm, pipelineGroup: e.target.value })}
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1"
                >
                  <option value="ML_TRAINED">ML_TRAINED (Classical)</option>
                  <option value="PYTREND_SEARCH">PYTREND_SEARCH (Search)</option>
                  <option value="GROQ_LLM">GROQ_LLM (Llama Personas)</option>
                  <option value="QML_QUANTUM">QML_QUANTUM (Quantum)</option>
                  <option value="ADMIN_MASTER">ADMIN_MASTER</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-600">Agent Type</label>
                <select
                  value={agentForm.type}
                  onChange={(e) => setAgentForm({ ...agentForm, type: e.target.value })}
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1"
                >
                  <option value="ml">Classical ML (ml)</option>
                  <option value="pytrend">PyTrend Search (pytrend)</option>
                  <option value="groq">Groq LLaMA Persona (groq)</option>
                  <option value="qml">PennyLane QML (qml)</option>
                  <option value="admin">Admin Master (admin)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono font-bold text-slate-600">Role Description</label>
              <textarea
                value={agentForm.roleDescription}
                onChange={(e) => setAgentForm({ ...agentForm, roleDescription: e.target.value })}
                placeholder="e.g. Scans historical CPA averages to identify bidding margins..."
                className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1 text-xs h-16"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase rounded-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isEditing ? "Update Agent Node" : "Register Swarm Agent"}</span>
            </button>
          </form>

          {/* Agents List */}
          <div className="border border-slate-200 p-3 h-[380px] overflow-y-auto space-y-2">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase pb-1 flex justify-between items-center">
              <span>Swarm Nodes ({Object.keys(agents).length})</span>
              <button onClick={triggerRefresh} className="p-1 hover:bg-slate-100 rounded" title="Refresh local memory">
                <RefreshCw className="w-3 h-3 text-slate-500" />
              </button>
            </h4>
            {Object.values(agents).map((a: any) => (
              <div key={a.agentId} className="p-2 border border-slate-100 hover:bg-slate-50/70 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{a.name}</span>
                    <span className="text-[9px] font-mono bg-slate-100 px-1 text-slate-600">{a.agentId}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{a.pipelineGroup} • {a.type}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEditAgent(a)} className="p-1 hover:bg-indigo-50 text-indigo-600 rounded">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteAgent(a.agentId)} className="p-1 hover:bg-rose-50 text-rose-600 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TRENDS SUB-TAB */}
      {activeSubTab === "trends" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trend Form */}
          <form onSubmit={handleTrendSubmit} className="p-4 border border-slate-200 bg-slate-50 space-y-3">
            <h3 className="text-xs font-mono font-black uppercase text-slate-900 flex items-center justify-between">
              <span>{isEditing ? `Edit Trend: ${isEditing}` : "Create Target Trend"}</span>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setTrendForm({
                      trendId: "",
                      name: "",
                      hashtag: "",
                      source: "Google Trends",
                      growth: 50,
                      interest: 50,
                      velocity: 50,
                      status: "RISING",
                    });
                  }}
                  className="text-[10px] text-indigo-600 normal-case hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-600">Trend ID</label>
                <input
                  type="text"
                  disabled={!!isEditing}
                  value={trendForm.trendId}
                  onChange={(e) => setTrendForm({ ...trendForm, trendId: e.target.value })}
                  placeholder="e.g. trend_quantum"
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1 disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-600">Trend Name</label>
                <input
                  type="text"
                  value={trendForm.name}
                  onChange={(e) => setTrendForm({ ...trendForm, name: e.target.value })}
                  placeholder="e.g. Quantum Computing"
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-600">Hashtag</label>
                <input
                  type="text"
                  value={trendForm.hashtag}
                  onChange={(e) => setTrendForm({ ...trendForm, hashtag: e.target.value })}
                  placeholder="#QuantumAI"
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-600">Status</label>
                <select
                  value={trendForm.status}
                  onChange={(e) => setTrendForm({ ...trendForm, status: e.target.value })}
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1"
                >
                  <option value="RISING">RISING</option>
                  <option value="FALLING">FALLING</option>
                  <option value="PEAK">PEAK</option>
                  <option value="STEADY">STEADY</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-slate-500">Interest</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={trendForm.interest}
                  onChange={(e) => setTrendForm({ ...trendForm, interest: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-slate-500">Growth %</label>
                <input
                  type="number"
                  value={trendForm.growth}
                  onChange={(e) => setTrendForm({ ...trendForm, growth: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-mono font-bold text-slate-500">Velocity</label>
                <input
                  type="number"
                  value={trendForm.velocity}
                  onChange={(e) => setTrendForm({ ...trendForm, velocity: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 bg-white rounded-md mt-1"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase rounded-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isEditing ? "Update Trend Parameters" : "Register Trend"}</span>
            </button>
          </form>

          {/* Trends List */}
          <div className="border border-slate-200 p-3 h-[380px] overflow-y-auto space-y-2">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase pb-1 flex justify-between items-center">
              <span>Tracked Trends ({trends.length})</span>
              <button onClick={triggerRefresh} className="p-1 hover:bg-slate-100 rounded" title="Refresh local memory">
                <RefreshCw className="w-3 h-3 text-slate-500" />
              </button>
            </h4>
            {trends.map((t: any) => (
              <div key={t.trendId} className="p-2 border border-slate-100 hover:bg-slate-50/70 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <span className="text-[9px] font-mono bg-amber-50 border border-amber-200 px-1 text-amber-800">{t.hashtag}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Source: {t.source} | Velocity: {t.velocity} | Status: <strong className="text-indigo-600">{t.status}</strong>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEditTrend(t)} className="p-1 hover:bg-indigo-50 text-indigo-600 rounded">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteTrend(t.trendId)} className="p-1 hover:bg-rose-50 text-rose-600 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CAMPAIGNS SUB-TAB */}
      {activeSubTab === "campaigns" && (
        <div className="space-y-3">
          <div className="border border-slate-200 p-3 h-[420px] overflow-y-auto space-y-2 bg-white">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase pb-1 flex justify-between items-center">
              <span>Active Dispatched Campaigns ({campaigns.length})</span>
              <button onClick={triggerRefresh} className="p-1 hover:bg-slate-100 rounded" title="Refresh local memory">
                <RefreshCw className="w-3 h-3 text-slate-500" />
              </button>
            </h4>
            {campaigns.length === 0 ? (
              <div className="text-center p-6 text-xs text-slate-400 font-sans">
                No campaigns currently dispatched. Dispatch one using the "Create Campaign" form on the dashboard!
              </div>
            ) : (
              campaigns.map((c: any) => (
                <div key={c.campaignId} className="p-3 border border-slate-100 hover:bg-slate-50/70 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{c.campaignName}</span>
                      <span className="px-1.5 py-0.2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] uppercase font-mono">{c.channel}</span>
                      <span className="px-1.5 py-0.2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] uppercase font-mono">{c.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Spend: <strong>${c.spend.toLocaleString()}</strong> | Conversions: {c.conversions} | ROAS: <strong>{c.roas}x</strong>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 italic">"{c.caption}"</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDeleteCampaign(c.campaignId)} className="px-2.5 py-1 text-[10px] border border-rose-300 text-rose-600 bg-rose-50 hover:bg-rose-100 transition rounded flex items-center gap-1 font-mono uppercase">
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
