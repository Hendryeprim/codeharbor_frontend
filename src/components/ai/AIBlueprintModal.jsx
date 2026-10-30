import React, { useState } from 'react';
import { aiAPI } from '../../services/api';
import {
  Sparkles,
  X,
  Cpu,
  Layers,
  Database,
  Server,
  Code2,
  Loader2,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

export const AIBlueprintModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setBlueprint(null);

    try {
      const res = await aiAPI.generateBlueprint({
        title: title || 'Custom Full-Stack Project',
        description,
      });
      if (res.success) {
        setBlueprint(res.blueprint);
      }
    } catch (err) {
      alert(err.message || 'Error generating architecture blueprint.');
    } finally {
      setLoading(false);
    }
  };

  const copyBlueprintJson = () => {
    if (!blueprint) return;
    navigator.clipboard.writeText(JSON.stringify(blueprint, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F1A]/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0F172A] border border-[#22D3EE]/50 rounded-3xl shadow-harbor-lg overflow-hidden flex flex-col max-h-[90vh] text-[#E2E8F0]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#131B2E]/90 border-b border-[#334155]/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-[#00FFC6] flex items-center justify-center text-[#0B0F1A] font-black">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Harbor AI Architecture Blueprint Generator
              </h3>
              <p className="text-xs text-[#C0C7D1]">Generate production database schema & layer specifications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155]/60 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {!blueprint && !loading && (
            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Project Concept / Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Real Estate Tokenization Engine"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F1A] border border-[#334155] text-white focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Functional Requirements & Workflow *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your user roles, transaction types, external integrations (e.g. multi-tenant billing, PDF generation, webhook triggers)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F1A] border border-[#334155] text-white focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] via-[#22D3EE] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs shadow-harbor-glow transition hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Production Architecture Blueprint</span>
              </button>
            </form>
          )}

          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-[#00FFC6]" />
              <p className="text-xs font-mono text-[#00FFC6] animate-pulse">
                Synthesizing layers, relational database models & API specifications...
              </p>
            </div>
          )}

          {blueprint && (
            <div className="space-y-5 animate-fadeIn text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60">
                <div>
                  <h4 className="text-sm font-bold text-white">{blueprint.title}</h4>
                  <p className="text-[11px] text-[#00FFC6] font-mono">{blueprint.architectureStyle}</p>
                </div>
                <button
                  onClick={copyBlueprintJson}
                  className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-white font-medium text-xs flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#00FFC6]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied JSON!' : 'Copy Spec'}</span>
                </button>
              </div>

              {/* Layers */}
              <div className="space-y-3">
                <h5 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Architectural Layers
                </h5>
                <div className="grid grid-cols-1 gap-2.5">
                  {blueprint.layers?.map((layer, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#131B2E] border border-[#334155] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{layer.layer}</span>
                        <div className="flex gap-1">
                          {layer.stack?.map((s, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-[#0EA5E9]/15 text-[#0EA5E9] font-mono text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#C0C7D1]">{layer.responsibilities}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database Entities */}
              <div className="space-y-2">
                <h5 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#00FFC6]" />
                  <span>Normalized Database Entities</span>
                </h5>
                <div className="p-3.5 rounded-xl bg-[#0B0F1A] border border-[#334155] font-mono text-[11px] text-[#22D3EE] space-y-1">
                  {blueprint.recommendedDatabaseTables?.map((table, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-slate-500">→</span>
                      <span>{table}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setBlueprint(null)}
                  className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold"
                >
                  Generate Another Blueprint
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

