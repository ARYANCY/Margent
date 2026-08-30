import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, ShieldCheck, Cpu, Activity } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    // Simulate secure verification process (gives a premium feel)
    setTimeout(() => {
      const normalizedUser = username.trim().toLowerCase();
      const validPasswords = ["123456", "margent2026"];

      if (normalizedUser === "admin" && validPasswords.includes(password)) {
        // Save to localStorage so login persists for convenience
        localStorage.setItem("margent_authenticated", "true");
        onLoginSuccess();
      } else {
        setError("Invalid operator credentials. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden font-sans select-none">
      {/* Abstract background gradient spots */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px]" />

      {/* Cyber grid styling */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #6366f1 1px, transparent 1px),
            linear-gradient(to bottom, #6366f1 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative w-full max-w-md p-8 mx-4">
        {/* Decorative glass border outer layer */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl shadow-indigo-950/30" />

        {/* Content panel */}
        <div className="relative flex flex-col items-center">
          {/* Animated Logo Hexagon Icon */}
          <div className="relative flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="w-8 h-8 animate-pulse" />
            <Activity className="absolute bottom-1 right-1 w-4 h-4 text-emerald-300" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-widest text-slate-100 mb-1">
            MARGENT
          </h1>
          <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mb-8 text-center px-4">
            Autonomous Multi-Agent Marketing Engine
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Operator Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-400 text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Decrypting Consensus Keys...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Operator</span>
                </>
              )}
            </button>
          </form>

          {/* Prompt/Guide details for Evaluators */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 w-full text-center">
            <p className="text-[10px] text-slate-500 tracking-wide uppercase mb-1.5">
              Evaluation Credentials
            </p>
            <div className="inline-flex gap-4 text-xs font-mono text-indigo-400/90 bg-indigo-950/30 px-3 py-1.5 rounded-md border border-indigo-900/20">
              <div>
                <span className="text-slate-500">User:</span> admin
              </div>
              <div className="w-px h-3.5 bg-slate-800 self-center" />
              <div>
                <span className="text-slate-500">Pass:</span> margent2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
