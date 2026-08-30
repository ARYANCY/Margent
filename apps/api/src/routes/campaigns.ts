import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { dataStore } from "../services/store";
import { prisma } from "../services/prisma";
import { simulationScheduler } from "../services/simulationScheduler";
import { deriveCampaignMetrics } from "@shared/utils/canonicalMetrics";
import { CanonicalCampaign, MarketingChannel, VALID_CHANNELS } from "@shared/types";

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

// GET /api/campaigns with Search & Channel Filter Query Parameters
campaignsRouter.get("/", (req: Request, res: Response) => {
  try {
    let campaigns = simulationScheduler.getEngine().getState().campaigns || [];
    const { channel, search, limit } = req.query;

    if (typeof channel === "string" && channel !== "ALL") {
      campaigns = campaigns.filter(c => c.channel.toLowerCase() === channel.toLowerCase());
    }

    if (typeof search === "string" && search.trim()) {
      const q = search.toLowerCase();
      campaigns = campaigns.filter(c => 
        c.campaignName.toLowerCase().includes(q) || 
        c.audience.toLowerCase().includes(q) ||
        (c.caption && c.caption.toLowerCase().includes(q))
      );
    }

    if (limit && !isNaN(Number(limit))) {
      campaigns = campaigns.slice(0, Number(limit));
    }

    res.json(campaigns);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to query campaigns", details: err.message });
  }
});

// GET /api/campaigns/:id
campaignsRouter.get("/:id", (req: Request, res: Response) => {
  const campaigns = simulationScheduler.getEngine().getState().campaigns || [];
  const campaign = campaigns.find(c => c.campaignId === req.params.id);
  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" });
  }
  res.json(campaign);
});

// POST /api/campaigns/create with Strict Schema & Input Validation
campaignsRouter.post("/create", upload.single("photo"), async (req: Request, res: Response) => {
  try {
    const { campaignName, channel, goal, audience, caption, hashtags, spend, trendAlignment } = req.body;

    // Strict Validation
    if (!campaignName || typeof campaignName !== "string" || campaignName.trim().length === 0) {
      return res.status(400).json({ error: "Validation Error: campaignName is required." });
    }

    const parsedSpend = parseFloat(spend);
    if (isNaN(parsedSpend) || parsedSpend <= 0) {
      return res.status(400).json({ error: "Validation Error: spend must be a positive number." });
    }

    let parsedAlignment = parseFloat(trendAlignment);
    if (isNaN(parsedAlignment) || parsedAlignment < 0 || parsedAlignment > 100) {
      parsedAlignment = 85;
    }

    const targetChannel: MarketingChannel = VALID_CHANNELS.includes(channel) ? channel : "Instagram";
    const targetAudience = (audience && typeof audience === "string" && audience.trim()) ? audience.trim() : "General Target Demographic";
    const targetCaption = (caption && typeof caption === "string" && caption.trim()) ? caption.trim() : "Autonomous AI Marketing Initiative";

    let parsedHashtags: string[] = [];
    if (typeof hashtags === "string") {
      parsedHashtags = hashtags.split(/[,\s]+/).map(h => h.trim()).filter(h => h.length > 0).map(h => h.startsWith("#") ? h : `#${h}`);
    } else if (Array.isArray(hashtags)) {
      parsedHashtags = hashtags;
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Channel-specific baseline benchmarks
    const channelMultipliers: Record<string, { cpc: number; ctr: number }> = {
      Instagram: { cpc: 0.85, ctr: 0.042 },
      Facebook: { cpc: 0.72, ctr: 0.038 },
      TikTok: { cpc: 0.65, ctr: 0.055 },
      "Google Ads": { cpc: 1.25, ctr: 0.048 },
      YouTube: { cpc: 0.95, ctr: 0.032 },
      LinkedIn: { cpc: 2.80, ctr: 0.024 },
      Pinterest: { cpc: 0.78, ctr: 0.035 }
    };

    const benchmark = channelMultipliers[targetChannel] || { cpc: 0.80, ctr: 0.040 };
    const impressions = Math.floor(parsedSpend * (28 + (parsedAlignment / 100) * 16));
    const ctr = benchmark.ctr * (1 + (parsedAlignment - 50) / 100 * 0.35);
    const clicks = Math.max(1, Math.floor(impressions * ctr));
    const convRate = 0.045 + (parsedAlignment / 100) * 0.045;
    const conversions = Math.max(1, Math.floor(clicks * convRate));
    const avgOrderValue = 30 + (parsedAlignment / 100) * 16;
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
      campaignName: campaignName.trim(),
      channel: targetChannel,
      goal: goal || "Product Launch & Viral Seeding",
      audience: targetAudience,
      caption: targetCaption,
      hashtags: parsedHashtags,
      imageUrl,
      date: new Date().toISOString().split("T")[0],
      spend: parsedSpend,
      impressions,
      clicks,
      conversions,
      revenue,
      engagements,
      ...derived,
      trendAlignment: parsedAlignment,
      status: "ACTIVE"
    };

    dataStore.addCampaign(newCampaign);
    simulationScheduler.getEngine().setActiveCampaign(newCampaign);

    // Trigger immediate multi-modal tick
    await simulationScheduler.getEngine().executeTick();

    res.status(201).json({
      success: true,
      message: "Campaign dispatched across 101 nodes successfully.",
      campaign: newCampaign
    });
  } catch (err: any) {
    console.error("[Campaigns Router] Dispatch error:", err);
    res.status(500).json({ error: "Failed to dispatch campaign", details: err.message });
  }
});

// PUT update campaign (Admin)
campaignsRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campaignData = req.body;

    const spend = parseFloat(campaignData.spend);
    const impressions = parseInt(campaignData.impressions, 10);
    const clicks = parseInt(campaignData.clicks, 10);
    const conversions = parseInt(campaignData.conversions, 10);
    const revenue = parseFloat(campaignData.revenue);

    const derived = deriveCampaignMetrics({
      spend: isNaN(spend) ? 0 : spend,
      impressions: isNaN(impressions) ? 0 : impressions,
      clicks: isNaN(clicks) ? 0 : clicks,
      conversions: isNaN(conversions) ? 0 : conversions,
      revenue: isNaN(revenue) ? 0 : revenue,
      engagements: clicks * 2
    });

    const updatedDbCampaign = await prisma.canonicalCampaign.update({
      where: { campaignId: id },
      data: {
        campaignName: campaignData.campaignName,
        channel: campaignData.channel,
        goal: campaignData.goal,
        audience: campaignData.audience,
        caption: campaignData.caption,
        hashtags: campaignData.hashtags || [],
        imageUrl: campaignData.imageUrl,
        date: campaignData.date,
        spend: spend || undefined,
        impressions: impressions || undefined,
        clicks: clicks || undefined,
        conversions: conversions || undefined,
        revenue: revenue || undefined,
        engagements: clicks * 2 || undefined,
        ...derived,
        trendAlignment: campaignData.trendAlignment ? parseFloat(campaignData.trendAlignment) : undefined,
        status: campaignData.status,
      }
    });

    const formattedCampaign: CanonicalCampaign = {
      ...updatedDbCampaign,
      channel: updatedDbCampaign.channel as any,
      status: updatedDbCampaign.status as any,
      goal: updatedDbCampaign.goal || undefined,
      caption: updatedDbCampaign.caption || undefined,
      imageUrl: updatedDbCampaign.imageUrl || undefined,
    };

    // Update in memory & active state
    const dsIndex = dataStore.campaigns.findIndex(c => c.campaignId === id);
    if (dsIndex !== -1) {
      dataStore.campaigns[dsIndex] = formattedCampaign;
    }
    const stateCampaigns = simulationScheduler.getEngine().getState().campaigns || [];
    const stateIndex = stateCampaigns.findIndex(c => c.campaignId === id);
    if (stateIndex !== -1) {
      stateCampaigns[stateIndex] = formattedCampaign;
    }

    if (simulationScheduler.getEngine().getState().activeCampaign?.campaignId === id) {
      simulationScheduler.getEngine().setActiveCampaign(formattedCampaign);
    }

    res.json(formattedCampaign);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update campaign", details: err.message });
  }
});

// DELETE campaign (Admin)
campaignsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete from PostgreSQL
    await prisma.canonicalCampaign.delete({
      where: { campaignId: id }
    });

    // Delete from in-memory arrays & state
    dataStore.campaigns = dataStore.campaigns.filter(c => c.campaignId !== id);
    const engineState = simulationScheduler.getEngine().getState();
    engineState.campaigns = (engineState.campaigns || []).filter(c => c.campaignId !== id);

    if (engineState.activeCampaign?.campaignId === id) {
      engineState.activeCampaign = engineState.campaigns[0] || undefined;
    }

    res.json({ success: true, message: `Campaign ${id} deleted successfully.` });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete campaign", details: err.message });
  }
});
