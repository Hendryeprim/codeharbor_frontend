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
      <div className="p-8 rounded-3xl bg-[#140F28]/70 border border-[#322659]/60 flex items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#C084FC]" />
        <span className="text-xs text-[#C084FC] font-mono">Running automated AI codebase diagnostics...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-[#140F28]/80 border border-[#A855F7]/30 shadow-harbor-glow space-y-6 text-[#E2E8F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#322659]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A855F7] to-[#C084FC] p-0.5">
            <div className="w-full h-full bg-[#0A0713] rounded-[10px] flex items-center justify-center text-[#C084FC]">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Harbor AI Codebase Diagnostics</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/40">
                AI Verified
              </span>
            </div>
            <p className="text-xs text-[#C0C7D1]">Automated security, scalability, and cloud architecture audit</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0E0A1C] px-4 py-2 rounded-2xl border border-[#322659]/70">
          <span className="text-xs text-slate-400">Architecture Health:</span>
          <span className="text-lg font-black text-[#C084FC]">{data.overallHealthScore}%</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0E0A1C]/80 border border-[#322659] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C084FC]" />
              <span>Security Profile</span>
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500/20 text-[#C084FC] border border-[#C084FC]/40">
              {data.securityRating?.score}
            </span>
          </div>
          <p className="text-[11px] text-[#C0C7D1] leading-relaxed">
            {data.securityRating?.details}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0A1C]/80 border border-[#322659] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-[#A855F7]" />
              <span>Scalability Index</span>
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-black bg-sky-500/20 text-[#A855F7] border border-[#A855F7]/40">
              {data.scalabilityIndex?.score}
            </span>
          </div>
          <p className="text-[11px] text-[#C0C7D1] leading-relaxed">
            {data.scalabilityIndex?.details}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0A1C]/80 border border-[#322659] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#A855F7]" />
              <span>Clean Code Rating</span>
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-black bg-cyan-500/20 text-[#A855F7] border border-[#A855F7]/40">
              {data.codeQuality?.score}
            </span>
          </div>
          <p className="text-[11px] text-[#C0C7D1] leading-relaxed">
            {data.codeQuality?.details}
          </p>
        </div>
      </div>

      {/* AI Next Feature Recommendations */}
      <div className="p-4 rounded-2xl bg-[#0E0A1C] border border-[#322659]/80 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C084FC] flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          <span>AI-Suggested Enterprise Enhancements</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {data.recommendedNextFeatures?.map((rec, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-[#140F28] border border-[#322659]/60 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC] shrink-0 mt-0.5" />
              <span className="text-[11px] text-[#C0C7D1]">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

