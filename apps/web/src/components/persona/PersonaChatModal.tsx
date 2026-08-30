import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
  CheckCircle2,
  Brain,
  ChevronRight,
  RefreshCw,
  Zap
} from "lucide-react";
import { useSimulationStore } from "../../stores/simulationStore";

export interface PersonaChatProps {
  initialPersona?: string;
  initialStance?: "FOR" | "AGAINST";
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const ALL_PERSONAS = [
  // 80% FOR (Advocates)
  {
    name: "Gen Z Digital Native & Early Adopter",
    stance: "FOR" as const,
    polarity: "+0.85",
    desc: "Values fast-paced, unscripted authentic video hooks and creator proof."
  },
  {
    name: "Direct-Response Growth Strategist",
    stance: "FOR" as const,
    polarity: "+0.78",
    desc: "Evaluates conversion clarity, value proposition, and CTA placement."
  },
  {
    name: "Viral Creator & Trendsetter",
    stance: "FOR" as const,
    polarity: "+0.92",
    desc: "Assesses cultural relevance, shareability, and algorithm multiplier."
  },
  {
    name: "High-Intent Enterprise Buyer",
    stance: "FOR" as const,
    polarity: "+0.70",
    desc: "Focused on workflow automation, time-to-value, and executive ROI."
  },
  {
    name: "Impulse Shopper & Lifestyle Enthusiast",
    stance: "FOR" as const,
    polarity: "+0.82",
    desc: "Responsive to visual aesthetics, exclusivity, and 1-click checkout."
  },
  {
    name: "Brand Loyalty & Community Champion",
    stance: "FOR" as const,
    polarity: "+0.75",
    desc: "Advocates for long-term customer trust, authenticity, and mission."
  },

  // 20% AGAINST (Skeptics)
  {
    name: "Skeptical Enterprise Procurement Officer (ROI Doubts)",
    stance: "AGAINST" as const,
    polarity: "-0.35",
    desc: "Demands verified case study audits and explicit financial ROI evidence."
  },
  {
    name: "Budget-Conscious Pragmatist (Price Resistance)",
    stance: "AGAINST" as const,
    polarity: "-0.45",
    desc: "Questions upfront pricing barrier and insists on risk-free trial."
  },
  {
    name: "Ad-Fatigued Cynical Consumer (Attention Decay)",
    stance: "AGAINST" as const,
    polarity: "-0.55",
    desc: "Instantly skips corporate buzzwords and demands zero-fluff demo."
  },
  {
    name: "Risk-Averse Media Director (CPA Spike Concerns)",
    stance: "AGAINST" as const,
    polarity: "-0.25",
    desc: "Warns of rapid audience saturation and rising auction CPC volatility."
  },
  {
    name: "Privacy & Security Auditor (Compliance Scrutiny)",
    stance: "AGAINST" as const,
    polarity: "-0.40",
    desc: "Scrutinizes data governance, proprietary privacy, and encryption."
  },
  {
    name: "Competitor Loyalty Loyalist (High Switching Cost)",
    stance: "AGAINST" as const,
    polarity: "-0.30",
    desc: "Entrenched in legacy software and needs a 10x migration incentive."
  }
];

export const PersonaChatModal: React.FC<PersonaChatProps> = ({
  initialPersona,
  isOpen,
  onClose
}) => {
  const activeCampaign = useSimulationStore((s) => s.activeCampaign);
  const [selectedPersona, setSelectedPersona] = useState<string>(
    initialPersona || ALL_PERSONAS[0].name
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentPersonaObj =
    ALL_PERSONAS.find((p) => p.name === selectedPersona) || ALL_PERSONAS[0];

  const currentStance = currentPersonaObj.stance;
  const isSkeptic = currentStance === "AGAINST";

  // Reset or initialize welcome message when persona changes
  useEffect(() => {
    if (initialPersona) {
      setSelectedPersona(initialPersona);
    }
  }, [initialPersona]);

  useEffect(() => {
    const welcomeText = isSkeptic
      ? `Hey! I'm evaluating your ad from the perspective of a ${selectedPersona}. Honestly, I have some skepticism about your claims and friction points. What would you like to clarify?`
      : `Hey there! I'm checking out your campaign as a ${selectedPersona}. I really like the hook and energy! Ask me anything about how this creative resonates with my audience.`;

    setMessages([
      {
        role: "assistant",
        content: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, [selectedPersona]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiUrl =
        (import.meta as any).env?.VITE_API_URL ||
        (typeof window !== "undefined"
          ? `${window.location.protocol}//${window.location.hostname}:4000`
          : "http://localhost:4000");

      const response = await fetch(`${apiUrl}/api/simulation/persona/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: selectedPersona,
          stance: isSkeptic ? "AGAINST (Devil's Advocate)" : "FOR (Constructive Champion)",
          campaignContext: {
            campaignName: activeCampaign?.campaignName || "Agentic AI Marketing Campaign",
            caption: activeCampaign?.caption || "Autonomous AI Marketing Intelligence",
            channel: activeCampaign?.channel || "Instagram",
            spend: activeCampaign?.spend || 1800,
            audience: activeCampaign?.audience || "Tech Early Adopters"
          },
          messages: updatedHistory.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.reply || "Thanks for the question! Let's optimize this campaign further.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // Fallback response
      const fallbackReply = isSkeptic
        ? `As a ${selectedPersona}, I still need more concrete proof and a risk-free trial before I'd convert on ${activeCampaign?.channel || 'this channel'}.`
        : `As a ${selectedPersona}, adding a UGC video demo and a 1-click CTA would definitely boost my willingness to buy!`;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterQuestions = isSkeptic
    ? [
        "What is your biggest hesitation with our price point?",
        "How should we rewrite the first 3 seconds to keep your attention?",
        "What proof or guarantee would make you convert immediately?"
      ]
    : [
        "What part of the hook grabbed your attention most?",
        "How can we make this ad even more viral on this channel?",
        "What bonus or offer would get you to purchase right away?"
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white border-2 border-slate-900 shadow-2xl w-full max-w-3xl h-[85vh] max-h-[720px] flex flex-col font-sans overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 border ${isSkeptic ? 'bg-rose-950 border-rose-500 text-rose-400' : 'bg-emerald-950 border-emerald-500 text-emerald-400'}`}>
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase tracking-wider">
                  Groq LLaMA 3.3 Cognitive Persona Chat
                </span>
                <span className={`px-2 py-0.5 text-[8px] font-mono font-black uppercase border ${isSkeptic ? 'bg-rose-500 text-white border-rose-600' : 'bg-emerald-500 text-white border-emerald-600'}`}>
                  {isSkeptic ? "20% Against Skeptic" : "80% For Advocate"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Ask qualitative questions directly to simulated audience segments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Persona Selector Strip */}
        <div className="p-2.5 bg-slate-100 border-b border-slate-200 shrink-0 flex items-center gap-2 overflow-x-auto">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase shrink-0">
            Select Persona:
          </span>
          {ALL_PERSONAS.map((p) => {
            const isSelected = p.name === selectedPersona;
            const pIsSkeptic = p.stance === "AGAINST";
            return (
              <button
                key={p.name}
                onClick={() => setSelectedPersona(p.name)}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold whitespace-nowrap transition border cursor-pointer ${
                  isSelected
                    ? pIsSkeptic
                      ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                      : "bg-emerald-700 text-white border-emerald-800 shadow-xs"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {pIsSkeptic ? "🔴 " : "🟢 "}
                {p.name.split(" (")[0]}
              </button>
            );
          })}
        </div>

        {/* Active Persona Bio Callout */}
        <div className={`px-4 py-2 text-[11px] font-mono border-b shrink-0 flex items-center justify-between ${isSkeptic ? 'bg-rose-50/70 border-rose-200 text-rose-950' : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'}`}>
          <div className="flex items-center gap-2">
            <span className="font-bold">{selectedPersona}</span>
            <span className="text-[9px] text-slate-500">|</span>
            <span className="text-[10px] text-slate-600 font-sans">{currentPersonaObj.desc}</span>
          </div>
          <span className="text-[10px] font-bold">Sentiment Polarity: {currentPersonaObj.polarity}</span>
        </div>

        {/* Message Stream */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center text-xs font-mono font-bold shrink-0 border ${
                    isUser
                      ? "bg-slate-900 text-white border-slate-900"
                      : isSkeptic
                      ? "bg-rose-100 text-rose-800 border-rose-300"
                      : "bg-emerald-100 text-emerald-800 border-emerald-300"
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[80%] p-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-slate-900 text-white border border-slate-900"
                      : "bg-white text-slate-900 border border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono mb-1 opacity-70">
                    <span>{isUser ? "Marketer (You)" : selectedPersona.split(" (")[0]}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="font-sans whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-700" />
              <span>{selectedPersona.split(" (")[0]} is reasoning with LLaMA 3.3...</span>
            </div>
          )}
        </div>

        {/* Starter Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-200 shrink-0 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase shrink-0">
            Suggested Prompts:
          </span>
          {starterQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-2.5 py-1 text-[10px] font-sans bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 whitespace-nowrap transition cursor-pointer disabled:opacity-50"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask ${selectedPersona.split(" (")[0]} anything about your campaign...`}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-xs font-sans bg-slate-50 border border-slate-300 focus:border-slate-900 focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 uppercase transition disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
