import fs from "fs";
import path from "path";
import { AgentProfile, CanonicalCampaign, RealTrend, AgentEvent, AdminAnalysis } from "@shared/types";
import { generateAgentRegistry } from "@agents/registry";
import { deriveCampaignMetrics } from "@shared/utils/canonicalMetrics";
import { prisma } from "./prisma";

/**
 * Robust CSV line parser supporting quoted strings and embedded commas.
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export class DataStore {
  public agents: AgentProfile[] = [];
  public trends: RealTrend[] = [];
  public campaigns: CanonicalCampaign[] = [];
  public events: AgentEvent[] = [];
  public adminAnalyses: AdminAnalysis[] = [];

  public isReady: Promise<void>;

  constructor() {
    this.isReady = this.initializeData();
  }

  private async initializeData() {
    console.log("[DataStore] Initializing store with Prisma PostgreSQL...");
    
    // Ensure database client is connected
    try {
      await prisma.$connect();
      console.log("[DataStore] Connected to PostgreSQL successfully.");
    } catch (e) {
      console.error("[DataStore] Failed to connect to PostgreSQL. Make sure DATABASE_URL is set in .env", e);
    }

    // 1. Initialize Agents
    try {
      const dbAgents = await prisma.agentProfile.findMany();
      if (dbAgents.length > 0) {
        this.agents = dbAgents.map((a: any) => ({
          ...a,
          type: a.type as any,
          pipelineGroup: a.pipelineGroup as any,
          status: a.status as any,
          segment: a.segment as any,
        }));
        console.log(`[DataStore] Loaded ${this.agents.length} agents from DB.`);
      } else {
        const initialAgents = generateAgentRegistry();
        this.agents = initialAgents;
        console.log(`[DataStore] Seeding database with ${initialAgents.length} initial agents...`);
        await prisma.agentProfile.createMany({
          data: initialAgents.map((a: any) => ({
            agentId: a.agentId,
            name: a.name,
            type: a.type,
            roleDescription: a.roleDescription,
            avatar: a.avatar,
            pipelineGroup: a.pipelineGroup,
            status: a.status,
            sentiment: a.sentiment,
            engagementScore: a.engagementScore,
            lastAction: a.lastAction || null,
            lastActionTime: a.lastActionTime || null,
            segment: a.segment || null,
            trendSensitivity: a.trendSensitivity || null,
            priceSensitivity: a.priceSensitivity || null,
            brandAffinity: a.brandAffinity || null,
            engagementProbability: a.engagementProbability || null,
            specialization: a.specialization || null,
            modelType: a.modelType || null,
            quantumExpectation: a.quantumExpectation || null,
            searchMomentumScore: a.searchMomentumScore || null,
          })),
        });
      }
    } catch (err) {
      console.error("[DataStore] Error loading/seeding agents:", err);
      this.agents = generateAgentRegistry();
    }

    // 2. Initialize Trends
    try {
      const dbTrends = await prisma.realTrend.findMany();
      if (dbTrends.length > 0) {
        this.trends = dbTrends.map((t: any) => ({
          ...t,
          status: t.status as any,
        }));
        console.log(`[DataStore] Loaded ${this.trends.length} trends from DB.`);
      } else {
        const trendsPath = path.join(process.cwd(), "datasets", "trends.json");
        if (fs.existsSync(trendsPath)) {
          try {
            const rawTrends: RealTrend[] = JSON.parse(fs.readFileSync(trendsPath, "utf-8"));
            this.trends = rawTrends;
            console.log(`[DataStore] Seeding database with ${rawTrends.length} trends...`);
            await prisma.realTrend.createMany({
              data: rawTrends.map((t: any) => ({
                trendId: t.trendId,
                name: t.name,
                hashtag: t.hashtag,
                source: t.source,
                timestamp: t.timestamp,
                growth: t.growth,
                interest: t.interest,
                velocity: t.velocity,
                status: t.status,
              })),
            });
          } catch (err) {
            console.warn("[DataStore] Could not read or seed trends.json:", err);
          }
        }
      }
    } catch (err) {
      console.error("[DataStore] Error loading/seeding trends:", err);
    }

    // 3. Initialize Campaigns
    try {
      const dbCampaigns = await prisma.canonicalCampaign.findMany({
        orderBy: { date: "desc" }
      });
      if (dbCampaigns.length > 0) {
        this.campaigns = dbCampaigns.map((c: any) => ({
          ...c,
          channel: c.channel as any,
          status: c.status as any,
        }));
        console.log(`[DataStore] Loaded ${this.campaigns.length} campaigns from DB.`);
      } else {
        const campaignsCsvPath = path.join(process.cwd(), "datasets", "campaigns.csv");
        if (fs.existsSync(campaignsCsvPath)) {
          try {
            const rawLines = fs.readFileSync(campaignsCsvPath, "utf-8").trim().split(/\r?\n/);
            const campaignsToSeed: CanonicalCampaign[] = [];
            for (let i = 1; i < rawLines.length; i++) {
              if (!rawLines[i].trim()) continue;
              const cols = parseCsvLine(rawLines[i]);
              if (cols.length >= 9) {
                const spend = parseFloat(cols[3]) || 1000;
                const impressions = parseInt(cols[4], 10) || 50000;
                const clicks = parseInt(cols[5], 10) || 2500;
                const conversions = parseInt(cols[6], 10) || 250;
                const revenue = parseFloat(cols[7]) || 5000;
                const trendAlignment = parseFloat(cols[8]) || 85;
                const derived = deriveCampaignMetrics({ spend, impressions, clicks, conversions, revenue, engagements: clicks * 2 });

                campaignsToSeed.push({
                  campaignId: cols[0],
                  campaignName: cols[0],
                  channel: (cols[1] || "Instagram") as any,
                  audience: cols[2] || "General Audience",
                  date: new Date().toISOString().split("T")[0],
                  spend,
                  impressions,
                  clicks,
                  conversions,
                  revenue,
                  engagements: clicks * 2,
                  ...derived,
                  trendAlignment,
                  status: "ACTIVE"
                });
              }
            }
            this.campaigns = campaignsToSeed;
            console.log(`[DataStore] Seeding database with ${campaignsToSeed.length} campaigns...`);
            await prisma.canonicalCampaign.createMany({
              data: campaignsToSeed.map((c: any) => ({
                campaignId: c.campaignId,
                campaignName: c.campaignName,
                channel: c.channel,
                goal: c.goal || null,
                audience: c.audience,
                caption: c.caption || null,
                hashtags: c.hashtags || [],
                imageUrl: c.imageUrl || null,
                date: c.date,
                spend: c.spend,
                impressions: c.impressions,
                clicks: c.clicks,
                conversions: c.conversions,
                revenue: c.revenue,
                engagements: c.engagements,
                ctr: c.ctr,
                cpc: c.cpc,
                conversionRate: c.conversionRate,
                roas: c.roas,
                engagementRate: c.engagementRate,
                trendAlignment: c.trendAlignment,
                status: c.status,
              })),
            });
          } catch (err) {
            console.warn("[DataStore] Could not parse or seed campaigns.csv:", err);
          }
        }
      }
    } catch (err) {
      console.error("[DataStore] Error loading/seeding campaigns:", err);
    }

    // 4. Initialize Events
    try {
      const dbEvents = await prisma.agentEvent.findMany({
        orderBy: { timestamp: "desc" },
        take: 500
      });
      this.events = dbEvents.map((e: any) => ({
        eventId: e.eventId,
        source: e.source,
        target: e.target || undefined,
        type: e.type as any,
        timestamp: Number(e.timestamp),
        payload: e.payload as any,
      }));
      console.log(`[DataStore] Loaded ${this.events.length} events from DB.`);
    } catch (err) {
      console.error("[DataStore] Error loading events from DB:", err);
    }

    // 5. Initialize Admin Analyses
    try {
      const dbAnalyses = await prisma.adminAnalysis.findMany({
        orderBy: { timestamp: "desc" },
        take: 100
      });
      this.adminAnalyses = dbAnalyses.map((a: any) => ({
        decision: a.decision as any,
        confidence: a.confidence,
        simulatedRoas: a.simulatedRoas,
        summary: a.summary,
        evidence: a.evidence,
        recommendedActions: a.recommendedActions,
        ensembleBreakdown: a.ensembleBreakdown as any,
        nodeEvaluations: a.nodeEvaluations as any,
        activeAgentsCount: a.activeAgentsCount,
        timestamp: a.timestamp
      }));
      console.log(`[DataStore] Loaded ${this.adminAnalyses.length} admin analyses from DB.`);
    } catch (err) {
      console.error("[DataStore] Error loading admin analyses from DB:", err);
    }
  }

  public getAgents(): AgentProfile[] {
    return this.agents;
  }

  public getTrends(): RealTrend[] {
    return this.trends;
  }

  public getCampaigns(): CanonicalCampaign[] {
    return this.campaigns;
  }

  public async addCampaign(campaign: CanonicalCampaign) {
    this.campaigns.unshift(campaign);
    try {
      await prisma.canonicalCampaign.create({
        data: {
          campaignId: campaign.campaignId,
          campaignName: campaign.campaignName,
          channel: campaign.channel,
          goal: campaign.goal || null,
          audience: campaign.audience,
          caption: campaign.caption || null,
          hashtags: campaign.hashtags || [],
          imageUrl: campaign.imageUrl || null,
          date: campaign.date,
          spend: campaign.spend,
          impressions: campaign.impressions,
          clicks: campaign.clicks,
          conversions: campaign.conversions,
          revenue: campaign.revenue,
          engagements: campaign.engagements,
          ctr: campaign.ctr,
          cpc: campaign.cpc,
          conversionRate: campaign.conversionRate,
          roas: campaign.roas,
          engagementRate: campaign.engagementRate,
          trendAlignment: campaign.trendAlignment,
          status: campaign.status,
        }
      });
    } catch (err) {
      console.error("[DataStore] Failed to write campaign to PostgreSQL:", err);
    }
  }

  public async addEvent(event: AgentEvent) {
    this.events.unshift(event);
    if (this.events.length > 500) {
      this.events.pop();
    }
    try {
      await prisma.agentEvent.create({
        data: {
          eventId: event.eventId,
          source: event.source,
          target: event.target || null,
          type: event.type,
          timestamp: BigInt(event.timestamp),
          payload: event.payload,
        }
      });
    } catch (err) {
      console.error("[DataStore] Failed to write event to PostgreSQL:", err);
    }
  }

  public async addAdminAnalysis(analysis: AdminAnalysis) {
    this.adminAnalyses.unshift(analysis);
    try {
      await prisma.adminAnalysis.create({
        data: {
          decision: analysis.decision,
          confidence: analysis.confidence,
          simulatedRoas: analysis.simulatedRoas,
          summary: analysis.summary,
          evidence: analysis.evidence,
          recommendedActions: analysis.recommendedActions || [],
          ensembleBreakdown: analysis.ensembleBreakdown as any,
          nodeEvaluations: analysis.nodeEvaluations as any || [],
          activeAgentsCount: analysis.activeAgentsCount,
          timestamp: analysis.timestamp,
        }
      });
    } catch (err) {
      console.error("[DataStore] Failed to write admin analysis to PostgreSQL:", err);
    }
  }
}

export const dataStore = new DataStore();
