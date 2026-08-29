import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { dataStore } from "../services/store";
import { simulationScheduler } from "../services/simulationScheduler";
import { deriveCampaignMetrics } from "@shared/utils/canonicalMetrics";
import { CanonicalCampaign } from "@shared/types";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `campaign_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed."));
    }
  }
});

export const campaignsRouter = Router();

campaignsRouter.get("/", (req, res) => {
  const campaigns = simulationScheduler.getEngine().getState().campaigns;
  res.json(campaigns);
});

campaignsRouter.get("/:id", (req, res) => {
  const campaigns = simulationScheduler.getEngine().getState().campaigns;
  const campaign = campaigns.find(c => c.campaignId === req.params.id);
  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" });
  }
  res.json(campaign);
});

campaignsRouter.post("/create", upload.single("photo"), async (req, res) => {
  try {
    const { campaignName, channel, audience, caption, hashtags, spend, trendAlignment } = req.body;

    const parsedSpend = parseFloat(spend) || 1200;
    const parsedAlignment = parseFloat(trendAlignment) || 88;
    
    let parsedHashtags: string[] = [];
    if (typeof hashtags === "string") {
      parsedHashtags = hashtags.split(/[,\s]+/).map(h => h.trim()).filter(h => h.length > 0).map(h => h.startsWith("#") ? h : `#${h}`);
    } else if (Array.isArray(hashtags)) {
      parsedHashtags = hashtags;
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const impressions = Math.floor(parsedSpend * (25 + Math.random() * 20));
    const ctr = 0.035 + (parsedAlignment / 100) * 0.03 + (Math.random() * 0.01);
    const clicks = Math.floor(impressions * ctr);
    const convRate = 0.065 + (parsedAlignment / 100) * 0.04;
    const conversions = Math.floor(clicks * convRate);
    const avgOrderValue = 28 + (parsedAlignment / 100) * 12;
    const revenue = Math.floor(conversions * avgOrderValue);
    const engagements = Math.floor(clicks * 2.2);

    const derived = deriveCampaignMetrics({
      spend: parsedSpend,
      impressions,
      clicks,
      conversions,
      revenue,
      engagements
    });

    const newCampaign: CanonicalCampaign = {
      campaignId: `camp_${Date.now().toString(36)}`,
      campaignName: campaignName || "Autonomous Marketing Blitz",
      channel: channel || "TikTok",
      audience: audience || "Gen Z Creators",
      caption: caption || "Autonomous AI campaign execution",
      hashtags: parsedHashtags,
      imageUrl,
      date: new Date().toISOString().split("T")[0],
      spend: parsedSpend,
      impressions,
      clicks,
      conversions,
      revenue,
      engagements,
      trendAlignment: parsedAlignment,
      ...derived,
      status: "ACTIVE"
    };

    dataStore.addCampaign(newCampaign);
    await simulationScheduler.step();

    const state = simulationScheduler.getEngine().getState();

    res.status(201).json({
      success: true,
      campaign: newCampaign,
      adminAnalysis: state.adminAnalysis,
      message: "Campaign dispatched and 101-agent simulation triggered"
    });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ error: error.message || "Failed to create campaign" });
  }
});
