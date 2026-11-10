import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiAPI, getFullImageUrl } from '../../services/api';
import {
  Sparkles,
  Bot,
  X,
  Send,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Compass,
} from 'lucide-react';

export const HarborAICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const quickPrompts = [
    'Enterprise multi-tenant SaaS workspace',
    'Free React & Tailwind developer kit',
    'Enterprise recurring billing system',
    'Interactive video learning LMS portal',
  ];

  const handleAskAI = async (queryText) => {
    const q = queryText || prompt;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await aiAPI.matchProject({ prompt: q });
      if (res.success) {
        setResponse(res);
      } else {
        setError(res.message || 'AI could not process request.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to Harbor AI service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Futuristic Launcher Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 px-5 py-3 rounded-full bg-[#140F28]/90 border border-[#A855F7]/50 hover:border-[#C084FC] shadow-harbor-glow hover:shadow-purple-glow transition-all duration-300 backdrop-blur-xl animate-fadeIn hover:scale-105"
        >
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C084FC] absolute -top-0.5 -right-0.5 animate-ping" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#A855F7] to-[#C084FC] flex items-center justify-center text-white font-black">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#C084FC] leading-none">
              Next-Gen Copilot
            </p>
            <p className="text-xs font-extrabold text-[#E2E8F0] group-hover:text-white transition">
              Harbor AI Architect
            </p>
          </div>
        </button>
      )}

      {/* Futuristic Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#0A0713]/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0E0A1C] border border-[#A855F7]/40 sm:rounded-3xl shadow-harbor-lg overflow-hidden flex flex-col max-h-[90vh] text-[#E2E8F0]">
            {/* Header */}
            <div className="px-6 py-4 bg-[#140F28]/80 border-b border-[#322659]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A855F7] via-[#A855F7] to-[#C084FC] p-0.5 shadow-purple-glow">
                  <div className="w-full h-full bg-[#0A0713] rounded-[10px] flex items-center justify-center text-[#C084FC]">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-white">Harbor AI Copilot</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#C084FC]/10 text-[#C084FC] border border-[#C084FC]/30">
                      v2.5 AI Engine
                    </span>
                  </div>
                  <p className="text-[11px] text-[#C0C7D1]">
                    Semantic architecture matching & project requirements analyst
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#322659]/50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Initial Greeting */}
              {!response && !loading && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#140F28]/70 border border-[#322659]/60 space-y-2">
                    <p className="text-xs font-semibold text-[#A855F7] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C084FC]" />
                      <span>Ask Harbor AI for Instant Project Recommendations</span>
                    </p>
                    <p className="text-xs text-[#C0C7D1] leading-relaxed">
                      Describe your software requirements, desired database, or target domain. Harbor AI will inspect our repository, analyze technology fits, and recommend the best production-ready architecture.
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                      Popular Prompts
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((qp, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setPrompt(qp);
                            handleAskAI(qp);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1C1636] hover:bg-[#A855F7]/20 border border-[#322659] hover:border-[#A855F7]/50 text-xs text-[#E2E8F0] hover:text-[#A855F7] transition"
                        >
                          {qp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 animate-spin text-[#C084FC]" />
                    <Sparkles className="w-4 h-4 text-[#A855F7] absolute inset-0 m-auto" />
                  </div>
                  <p className="text-xs font-mono text-[#C084FC] animate-pulse">
                    Analyzing semantic architecture & repository vectors...
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
                  {error}
                </div>
              )}

              {/* AI Response Cards */}
              {response && (
                <div className="space-y-5 animate-fadeIn">
                  {/* AI Insight Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#140F28] via-[#0E0A1C] to-[#1C1636] border border-[#A855F7]/30 space-y-3 shadow-harbor-glow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C084FC] flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>AI Architectural Analysis</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/40">
                        Match Confidence: {response.aiInsight?.aiConfidence}
                      </span>
                    </div>

                    <p className="text-xs text-[#E2E8F0] leading-relaxed">
                      {response.aiInsight?.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#322659]/60 text-[11px]">
                      <div>
                        <span className="text-slate-400">Target Domain:</span>{' '}
                        <span className="font-semibold text-white">{response.aiInsight?.detectedDomain}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Security Layer:</span>{' '}
                        <span className="font-semibold text-[#A855F7]">Zero-Trust RBAC</span>
                      </div>
                    </div>
                  </div>

                  {/* Matched Projects */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C0C7D1] mb-3 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#A855F7]" />
                      <span>Matched Codebase Repositories ({response.matches?.length})</span>
                    </h4>

                    <div className="space-y-3">
                      {response.matches?.map((m) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-2xl bg-[#140F28]/90 border border-[#322659] hover:border-[#A855F7]/60 transition flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <img
                              src={getFullImageUrl(m.thumbnail)}
                              alt={m.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#322659]"
                            />
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/30">
                                  {m.aiMatchScore}% Match
                                </span>
                                {m.isFree && (
                                  <span className="text-[9px] font-extrabold text-[#C084FC]">FREE</span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-white truncate group-hover:text-[#A855F7] transition mt-0.5">
                                {m.title}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">{m.shortDescription}</p>
                            </div>
                          </div>

                          <Link
                            to={`/projects/${m.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1.5 rounded-xl bg-[#A855F7] hover:bg-[#C084FC] text-white font-bold text-xs transition shrink-0 flex items-center gap-1 shadow-sm"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleAskAI(); }} className="p-4 bg-[#140F28]/90 border-t border-[#322659]/60 flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Harbor AI (e.g. 'Enterprise ERP with inventory tracking and Docker')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0A0713] border border-[#322659] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#A855F7] transition"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-harbor-glow hover:brightness-110 disabled:opacity-40"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Ask AI</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

