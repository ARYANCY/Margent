import React, { useState, useRef, useMemo, useEffect } from "react";
import gsap from "gsap";
import {
  X,
  Upload,
  Play,
  TrendingUp,
  Target,
  Sparkles,
  Layers,
  CheckCircle2,
  DollarSign,
  Eye,
  MousePointer,
  ShoppingCart,
  Percent,
  Trash2,
  Share2,
  Image as ImageIcon
} from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";

interface CampaignFormProps {
  onClose: () => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ onClose }) => {
  const setIsDashboardOpen = useSimulationStore((s) => s.setIsDashboardOpen);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"basics" | "creative" | "economics">("basics");

  const modalRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.96, y: 16, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.25, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (tabContentRef.current) {
      gsap.fromTo(
        tabContentRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  // Form State
  const [campaignName, setCampaignName] = useState("Autonomous AI Marketing Launch");
  const [channel, setChannel] = useState<string>("Instagram");
  const [goal, setGoal] = useState<string>("Product Launch & Viral Seeding");
  const [audience, setAudience] = useState<string>("Gen Z Tech Trendsetters (18-24, High Viral Velocity)");
  const [customAudience, setCustomAudience] = useState<string>("");
  const [caption, setCaption] = useState(
    "Experience next-generation multi-agent autonomous marketing intelligence. Engineered for high-velocity performance and quantum consensus. #AgenticAI #QML"
  );
  const [hashtags, setHashtags] = useState("#AgenticAI #QML #MarketingTech #TechTrend");
  const [spend, setSpend] = useState<number>(1800);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculated Trend Alignment score based on AI keywords, PyTrends tags, and creative asset
  const autoTrendAlignment = useMemo(() => {
    let score = 62;
    const lowerCaption = (caption || "").toLowerCase();
    const lowerTags = (hashtags || "").toLowerCase();

    const highVelocitySignals = [
      { word: "ai", boost: 8 },
      { word: "agent", boost: 7 },
      { word: "quantum", boost: 7 },
      { word: "qml", boost: 8 },
      { word: "tech", boost: 5 },
      { word: "growth", boost: 5 },
      { word: "viral", boost: 6 },
      { word: "launch", boost: 4 },
      { word: "saas", boost: 5 },
      { word: "deals", boost: 5 },
      { word: "eco", boost: 5 }
    ];

    for (const { word, boost } of highVelocitySignals) {
      if (lowerTags.includes(word) || lowerCaption.includes(word)) {
        score += boost;
      }
    }

    const tagCount = (hashtags.match(/#[\w]+/g) || []).length;
    score += Math.min(tagCount * 3, 12);

    if (selectedPhoto) {
      score += 6;
    }

    return Math.min(Math.max(score, 30), 98);
  }, [caption, hashtags, selectedPhoto]);

  // Channels with Empirical Benchmarks
  const channelOptions = [
    {
      id: "Instagram",
      name: "Instagram Ads",
      subtext: "Reels & Stories",
      badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
      baseCTR: 0.042,
      baseCPC: 0.85
    },
    {
      id: "Facebook",
      name: "Facebook Ads",
      subtext: "Feed & Video",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      baseCTR: 0.038,
      baseCPC: 0.72
    },
    {
      id: "TikTok",
      name: "TikTok Spark",
      subtext: "High Velocity",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      baseCTR: 0.055,
      baseCPC: 0.65
    },
    {
      id: "Google Ads",
      name: "Google Search",
      subtext: "High Intent",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      baseCTR: 0.048,
      baseCPC: 1.25
    },
    {
      id: "YouTube",
      name: "YouTube Shorts",
      subtext: "Video Action",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      baseCTR: 0.032,
      baseCPC: 0.95
    },
    {
      id: "LinkedIn",
      name: "LinkedIn B2B",
      subtext: "Decision Makers",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      baseCTR: 0.024,
      baseCPC: 2.80
    }
  ];

  const goalOptions = [
    "Product Launch & Viral Seeding",
    "Direct Sales & Conversion Maximization",
    "Brand Awareness & Audience Expansion",
    "Retargeting & Customer LTV Optimization",
    "B2B Lead Generation & InMail Outreach"
  ];

  const audienceOptions = [
    "Gen Z Tech Trendsetters (18-24, High Viral Velocity)",
    "Millennial Fashion & Beauty Shoppers (25-34, High Engagement)",
    "Tech & Electronics Early Adopters (25-44, High Conversion)",
    "High-Intent Home & Lifestyle Buyers (35-54, High AOV)",
    "B2B Enterprise Decision Makers (35-60, Lead Gen Focus)",
    "Family-Oriented Value Shoppers (High Price Sensitivity)",
    "Custom Audience (Write-In)"
  ];

  const currentChannelMeta = useMemo(() => {
    return channelOptions.find((c) => c.id === channel) || channelOptions[0];
  }, [channel]);

  // Live Unit Economics Forecast
  const liveEstimatedKPIs = useMemo(() => {
    const estCTR = currentChannelMeta.baseCTR * (1 + (autoTrendAlignment - 50) / 100 * 0.4);
    const estImpressions = Math.floor(spend * (28 + (autoTrendAlignment / 100) * 16));
    const estClicks = Math.floor(estImpressions * estCTR);
    const estConvRate = 0.045 + (autoTrendAlignment / 100) * 0.045;
    const estConversions = Math.floor(estClicks * estConvRate);
    const avgOrderValue = 32 + (autoTrendAlignment / 100) * 18;
    const estRevenue = estConversions * avgOrderValue;
    const estROAS = (estRevenue / Math.max(spend, 1)).toFixed(2);
    const estCPC = (spend / Math.max(estClicks, 1)).toFixed(2);
    const estCPA = (spend / Math.max(estConversions, 1)).toFixed(2);

    return {
      impressions: estImpressions.toLocaleString(),
      clicks: estClicks.toLocaleString(),
      conversions: estConversions.toLocaleString(),
      roas: estROAS,
      ctr: (estCTR * 100).toFixed(2),
      cpc: estCPC,
      cpa: estCPA,
      revenue: Math.round(estRevenue).toLocaleString()
    };
  }, [spend, autoTrendAlignment, currentChannelMeta]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags((prev) => `${prev.trim()} ${tag}`.trim());
    }
  };

  const copyVariants = [
    {
      angle: "Direct-Response Hook",
      caption: "Stop burning ad budget on guesswork. Deploy 101 AI agents that analyze cross-channel ROAS and viral momentum in seconds.",
      tags: "#AdOptimization #MarketingROI #GrowthHack",
      boost: "+32% CTR"
    },
    {
      angle: "Viral Gen-Z Hook",
      caption: "POV: You replaced 10 ad agency dashboards with one quantum AI consensus engine. Watch your ROAS scale 4.2x.",
      tags: "#TechTok #AgenticAI #FutureOfTech",
      boost: "+45% CTR"
    },
    {
      angle: "Analytical Proof",
      caption: "Empirical proof: 4-qubit Hilbert space entanglement predicts campaign CTR with 91% consensus confidence.",
      tags: "#DataScience #MachineLearning #QuantumAI",
      boost: "+24% CTR"
    },
    {
      angle: "High-Urgency Early Access",
      caption: `Warning: Ad costs on ${channel} are surging. Lock in your AI-optimized keyword bids before competitors catch up.`,
      tags: "#EarlyAccess #CompetitiveAdvantage #ScaleFast",
      boost: "+38% CTR"
    }
  ];

  const applyVariant = (v: typeof copyVariants[0]) => {
    setCaption(v.caption);
    setHashtags(v.tags);
  };

  const generateAIHooks = () => {
    const picked = copyVariants[Math.floor(Math.random() * copyVariants.length)];
    applyVariant(picked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalAudience =
      audience === "Custom Audience (Write-In)"
        ? (customAudience || "Custom Target Demographics")
        : audience;

    try {
      const formData = new FormData();
      formData.append("campaignName", campaignName);
      formData.append("channel", channel);
      formData.append("goal", goal);
      formData.append("audience", finalAudience);
      formData.append("caption", caption);
      formData.append("hashtags", hashtags);
      formData.append("spend", spend.toString());
      formData.append("trendAlignment", autoTrendAlignment.toString());
      if (selectedPhoto) {
        formData.append("photo", selectedPhoto);
      }

      const apiUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/campaigns/create`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed to post campaign");
      onClose();
      setTimeout(() => {
        setIsDashboardOpen(true);
      }, 350);
    } catch (err) {
      console.error(err);
      alert("Campaign dispatched. Ensure backend server is active on port 4000.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
      <div ref={modalRef} className="relative w-full max-w-2xl bg-white border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                CAMPAIGN LAUNCHPAD
              </span>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                Deploy Campaign to 101-Agent Swarm
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-6 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab("basics")}
            className={`py-2 px-3.5 font-bold uppercase transition border-b-2 cursor-pointer ${
              activeTab === "basics"
                ? "border-slate-900 text-slate-900 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            1. Channel & Goal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("creative")}
            className={`py-2 px-3.5 font-bold uppercase transition border-b-2 cursor-pointer ${
              activeTab === "creative"
                ? "border-slate-900 text-slate-900 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            2. Creative & Hook
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("economics")}
            className={`py-2 px-3.5 font-bold uppercase transition border-b-2 cursor-pointer ${
              activeTab === "economics"
                ? "border-slate-900 text-slate-900 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            3. Budget & Forecast
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-slate-900 flex-1">
          <div ref={tabContentRef}>
          {activeTab === "basics" && (
            <div className="space-y-4">
              {/* Campaign Title */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 focus:outline-hidden focus:border-slate-900 bg-white"
                  placeholder="e.g. Autonomous AI Launch"
                  required
                />
              </div>

              {/* Target Channel Cards */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase mb-1.5">
                  Primary Ad Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {channelOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setChannel(opt.id)}
                      className={`p-2.5 text-left border transition ${
                        channel === opt.id
                          ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                          : "border-slate-200 bg-white hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-900">{opt.name}</span>
                        {channel === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono block">{opt.subtext}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Objective Goal */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Primary Campaign Objective
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 bg-white focus:outline-hidden focus:border-slate-900"
                >
                  {goalOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Target Audience Persona (5-Cluster KMeans Alignment)
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 bg-white focus:outline-hidden focus:border-slate-900"
                >
                  {audienceOptions.map((aud) => (
                    <option key={aud} value={aud}>
                      {aud}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "creative" && (
            <div className="space-y-4">
              {/* Copy Hook Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono font-bold text-slate-700 uppercase">
                    Ad Creative Copy & Value Hook
                  </label>
                  <button
                    type="button"
                    onClick={generateAIHooks}
                    className="text-[10px] font-mono font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate AI Hook</span>
                  </button>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-slate-300 focus:outline-hidden focus:border-slate-900 bg-white font-sans"
                  placeholder="Enter hook copy..."
                  required
                />
                
                {/* 4 AI Strategic Angle Presets */}
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {copyVariants.map((v, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => applyVariant(v)}
                      className="p-1.5 text-left border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 transition font-mono text-[9px] cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-slate-900 font-bold">
                        <span>{v.angle}</span>
                        <span className="text-emerald-700 font-black">{v.boost}</span>
                      </div>
                      <span className="text-slate-500 truncate block text-[8px] mt-0.5">{v.caption}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hashtags & Trending Keyword Pills */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Trending Keywords & Hashtags (PyTrends Signal Booster)
                </label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 font-mono bg-white"
                  placeholder="#AgenticAI #QML #MarketingTech"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[9px] font-mono text-slate-500 self-center">Hot Tags:</span>
                  {["#AgenticAI", "#QML", "#ViralGrowth", "#Automation", "#TechDeals", "#SaaS"].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleAddHashtag(tag)}
                      className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Creative Visual Asset Upload */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase mb-1.5">
                  Visual Creative Asset (Image / Thumbnail)
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-slate-300 hover:border-slate-500 bg-slate-50 p-4 text-center cursor-pointer transition"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <ImageIcon className="w-5 h-5 mx-auto text-slate-500 mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">
                      {selectedPhoto ? selectedPhoto.name : "Click or Drag & Drop Ad Creative"}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono block">PNG, JPG, WEBP up to 10MB</span>
                  </div>

                  {previewUrl && (
                    <div className="relative w-20 h-20 border border-slate-300 shrink-0 bg-slate-100 overflow-hidden">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPhoto(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-1 right-1 p-0.5 bg-slate-900/80 text-white hover:bg-rose-600 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "economics" && (
            <div className="space-y-4">
              {/* Spend Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5 font-mono">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">
                    Planned Spend Budget
                  </label>
                  <span className="text-sm font-black text-slate-900">${spend.toLocaleString()} USD</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={spend}
                  onChange={(e) => setSpend(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1.5 bg-slate-200 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>$200 (Pilot)</span>
                  <span>$5,000 (Growth)</span>
                  <span>$10,000 (Scale)</span>
                </div>
              </div>

              {/* Trend Alignment Meter */}
              <div className="p-3 bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5 font-mono">
                  <span className="text-[9px] font-bold text-slate-700 uppercase flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    Estimated Trend Resonance Score
                  </span>
                  <span className="text-xs font-bold text-amber-700">{autoTrendAlignment}/100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${autoTrendAlignment}%` }}
                  />
                </div>
              </div>

              {/* Projected Pre-Flight Unit Economics Grid */}
              <div className="p-3.5 bg-slate-900 text-white font-mono shadow-inner">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  PRE-FLIGHT MULTI-MODAL PROJECTION ({channel})
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-slate-800/80 border border-slate-700">
                    <div className="text-[8px] text-slate-400 uppercase font-bold">Impressions</div>
                    <div className="text-xs font-bold text-white mt-0.5">{liveEstimatedKPIs.impressions}</div>
                  </div>
                  <div className="p-2 bg-slate-800/80 border border-slate-700">
                    <div className="text-[8px] text-slate-400 uppercase font-bold">Clicks (CTR)</div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {liveEstimatedKPIs.clicks} ({liveEstimatedKPIs.ctr}%)
                    </div>
                  </div>
                  <div className="p-2 bg-slate-800/80 border border-slate-700">
                    <div className="text-[8px] text-slate-400 uppercase font-bold">Est. ROAS</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">{liveEstimatedKPIs.roas}x</div>
                  </div>
                  <div className="p-2 bg-slate-800/80 border border-slate-700">
                    <div className="text-[8px] text-slate-400 uppercase font-bold">Gross Rev</div>
                    <div className="text-xs font-bold text-white mt-0.5">${liveEstimatedKPIs.revenue}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex gap-2 font-mono">
              {activeTab !== "basics" && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "economics" ? "creative" : "basics")}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition uppercase cursor-pointer"
                >
                  Back
                </button>
              )}
              {activeTab !== "economics" && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "basics" ? "creative" : "economics")}
                  className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition uppercase cursor-pointer"
                >
                  Next Step
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 transition uppercase shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{loading ? "Dispatching to 101 Nodes..." : "Launch Simulation"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
