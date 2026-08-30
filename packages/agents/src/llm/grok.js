"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmClient = exports.LLMClient = exports.CleanedDataSchema = exports.AdminSynthesisSchema = exports.AgentDecisionSchema = void 0;
/**
 * Grok / xAI LLM Client with Structured Outputs & Deterministic Fallback Mode
 */
const zod_1 = require("zod");
exports.AgentDecisionSchema = zod_1.z.object({
    action: zod_1.z.enum([
        "LIKE",
        "COMMENT",
        "IGNORE",
        "QUESTION",
        "INTEREST",
        "REJECT",
        "CONVERSION"
    ]),
    sentiment: zod_1.z.number().min(-1).max(1),
    topic: zod_1.z.string(),
    confidence: zod_1.z.number().min(0).max(1),
    reason: zod_1.z.string(),
    simulatedComment: zod_1.z.string().optional()
});
exports.AdminSynthesisSchema = zod_1.z.object({
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    decision: zod_1.z.enum([
        "SCALE",
        "MAINTAIN",
        "INVESTIGATE",
        "EXPERIMENT",
        "REDUCE",
        "STOP"
    ]),
    summary: zod_1.z.string(),
    evidence: zod_1.z.array(zod_1.z.string()),
    recommendedActions: zod_1.z.array(zod_1.z.string()),
    confidence: zod_1.z.number().min(0).max(1),
    exploitationAllocation: zod_1.z.number().min(0).max(1),
    explorationAllocation: zod_1.z.number().min(0).max(1)
});
exports.CleanedDataSchema = zod_1.z.object({
    sanitizedCaption: zod_1.z.string(),
    extractedKeywords: zod_1.z.array(zod_1.z.string()),
    semanticTone: zod_1.z.string(),
    semanticBoost: zod_1.z.number(),
    urgencyScore: zod_1.z.number(),
    cleanedSpend: zod_1.z.number(),
    cleanedHashtags: zod_1.z.array(zod_1.z.string())
});
class LLMClient {
    apiKey;
    model;
    isDemoMode;
    constructor(options) {
        const env = typeof process !== "undefined" && process?.env ? process.env : {};
        this.apiKey = options?.apiKey || env.GROQ_API_KEY || env.XAI_API_KEY || "";
        if (options?.model) {
            this.model = options.model;
        }
        else if (env.GROQ_API_KEY) {
            this.model = env.GROQ_MODEL || "llama-3.3-70b-versatile";
        }
        else {
            this.model = env.XAI_MODEL || "grok-4.6";
        }
        this.isDemoMode = !this.apiKey || env.DEMO_MODE === "true";
    }
    getApiUrl() {
        const env = typeof process !== "undefined" && process?.env ? process.env : {};
        if (env.GROQ_API_KEY || this.model.includes("llama") || this.model.includes("groq")) {
            return "https://api.groq.com/openai/v1/chat/completions";
        }
        return "https://api.x.ai/v1/chat/completions";
    }
    async cleanAndProcessCampaignData(params) {
        const rawCaption = (params.caption || "").trim();
        const rawTags = params.hashtags || ["#AgenticAI", "#MarketingTech"];
        const tagsStr = rawTags.join(" ");
        if (!this.isDemoMode && this.apiKey) {
            try {
                const response = await fetch(this.getApiUrl(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            {
                                role: "system",
                                content: "You are the Grok Data Cleaning & Semantic Feature Middleware. Sanitize the campaign input, remove spam/artifacts, extract high-intent keywords, and score semantic tone. Output JSON with: sanitizedCaption, extractedKeywords (array of strings), semanticTone (string), semanticBoost (number 0.8-1.3), urgencyScore (number 0.0-1.0), cleanedSpend (number), cleanedHashtags (array of strings). Raw JSON only."
                            },
                            {
                                role: "user",
                                content: `Campaign: "${params.campaignName}" on ${params.channel}\nCaption: ${rawCaption}\nHashtags: ${tagsStr}\nSpend: ${params.spend}\nAudience: ${params.audience}\nTrend: ${params.trend}`
                            }
                        ],
                        response_format: { type: "json_object" },
                        temperature: 0.2
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    const parsed = JSON.parse(data.choices[0].message.content);
                    return exports.CleanedDataSchema.parse(parsed);
                }
            }
            catch (err) {
                console.warn(`[Grok Data Cleaning] Fallback to deterministic cleaning: ${err}`);
            }
        }
        const cleanedTags = rawTags
            .map((t) => t.trim())
            .filter(Boolean)
            .map((t) => (t.startsWith("#") ? t : `#${t}`));
        const sanitizedCaption = rawCaption.replace(/[<>{}|\\]/g, "").trim() || "Autonomous AI Marketing Initiative";
        const extractedKeywords = cleanedTags.slice(0, 3).map((t) => t.replace("#", ""));
        return {
            sanitizedCaption,
            extractedKeywords: extractedKeywords.length > 0 ? extractedKeywords : [params.trend || "AI Marketing"],
            semanticTone: "High Velocity / Tech Innovator",
            semanticBoost: 1.05,
            urgencyScore: 0.88,
            cleanedSpend: Math.max(100, params.spend || 1800),
            cleanedHashtags: cleanedTags.length > 0 ? cleanedTags : ["#AgenticAI", "#TechGrowth"]
        };
    }
    async generateCustomerReaction(params) {
        // If API key is available and demo mode is off, make structured call to Grok
        if (!this.isDemoMode && this.apiKey) {
            try {
                const response = await fetch(this.getApiUrl(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            {
                                role: "system",
                                content: `You are a simulated customer agent (${params.agentId}: ${params.agentName}, segment: ${params.segment}). Respond with a JSON object containing: action (LIKE, COMMENT, IGNORE, QUESTION, INTEREST, REJECT, CONVERSION), sentiment (-1 to 1), topic, confidence (0 to 1), reason, and simulatedComment (1 short natural social media sentence). Output raw JSON only.`
                            },
                            {
                                role: "user",
                                content: `Campaign: "${params.campaignTitle}" on ${params.channel}\nCaption: ${params.caption}\nHashtags: ${params.hashtags.join(" ")}\nTrend Alignment: ${params.trendAlignment}/100`
                            }
                        ],
                        response_format: { type: "json_object" },
                        temperature: 0.7
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    const parsed = JSON.parse(data.choices[0].message.content);
                    return exports.AgentDecisionSchema.parse(parsed);
                }
            }
            catch (err) {
                console.warn(`[Grok API] Falling back to deterministic reasoning: ${err}`);
            }
        }
        // High quality deterministic simulation reasoning
        const affinity = (params.trendAlignment / 100) * params.trendSensitivity + (1 - params.priceSensitivity) * 0.4;
        const sentiment = Math.min(0.95, Math.max(-0.6, (affinity - 0.45) * 1.8));
        let action = "IGNORE";
        let comment = "";
        if (affinity > 0.75) {
            action = Math.random() > 0.4 ? "LIKE" : (Math.random() > 0.5 ? "COMMENT" : "CONVERSION");
            const positiveComments = [
                `This is exactly what I was looking for! Love the ${params.hashtags[0] || "tech"} angle.`,
                `Super clean implementation, definitely checking this out. 🔥`,
                `Finally a brand that gets how to use ${params.hashtags[0] || "modern tech"} right!`,
                `Take my money! Placed an order right away. 🚀`
            ];
            comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
        }
        else if (affinity > 0.45) {
            action = Math.random() > 0.5 ? "QUESTION" : "INTEREST";
            const questionComments = [
                `Looks interesting! Does it support real-time sync with existing tools?`,
                `Curious about pricing and team tier options for this.`,
                `How does this compare to standard alternatives in the market?`,
                `Great concept! What's the rollout timeline for this?`
            ];
            comment = questionComments[Math.floor(Math.random() * questionComments.length)];
        }
        else {
            action = Math.random() > 0.6 ? "IGNORE" : "REJECT";
            const skepticalComments = [
                `Feels a bit pricey for what it offers.`,
                `Another ${params.hashtags[0] || "AI"} trend campaign... show me the real utility.`,
                `Not sure this solves my daily workflow bottleneck.`
            ];
            comment = skepticalComments[Math.floor(Math.random() * skepticalComments.length)];
        }
        return {
            action,
            sentiment: Math.round(sentiment * 100) / 100,
            topic: params.hashtags[0] || params.campaignTitle,
            confidence: Math.round((0.7 + Math.random() * 0.25) * 100) / 100,
            reason: `Calculated resonance based on ${params.segment} affinity (${Math.round(affinity * 100)}%) and trend alignment (${params.trendAlignment}%).`,
            simulatedComment: (action === "COMMENT" || action === "QUESTION" || action === "CONVERSION" || action === "REJECT") ? comment : undefined
        };
    }
    async generateAdminSynthesis(params) {
        if (!this.isDemoMode && this.apiKey) {
            try {
                const response = await fetch(this.getApiUrl(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            {
                                role: "system",
                                content: `You are the Admin Intelligence Agent. Synthesize marketing metrics and provide an executive decision JSON: priority (LOW, MEDIUM, HIGH, CRITICAL), decision (SCALE, MAINTAIN, INVESTIGATE, EXPERIMENT, REDUCE, STOP), summary, evidence (array of strings), recommendedActions (array of strings), confidence (0-1), exploitationAllocation (0-1), explorationAllocation (0-1). Output JSON only.`
                            },
                            {
                                role: "user",
                                content: JSON.stringify(params)
                            }
                        ],
                        response_format: { type: "json_object" },
                        temperature: 0.3
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    const parsed = JSON.parse(data.choices[0].message.content);
                    return exports.AdminSynthesisSchema.parse(parsed);
                }
            }
            catch (err) {
                console.warn(`[Grok API] Admin synthesis fallback: ${err}`);
            }
        }
        // High quality deterministic Admin synthesis
        let decision = "SCALE";
        let priority = "HIGH";
        if (params.roas >= 3.0 && params.sentiment > 0.3) {
            decision = "SCALE";
            priority = "HIGH";
        }
        else if (params.roas >= 1.8 && params.sentiment >= 0) {
            decision = "MAINTAIN";
            priority = "MEDIUM";
        }
        else if (params.anomalies.length > 0 || params.roas < 1.2) {
            decision = params.roas < 0.8 ? "STOP" : "INVESTIGATE";
            priority = "CRITICAL";
        }
        else {
            decision = "EXPERIMENT";
            priority = "MEDIUM";
        }
        const evidence = [
            `Trend '${params.topTrendName}' registered score of ${params.topTrendScore}/100.`,
            `Simulated ROAS achieved ${params.roas.toFixed(2)}x on ${params.channel} (Benchmark: 2.0x).`,
            `Audience sentiment measured at ${params.sentiment > 0 ? "+" : ""}${params.sentiment.toFixed(2)} across ${params.activeAgentCount} evaluated nodes.`,
            `Observed CTR of ${(params.ctr * 100).toFixed(2)}% with ${params.conversions} simulated conversions.`
        ];
        if (params.anomalies.length > 0) {
            evidence.push(`Detected anomalies: ${params.anomalies.join("; ")}`);
        }
        const actions = [
            decision === "SCALE"
                ? `Increase ad spend on ${params.channel} by 35% targeting Tech Enthusiasts & Trendsetters.`
                : `Optimize creative assets and retest with lower cost segments.`,
            `Maintain 80% budget on high-traction signals and 20% on emerging trend exploration.`,
            `Deploy variant messaging leveraging trending hashtag #${params.topTrendName.replace(/\\s+/g, "")}.`
        ];
        return {
            priority,
            decision,
            summary: `The campaign demonstrated strong alignment with '${params.topTrendName}', resulting in a simulated ROAS of ${params.roas.toFixed(2)}x and ${Math.round(params.sentiment * 100)}% positive sentiment.`,
            evidence,
            recommendedActions: actions,
            confidence: 0.89,
            exploitationAllocation: 0.80,
            explorationAllocation: 0.20
        };
    }
}
exports.LLMClient = LLMClient;
exports.llmClient = new LLMClient();
