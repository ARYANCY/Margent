"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignsRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const store_1 = require("../services/store");
const simulationScheduler_1 = require("../services/simulationScheduler");
const canonicalMetrics_1 = require("@shared/utils/canonicalMetrics");
const types_1 = require("@shared/types");
const uploadDir = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const safeName = `campaign_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
        cb(null, safeName);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed."));
        }
    }
});
exports.campaignsRouter = (0, express_1.Router)();
// GET /api/campaigns with Search & Channel Filter Query Parameters
exports.campaignsRouter.get("/", (req, res) => {
    try {
        let campaigns = simulationScheduler_1.simulationScheduler.getEngine().getState().campaigns || [];
        const { channel, search, limit } = req.query;
        if (typeof channel === "string" && channel !== "ALL") {
            campaigns = campaigns.filter(c => c.channel.toLowerCase() === channel.toLowerCase());
        }
        if (typeof search === "string" && search.trim()) {
            const q = search.toLowerCase();
            campaigns = campaigns.filter(c => c.campaignName.toLowerCase().includes(q) ||
                c.audience.toLowerCase().includes(q) ||
                (c.caption && c.caption.toLowerCase().includes(q)));
        }
        if (limit && !isNaN(Number(limit))) {
            campaigns = campaigns.slice(0, Number(limit));
        }
        res.json(campaigns);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to query campaigns", details: err.message });
    }
});
// GET /api/campaigns/:id
exports.campaignsRouter.get("/:id", (req, res) => {
    const campaigns = simulationScheduler_1.simulationScheduler.getEngine().getState().campaigns || [];
    const campaign = campaigns.find(c => c.campaignId === req.params.id);
    if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
    }
    res.json(campaign);
});
// POST /api/campaigns/create with Strict Schema & Input Validation
exports.campaignsRouter.post("/create", upload.single("photo"), async (req, res) => {
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
        const targetChannel = types_1.VALID_CHANNELS.includes(channel) ? channel : "Instagram";
        const targetAudience = (audience && typeof audience === "string" && audience.trim()) ? audience.trim() : "General Target Demographic";
        const targetCaption = (caption && typeof caption === "string" && caption.trim()) ? caption.trim() : "Autonomous AI Marketing Initiative";
        let parsedHashtags = [];
        if (typeof hashtags === "string") {
            parsedHashtags = hashtags.split(/[,\s]+/).map(h => h.trim()).filter(h => h.length > 0).map(h => h.startsWith("#") ? h : `#${h}`);
        }
        else if (Array.isArray(hashtags)) {
            parsedHashtags = hashtags;
        }
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        // Channel-specific baseline benchmarks
        const channelMultipliers = {
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
        const derived = (0, canonicalMetrics_1.deriveCampaignMetrics)({
            spend: parsedSpend,
            impressions,
            clicks,
            conversions,
            revenue,
            engagements
        });
        const newCampaign = {
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
        store_1.dataStore.addCampaign(newCampaign);
        simulationScheduler_1.simulationScheduler.getEngine().setActiveCampaign(newCampaign);
        // Trigger immediate multi-modal tick
        await simulationScheduler_1.simulationScheduler.getEngine().executeTick();
        res.status(201).json({
            success: true,
            message: "Campaign dispatched across 101 nodes successfully.",
            campaign: newCampaign
        });
    }
    catch (err) {
        console.error("[Campaigns Router] Dispatch error:", err);
        res.status(500).json({ error: "Failed to dispatch campaign", details: err.message });
    }
});
