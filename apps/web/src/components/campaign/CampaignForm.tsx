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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md select-none">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] rounded-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Campaign Dispatch</span>
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight mt-0.5">
              Launch 101-Agent Simulation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-750 flex-1 bg-white">
          {/* Campaign Title */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:bg-white rounded-xl focus:border-indigo-500/70 transition-all font-semibold"
              required
            />
          </div>

          {/* Photo Upload & Preview */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Creative Asset / Ad Visual
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 bg-slate-50/20 p-4 text-center cursor-pointer rounded-2xl transition-all flex flex-col items-center justify-center min-h-[100px]"
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
                  <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover border border-slate-200 rounded-xl" />
                  <div className="text-left font-semibold text-xs">
                    <div className="text-slate-800">{selectedPhoto?.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Click to change image</div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-1.5">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">Upload Ad Image</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, WEBP (Max 10MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Channel & Audience */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:bg-white rounded-xl focus:border-indigo-500/70 transition-all font-semibold"
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
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:bg-white rounded-xl focus:border-indigo-500/70 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Ad Copy & Caption
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-850 focus:outline-none focus:bg-white rounded-xl focus:border-indigo-500/70 transition-all font-medium resize-none leading-relaxed"
              required
            />
          </div>

          {/* Hashtags & Quick Pills */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Hashtags
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-850 focus:outline-none focus:bg-white rounded-xl focus:border-indigo-500/70 transition-all font-semibold"
            />
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {["#AgenticAI", "#QML", "#MarketingTech", "#SpatialAudio", "#AutonomousAI"].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleAddHashtag(tag)}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-slate-100 hover:bg-slate-200/80 text-slate-650 transition-all border border-transparent font-medium"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Spend & Trend Alignment */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Budget (USD)</span>
                <span className="text-slate-800 font-extrabold text-xs">${spend}</span>
              </div>
              <input
                type="range"
                min={200}
                max={10000}
                step={100}
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
                className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>Trend Alignment</span>
                <span className="text-slate-800 font-extrabold text-xs">{trendAlignment}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={trendAlignment}
                onChange={(e) => setTrendAlignment(Number(e.target.value))}
                className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs font-bold uppercase tracking-widest bg-slate-900 hover:bg-slate-850 text-white rounded-full flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 transition-all duration-200"
            >
              {loading ? (
                <>Simulating across 101 Nodes...</>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Post & Launch Simulation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
