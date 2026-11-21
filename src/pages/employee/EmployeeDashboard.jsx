import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI, employeeCurriculumAPI } from '../../services/api';
import { LivePreviewModal } from '../../components/common/LivePreviewModal';
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Code2,
  Calendar,
  Layers,
  Sparkles,
  CheckSquare,
  UploadCloud,
  Play,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react';

export const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload Project Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetUploadId, setTargetUploadId] = useState('');

  // Live Output Screen Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const openPreview = (url, title) => {
    if (!url) return;
    setActivePreviewUrl(url);
    setPreviewTitle(title || 'Live Project Output');
    setPreviewModalOpen(true);
  };

  const handleUploadSuccess = (res) => {
    fetchDashboard();
    if (res.version?.liveDemoUrl) {
      openPreview(res.version.liveDemoUrl, `${res.project?.title || 'Project'} (v${res.version.versionNumber})`);
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [res, skillRes] = await Promise.allSettled([
        employeeAPI.getDashboard(),
        employeeCurriculumAPI.getMySkills(),
      ]);
      if (res.status === 'fulfilled' && res.value.success) {
        setData(res.value);
      }
      if (skillRes.status === 'fulfilled' && skillRes.value.success) {
        setSkills(skillRes.value.skills || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load employee dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00FFC6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-sm flex items-center gap-2">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const profile = data?.profile;
  const cards = data?.cards || {};
  const recentProjects = data?.recentProjects || [];
  const recentTasks = data?.recentTasks || [];

  const statCards = [
    { label: 'Assigned Projects', value: cards.assigned || 0, icon: FolderGit2, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'In Progress', value: cards.inProgress || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Submitted', value: cards.submitted || 0, icon: FileCheck2, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Revision Required', value: cards.revisionRequired || 0, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Approved Projects', value: cards.approved || 0, icon: CheckCircle2, color: 'text-[#00FFC6]', bg: 'bg-[#00FFC6]/10 border-[#00FFC6]/20' },
    { label: 'Overdue Projects', value: cards.overdue || 0, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#140F28] to-[#1E1B4B] border border-[#334155]/80 p-6 sm:p-8 shadow-harbor-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gradient-to-br from-[#0EA5E9]/20 to-[#00FFC6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00FFC6]/10 text-[#00FFC6] border border-[#00FFC6]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineer Workspace Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome, {profile?.name || 'Developer'}
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Track project milestones, upload structured project packages, inspect real-time sandbox execution outputs, and review admin testing evaluations.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setTargetUploadId('new');
                  setUploadModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-neon-glow flex items-center gap-2 transition"
              >
                <UploadCloud className="w-4 h-4" />
                <span>+ Upload My Project Deliverable</span>
              </button>
            </div>
          </div>

          {/* Profile Badge Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#0B0F1A]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60 text-xs">
            <div>
              <p className="text-[10px] uppercase font-mono text-slate-400 font-bold">Employee ID</p>
              <p className="text-sm font-black text-white">{profile?.employeeId || 'EMP001'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono text-slate-400 font-bold">Primary Skill</p>
              <div className="inline-flex items-center gap-1 font-bold text-[#00FFC6]">
                <Code2 className="w-3.5 h-3.5" />
                <span>{profile?.primarySkill || 'Python'}</span>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase font-mono text-slate-400 font-bold">Designation</p>
              <p className="font-semibold text-slate-200 truncate">{profile?.designation || 'Software Engineer'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl border ${c.bg} backdrop-blur-sm flex flex-col justify-between transition hover:translate-y-[-2px]`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-300">{c.label}</span>
                <Icon className={`w-4 h-4 ${c.color}`} />
              </div>
              <p className="text-2xl font-black text-white">{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* ─── MY ASSIGNED SKILLS & 3-LEVEL CURRICULUM TRACKS ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9333EA] to-[#00FFC6] flex items-center justify-center text-white shadow-neon-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>My Assigned Skills & Tasks</span>
              </h2>
              <p className="text-xs text-slate-400">Sequential 3-level progression system (Basic → Intermediate → Advanced)</p>
            </div>
          </div>
          <Link
            to="/employee/skills"
            className="text-xs font-bold text-[#00FFC6] hover:underline flex items-center gap-1 group"
          >
            <span>View All Tasks</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {skills.length === 0 ? (
          <div className="p-6 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
            No specific skills assigned yet. Please contact your administrator.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((s) => {
              const p = s.progress || {};
              const unlockedLevel = p.unlockedLevel || 'BASIC';
              const isBasicDone = Boolean(p.basicCompleted);
              const isInterDone = Boolean(p.intermediateCompleted);
              const isAdvDone = Boolean(p.advancedCompleted);

              const percent = isAdvDone ? 100 : isInterDone ? 66 : isBasicDone ? 33 : 10;

              return (
                <div
                  key={s.id}
                  className="p-5 rounded-3xl bg-[#0F172A]/90 border border-[#334155]/80 hover:border-[#00FFC6]/60 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold font-mono text-sm">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white group-hover:text-[#00FFC6] transition-colors">
                            {s.name}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400">
                            Current: <strong className="text-cyan-300">{unlockedLevel}</strong>
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#00FFC6]">{percent}%</span>
                    </div>

                    {/* Progression bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* 3 Level badges */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      {/* Basic */}
                      <div
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 ${
                          isBasicDone
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                            : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-slate-400">Level 1</span>
                        <span className="truncate">Basic</span>
                        {isBasicDone ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Unlock className="w-3 h-3 text-cyan-400" />
                        )}
                      </div>

                      {/* Intermediate */}
                      <div
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 ${
                          isInterDone
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                            : unlockedLevel === 'INTERMEDIATE' || unlockedLevel === 'ADVANCED'
                            ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-slate-500">Level 2</span>
                        <span className="truncate">Interm.</span>
                        {isInterDone ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : unlockedLevel === 'INTERMEDIATE' || unlockedLevel === 'ADVANCED' ? (
                          <Unlock className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Lock className="w-3 h-3 text-slate-500" />
                        )}
                      </div>

                      {/* Advanced */}
                      <div
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 ${
                          isAdvDone
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                            : unlockedLevel === 'ADVANCED'
                            ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-slate-500">Level 3</span>
                        <span className="truncate">Advanced</span>
                        {isAdvDone ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : unlockedLevel === 'ADVANCED' ? (
                          <Unlock className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Lock className="w-3 h-3 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/employee/skills"
                    className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-[#00FFC6]/10 hover:border-[#00FFC6]/50 border border-slate-700/80 text-white hover:text-[#00FFC6] font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>Continue Tasks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Sections: Recent Projects & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#00FFC6]" />
              <span>Assigned Projects</span>
            </h2>
            <Link
              to="/employee/projects"
              className="text-xs font-bold text-[#00FFC6] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="p-8 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
              No projects currently assigned to you.
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p) => {
                const isOverdue = p.dueDate && new Date(p.dueDate) < new Date() && p.status !== 'APPROVED';
                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-[#0F172A]/90 border border-[#334155]/70 hover:border-[#00FFC6]/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                          {p.technology}
                        </span>
                        {p.framework && (
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {p.framework}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                            p.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : p.status === 'REVISION_REQUIRED'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : p.status === 'IN_PROGRESS'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {p.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white truncate">{p.title}</h3>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>Due: {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'No deadline'}</span>
                        </span>
                        {isOverdue && (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Overdue</span>
                          </span>
                        )}
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${p.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setTargetUploadId(p.id);
                          setUploadModalOpen(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition border border-slate-700"
                        title="Upload deliverables for this project"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-[#00FFC6]" />
                        <span>Upload</span>
                      </button>
                      <Link
                        to={`/employee/projects/${p.id}`}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-neon-glow"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tasks Checklist (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#00FFC6]" />
              <span>Assigned Tasks</span>
            </h2>
            <Link to="/employee/tasks" className="text-xs font-bold text-[#00FFC6] hover:underline">
              View All
            </Link>
          </div>

          <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-5 space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No pending project tasks assigned.</p>
            ) : (
              recentTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-2xl bg-[#131B2E] border border-slate-700/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-white">{t.title}</p>
                    <p className="text-[10px] text-slate-400">{t.project?.title}</p>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      t.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : t.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upload Project Modal */}
      <UploadProjectModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        defaultProjectId={targetUploadId}
        onSuccess={handleUploadSuccess}
      />

      {/* Live Output Screen Modal */}
      <LivePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        previewUrl={activePreviewUrl}
        projectTitle={previewTitle}
      />
    </div>
  );
};
