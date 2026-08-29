import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Play
} from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";

interface CampaignFormProps {
  onClose: () => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ onClose }) => {
  const setIsDashboardOpen = useSimulationStore((s) => s.setIsDashboardOpen);
  const [loading, setLoading] = useState(false);

  const [campaignName, setCampaignName] = useState("Autonomous AI Marketing Launch");
  const [channel, setChannel] = useState<string>("TikTok");
  const [audience, setAudience] = useState("Gen Z & Tech Creators");
  const [caption, setCaption] = useState(
    "Experience the next evolution in generative marketing intelligence. Built for modern high-velocity creators. #AgenticAI #QML"
  );
  const [hashtags, setHashtags] = useState("#AgenticAI #QML #MarketingTech #TechTrend");
  const [spend, setSpend] = useState(1800);
  const [trendAlignment, setTrendAlignment] = useState(92);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("campaignName", campaignName);
      formData.append("channel", channel);
      formData.append("audience", audience);
      formData.append("caption", caption);
      formData.append("hashtags", hashtags);
      formData.append("spend", spend.toString());
      formData.append("trendAlignment", trendAlignment.toString());
      if (selectedPhoto) {
        formData.append("photo", selectedPhoto);
      }

      const res = await fetch("http://localhost:4000/api/campaigns/create", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed to post campaign");
      const data = await res.json();
      console.log("Campaign created:", data);

      onClose();
      // Automatically open the sliding dashboard
      setTimeout(() => {
        setIsDashboardOpen(true);
      }, 600);
    } catch (err) {
      console.error(err);
      alert("Failed to submit campaign. Ensure backend is running on port 4000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-xl bg-white border-4 border-slate-950 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-slate-900 bg-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest block">CAMPAIGN DISPATCH</span>
            <h2 className="text-sm font-black text-slate-950 uppercase tracking-tight">
              LAUNCH 101-AGENT SIMULATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-slate-900 text-slate-950 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-950 flex-1 bg-white">
          {/* Campaign Title */}
          <div>
            <label className="block text-[10px] font-mono font-black text-slate-700 uppercase tracking-wider mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white font-mono transition"
              required
            />
          </div>

          {/* Photo Upload & Preview */}
          <div>
            <label className="block text-[10px] font-mono font-black text-slate-700 uppercase tracking-wider mb-1">
              Creative Asset / Ad Visual
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-900 hover:bg-slate-100 bg-slate-50 p-4 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[100px]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {previewUrl ? (
                <div className="flex items-center space-x-3">
                  <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover border-2 border-slate-900" />
                  <div className="text-left font-mono text-xs">
                    <div className="font-black text-slate-950">{selectedPhoto?.name}</div>
                    <div className="text-[10px] text-slate-600 font-bold">Click to change image</div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-1">
                  <Upload className="w-6 h-6 text-slate-950" />
                  <span className="text-xs font-black text-slate-950 uppercase">Upload Ad Image</span>
                  <span className="text-[10px] text-slate-600 font-mono font-bold">PNG, JPG, WEBP (Max 10MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Channel & Audience */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-black text-slate-700 uppercase tracking-wider mb-1">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white font-mono transition"
              >
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="X">X (Twitter)</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="YouTube">YouTube</option>
                <option value="Multi-Channel">Multi-Channel</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-black text-slate-700 uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white font-mono transition"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-[10px] font-mono font-black text-slate-700 uppercase tracking-wider mb-1">
              Ad Copy & Caption
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white font-mono transition resize-none"
              required
            />
          </div>

          {/* Hashtags & Quick Pills */}
          <div>
            <label className="block text-[10px] font-mono font-black text-slate-700 uppercase tracking-wider mb-1">
              Hashtags
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 text-xs text-slate-950 font-bold focus:outline-none focus:bg-white font-mono transition"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["#AgenticAI", "#QML", "#MarketingTech", "#SpatialAudio", "#AutonomousAI"].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleAddHashtag(tag)}
                  className="px-2 py-0.5 text-[10px] font-mono font-black bg-slate-100 hover:bg-slate-200 text-slate-950 border-2 border-slate-900 transition"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Spend & Trend Alignment */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-100 border-2 border-slate-900">
            <div>
              <div className="flex justify-between text-[10px] font-mono font-black text-slate-700 mb-1">
                <span>BUDGET (USD)</span>
                <span className="text-slate-950 text-xs">${spend}</span>
              </div>
              <input
                type="range"
                min={200}
                max={10000}
                step={100}
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
                className="w-full accent-slate-950"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono font-black text-slate-700 mb-1">
                <span>TREND ALIGNMENT</span>
                <span className="text-slate-950 text-xs">{trendAlignment}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={trendAlignment}
                onChange={(e) => setTrendAlignment(Number(e.target.value))}
                className="w-full accent-slate-950"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-mono font-black uppercase tracking-widest bg-slate-950 hover:bg-slate-800 text-white border-2 border-slate-950 flex items-center justify-center gap-2 shadow-md transition"
            >
              {loading ? (
                <>Simulating across 101 Nodes...</>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Post & Launch 101-Agent Simulation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
