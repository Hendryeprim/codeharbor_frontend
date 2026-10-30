import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { customerAPI } from '../../services/api';
import {
  FolderCode,
  Download,
  LifeBuoy,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Loader2,
  Bot,
  Zap,
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const [projRes, downRes] = await Promise.all([
          customerAPI.getMyProjects().catch(() => ({ projects: [] })),
          customerAPI.getMyDownloads().catch(() => ({ downloads: [] })),
        ]);
        if (projRes.projects) setProjects(projRes.projects);
        if (downRes.downloads) setDownloads(downRes.downloads);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  return (
    <div className="space-y-8 text-[#E2E8F0]">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#131B2E] via-[#0F172A] to-[#1E293B] rounded-3xl p-6 sm:p-8 border border-[#22D3EE]/40 shadow-harbor-glow flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#00FFC6]/10 text-[#00FFC6] text-[10px] font-mono font-bold mb-3 border border-[#00FFC6]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer AI Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-[#C0C7D1] mt-1 max-w-xl leading-relaxed">
            Manage your authorized codebases, explore open-source developer starter kits, and run automated AI architecture inspections.
          </p>
        </div>

        <Link
          to="/projects"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition shrink-0 flex items-center gap-2 shadow-neon-glow"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#131B2E]/90 p-5 rounded-3xl border border-[#334155]/80 shadow-harbor-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/15 text-[#0EA5E9] flex items-center justify-center shrink-0 border border-[#0EA5E9]/30">
            <FolderCode className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accessible Codebases</p>
            <p className="text-2xl font-black text-white">{projects.length}</p>
          </div>
        </div>

        <div className="bg-[#131B2E]/90 p-5 rounded-3xl border border-[#334155]/80 shadow-harbor-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00FFC6]/15 text-[#00FFC6] flex items-center justify-center shrink-0 border border-[#00FFC6]/30">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Downloads Recorded</p>
            <p className="text-2xl font-black text-white">{downloads.length}</p>
          </div>
        </div>

        <div className="bg-[#131B2E]/90 p-5 rounded-3xl border border-[#334155]/80 shadow-harbor-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Purchasing Phase</p>
            <p className="text-sm font-bold text-amber-400">Coming Soon</p>
          </div>
        </div>
      </div>

      {/* Available Projects Section */}
      <div className="bg-[#131B2E]/90 rounded-3xl p-6 sm:p-8 border border-[#334155]/80 shadow-harbor-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Available Free Codebases</h2>
            <p className="text-xs text-slate-400">
              Open-source & starter templates you can download immediately.
            </p>
          </div>
          <Link
            to="/customer/projects"
            className="text-xs font-bold text-[#00FFC6] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#00FFC6]" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] hover:border-[#22D3EE]/50 transition flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={p.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80'}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#334155]"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{p.category?.name || 'Development Kit'}</p>
                  </div>
                </div>

                <Link
                  to={`/projects/${p.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-[#0EA5E9]/15 text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-[#0B0F1A] text-xs font-bold transition shrink-0"
                >
                  Access
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            No projects currently connected to your profile.
          </div>
        )}
      </div>

      {/* Notice regarding Payment Coming Soon */}
      <div className="bg-[#131B2E] border border-amber-500/30 rounded-2xl p-5 flex items-start gap-3.5">
        <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <strong className="font-bold">Purchasing Notice:</strong> Payment gateway processing for commercial products is currently in development. You can explore all application architectures, run AI diagnostics, and test free templates right now.
        </div>
      </div>
    </div>
  );
};
