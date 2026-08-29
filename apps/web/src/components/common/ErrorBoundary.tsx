import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Margent Error Boundary Caught Error]:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 font-mono select-none">
          <div className="max-w-md w-full bg-white border border-slate-300 shadow-2xl p-6 text-center">
            <div className="w-10 h-10 bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h1 className="text-xs font-black uppercase tracking-tight text-slate-900 mb-1">
              SYSTEM RECOVERY ACTIVATED
            </h1>
            <p className="text-[11px] text-slate-600 font-sans mb-4 leading-relaxed">
              An unexpected component error occurred in the simulation visualizer. The system has trapped the exception safely.
            </p>
            <div className="p-2.5 bg-slate-100 border border-slate-200 text-[10px] text-slate-800 text-left font-mono truncate mb-4">
              {this.state.error?.message || "Unknown rendering exception"}
            </div>
            <button
              onClick={this.handleReload}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESTART SIMULATION WORKSPACE</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
