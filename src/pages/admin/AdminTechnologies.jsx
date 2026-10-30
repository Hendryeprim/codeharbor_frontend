import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Cpu, Plus, Trash2, Loader2, Zap } from 'lucide-react';

export const AdminTechnologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTechName, setNewTechName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTech();
  }, []);

  const fetchTech = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getTechnologies();
      if (res.technologies) setTechnologies(res.technologies);
    } catch (err) {
      console.error('Failed to load technologies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTechName.trim()) return;

    try {
      setSubmitting(true);
      await adminAPI.createTechnology({ name: newTechName });
      setNewTechName('');
      fetchTech();
    } catch (err) {
      alert(err.message || 'Error creating technology');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete technology tag "${t.name}"?`)) return;
    try {
      await adminAPI.deleteTechnology(t.id);
      fetchTech();
    } catch (err) {
      alert(err.message || 'Error deleting technology');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#22D3EE] text-[11px] font-semibold tracking-wider uppercase mb-2">
          <Zap className="w-3.5 h-3.5 text-[#00FFC6]" />
          Stack Tags & Ecosystem Registry
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
          Technology Management
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
          Define frameworks, databases, and programming languages for project tagging and marketplace filtering.
        </p>
      </div>

      {/* Add new inline form */}
      <div className="bg-gradient-to-br from-[#131B2E] to-[#0F172A] p-5 rounded-2xl border border-[#334155]/60 shadow-xl">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="text"
            required
            value={newTechName}
            onChange={(e) => setNewTechName(e.target.value)}
            placeholder="Add technology (e.g. Next.js 15, Prisma, PyTorch)..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-[#334155]/80 bg-[#0F172A] text-[#E2E8F0] placeholder-slate-500 text-xs focus:outline-none focus:border-[#0EA5E9]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0A84FF] hover:shadow-neon-glow text-white font-bold text-xs transition duration-200 flex items-center justify-center gap-1.5 shrink-0 shadow-lg disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Technology</span>
          </button>
        </form>
      </div>

      {/* Tech Grid */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0EA5E9]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {technologies.map((t) => (
            <div
              key={t.id}
              className="bg-gradient-to-br from-[#131B2E] to-[#0F172A] p-4 rounded-xl border border-[#334155]/60 shadow-lg flex items-center justify-between gap-2 hover:border-[#0EA5E9]/50 transition"
            >
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-[#E2E8F0] truncate">{t.name}</p>
                <p className="text-[10px] text-[#22D3EE] font-mono">/{t.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(t)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded transition hover:bg-rose-500/10"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
