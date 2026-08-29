import fs from "fs";
import path from "path";
import { AgentProfile, CanonicalCampaign, RealTrend, AgentEvent, AdminAnalysis } from "@shared/types";
import { generateAgentRegistry } from "@agents/registry";
import { deriveCampaignMetrics } from "@shared/utils/canonicalMetrics";

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

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    this.agents = generateAgentRegistry();

    const trendsPath = path.join(process.cwd(), "datasets", "trends.json");
    if (fs.existsSync(trendsPath)) {
      try {
        this.trends = JSON.parse(fs.readFileSync(trendsPath, "utf-8"));
      } catch (err) {
        console.warn("[DataStore] Could not read trends.json:", err);
      }
    }

    const campaignsCsvPath = path.join(process.cwd(), "datasets", "campaigns.csv");
    if (fs.existsSync(campaignsCsvPath)) {
      try {
        const rawLines = fs.readFileSync(campaignsCsvPath, "utf-8").trim().split(/\r?\n/);
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

            this.campaigns.push({
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
              trendAlignment,
              ...derived,
              status: "ACTIVE"
            });
          }
        }
      } catch (err) {
        console.warn("[DataStore] Could not parse campaigns.csv:", err);
      }
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

  public addCampaign(campaign: CanonicalCampaign) {
    this.campaigns.unshift(campaign);
  }

  public addEvent(event: AgentEvent) {
    this.events.unshift(event);
    if (this.events.length > 500) {
      this.events.pop();
    }
  }

  public addAdminAnalysis(analysis: AdminAnalysis) {
    this.adminAnalyses.unshift(analysis);
  }
}

export const dataStore = new DataStore();
