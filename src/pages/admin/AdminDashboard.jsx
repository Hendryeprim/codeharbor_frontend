import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import {
  Package,
  Layers,
  Users,
  Cpu,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  FileText,
  UserCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getDashboard();
        if (res.success) setData(res);
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#A855F7]" />
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
            Mission Control & Core Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
            Marketplace Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
            Real-time catalog metrics, system verticals, AI diagnostics engine, and verified customer telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#0A84FF] hover:shadow-purple-glow text-white text-xs font-bold flex items-center gap-2 transition duration-200 shrink-0 shadow-lg"
          >
            <Package className="w-4 h-4" />
            <span>Manage Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] p-5 rounded-2xl border border-[#322659]/60 shadow-xl relative overflow-hidden group hover:border-[#A855F7]/50 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#C0C7D1]/70 uppercase tracking-wider">Published Projects</span>
            <div className="w-9 h-9 rounded-xl bg-[#C084FC]/10 text-[#C084FC] border border-[#C084FC]/20 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#E2E8F0]">{stats.totalPublished ?? 0}</p>
          <span className="text-[11px] text-[#C084FC] font-mono mt-1 block">Live on marketplace</span>
        </div>

        <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] p-5 rounded-2xl border border-[#322659]/60 shadow-xl relative overflow-hidden group hover:border-[#A855F7]/50 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#C0C7D1]/70 uppercase tracking-wider">Draft Projects</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#E2E8F0]">{stats.totalDraft ?? 0}</p>
          <span className="text-[11px] text-amber-400/80 font-mono mt-1 block">In staging pipeline</span>
        </div>

        <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] p-5 rounded-2xl border border-[#322659]/60 shadow-xl relative overflow-hidden group hover:border-[#A855F7]/50 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#C0C7D1]/70 uppercase tracking-wider">Tech Verticals</span>
            <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#E2E8F0]">{stats.totalCategories ?? 0}</p>
          <span className="text-[11px] text-[#A855F7] font-mono mt-1 block">Active classifications</span>
        </div>

        <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] p-5 rounded-2xl border border-[#322659]/60 shadow-xl relative overflow-hidden group hover:border-[#A855F7]/50 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#C0C7D1]/70 uppercase tracking-wider">Customers</span>
            <div className="w-9 h-9 rounded-xl bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#E2E8F0]">{stats.totalCustomers ?? 0}</p>
          <span className="text-[11px] text-[#0A84FF] font-mono mt-1 block">Verified developers</span>
        </div>
      </div>

      {/* Payment Phase Staging Box & AI Engine Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-200">Payment Pipeline Status:</strong> Phase 2 roadmap. All customer purchases display <em>"Coming Soon"</em> modal.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold shrink-0 ml-2">
            Coming Soon
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#C084FC]/10 border border-[#C084FC]/30 text-xs text-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#C084FC] shrink-0" />
            <span>
              <strong className="text-[#C084FC]">AI Harbor Copilot:</strong> Architectural inspector, matchmaker, and blueprint engine are operational.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#C084FC]/20 text-[#C084FC] font-mono text-[10px] uppercase font-bold shrink-0 ml-2">
            Operational
          </span>
        </div>
      </div>

      {/* Tables Row: Recent Projects & Recent Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Projects (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#140F28] to-[#0E0A1C] rounded-2xl p-6 border border-[#322659]/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#A855F7] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4" />
              Recent Project Catalog Updates
            </h3>
            <Link to="/admin/projects" className="text-xs font-semibold text-[#A855F7] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentProjects?.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-[#322659]/50 bg-[#0A0713]/60 hover:bg-[#0A0713] hover:border-[#A855F7]/40 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-[#A855F7]/15 text-[#A855F7] flex items-center justify-center font-bold text-xs shrink-0 border border-[#A855F7]/30">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#E2E8F0] truncate">{p.title}</p>
                    <p className="text-[10px] text-[#C0C7D1]/60">{p.category?.name || 'Software Project'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-xs font-bold font-mono text-[#C084FC]">
                    {p.isFree ? 'FREE' : `₹${Number(p.price).toFixed(2)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customers (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#140F28] to-[#0E0A1C] rounded-2xl p-6 border border-[#322659]/60 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#A855F7] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recent Customers
            </h3>
            <Link to="/admin/customers" className="text-xs font-semibold text-[#A855F7] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentCustomers?.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl border border-[#322659]/50 bg-[#0A0713]/60 hover:bg-[#0A0713] transition flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#A855F7] to-[#C084FC] text-white flex items-center justify-center font-black text-xs shrink-0">
                    {c.name?.charAt(0) || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-[#E2E8F0] truncate">{c.name}</p>
                    <p className="text-[10px] text-[#C0C7D1]/60 truncate">{c.email}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
