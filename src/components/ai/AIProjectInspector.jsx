import React, { useState, useEffect } from 'react';
import { aiAPI } from '../../services/api';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Server,
  Cloud,
} from 'lucide-react';

export const AIProjectInspector = ({ slug, projectTitle }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const res = await aiAPI.analyzeArchitecture(slug);
        if (res.success) setData(res.analysis);
      } catch (err) {
        console.error('Failed to load AI architecture diagnostics:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchAnalysis();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-[#131B2E]/70 border border-[#334155]/60 flex items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#00FFC6]" />
        <span className="text-xs text-[#00FFC6] font-mono">Running automated AI codebase diagnostics...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-[#131B2E]/80 border border-[#22D3EE]/30 shadow-harbor-glow space-y-6 text-[#E2E8F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#334155]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-[#00FFC6] p-0.5">
            <div className="w-full h-full bg-[#0B0F1A] rounded-[10px] flex items-center justify-center text-[#00FFC6]">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Harbor AI Codebase Diagnostics</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#00FFC6]/15 text-[#00FFC6] border border-[#00FFC6]/40">
                AI Verified
              </span>
            </div>
            <p className="text-xs text-[#C0C7D1]">Automated security, scalability, and cloud architecture audit</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0F172A] px-4 py-2 rounded-2xl border border-[#334155]/70">
          <span className="text-xs text-slate-400">Architecture Health:</span>
          <span className="text-lg font-black text-[#00FFC6]">{data.overallHealthScore}%</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-[#334155] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00FFC6]" />
              <span>Security Profile</span>
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500/20 text-[#00FFC6] border border-[#00FFC6]/40">
              {data.securityRating?.score}
            </span>
          </div>
          <p className="text-[11px] text-[#C0C7D1] leading-relaxed">
            {data.securityRating?.details}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-[#334155] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-[#0EA5E9]" />
              <span>Scalability Index</span>
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-black bg-sky-500/20 text-[#0EA5E9] border border-[#0EA5E9]/40">
              {data.scalabilityIndex?.score}
            </span>
          </div>
          <p className="text-[11px] text-[#C0C7D1] leading-relaxed">
            {data.scalabilityIndex?.details}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-[#334155] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#22D3EE]" />
              <span>Clean Code Rating</span>
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-black bg-cyan-500/20 text-[#22D3EE] border border-[#22D3EE]/40">
              {data.codeQuality?.score}
            </span>
          </div>
          <p className="text-[11px] text-[#C0C7D1] leading-relaxed">
            {data.codeQuality?.details}
          </p>
        </div>
      </div>

      {/* AI Next Feature Recommendations */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155]/80 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#00FFC6] flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          <span>AI-Suggested Enterprise Enhancements</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {data.recommendedNextFeatures?.map((rec, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-[#131B2E] border border-[#334155]/60 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00FFC6] shrink-0 mt-0.5" />
              <span className="text-[11px] text-[#C0C7D1]">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

