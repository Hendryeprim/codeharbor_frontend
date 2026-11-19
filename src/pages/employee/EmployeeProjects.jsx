import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { employeeAPI } from '../../services/api';
import { LivePreviewModal } from '../../components/common/LivePreviewModal';
import { UploadProjectModal } from '../../components/employee/UploadProjectModal';
import {
  FolderGit2,
  Calendar,
  Layers,
  Code2,
  Database,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  UploadCloud,
  Play,
  Trash2,
} from 'lucide-react';

export const EmployeeProjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || 'ALL';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Project Confirmation Modal State
  const [deleteConfirmProject, setDeleteConfirmProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    fetchProjects();
    if (res.version?.liveDemoUrl) {
      openPreview(res.version.liveDemoUrl, `${res.project?.title || 'Project'} (v${res.version.versionNumber})`);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteConfirmProject) return;
    try {
      setIsDeleting(true);
      setError('');
      const res = await employeeAPI.deleteProject(deleteConfirmProject.id);
      if (res.success) {
        setSuccessMsg(res.message || `Project "${deleteConfirmProject.title}" has been deleted.`);
        setDeleteConfirmProject(null);
        await fetchProjects();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await employeeAPI.getProjects(currentStatus);
      if (res.success) {
        setProjects(res.projects || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentStatus]);

  const tabs = [
    { label: 'All Projects', value: 'ALL' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Revision Required', value: 'REVISION_REQUIRED' },
    { label: 'Approved', value: 'APPROVED' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'REVISION_REQUIRED':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'IN_PROGRESS':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border border-slate-600/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-[#00FFC6]" />
            <span>My Projects & Deliverables</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access assigned client projects, upload your source code deliverables, and inspect live sandbox execution outputs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTargetUploadId('new');
            setUploadModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-neon-glow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>+ Upload My Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#334155]/60">
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSearchParams(tab.value === 'ALL' ? {} : { status: tab.value })}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] shadow-neon-glow'
                  : 'bg-[#0F172A] text-slate-400 hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00FFC6]"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs space-y-2">
          <FolderGit2 className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
          <p className="font-bold text-white text-sm">No projects found in this view</p>
          <p>You have no projects currently marked with status "{currentStatus}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => {
            const isOverdue = p.dueDate && new Date(p.dueDate) < new Date() && p.status !== 'APPROVED';
            return (
              <div
                key={p.id}
                className="rounded-3xl bg-[#0F172A]/90 border border-[#334155]/80 hover:border-[#00FFC6]/50 p-6 flex flex-col justify-between transition-all hover:translate-y-[-2px] shadow-harbor-sm"
              >
                <div className="space-y-3.5">
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {p.projectType}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${getStatusBadge(p.status)}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Project Title */}
                  <div>
                    <h3 className="text-base font-black text-white hover:text-[#00FFC6] transition line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </div>

                  {/* Tech Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0B0F1A]/80 border border-slate-800 text-[11px]">
                    <div>
                      <p className="text-[9px] uppercase font-mono text-slate-500 font-bold">Technology</p>
                      <p className="font-bold text-[#00FFC6] flex items-center gap-1">
                        <Code2 className="w-3 h-3" />
                        <span className="truncate">{p.primaryTechnology}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono text-slate-500 font-bold">Framework</p>
                      <p className="font-semibold text-slate-200 truncate">{p.framework || 'Standard'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono text-slate-500 font-bold">Database</p>
                      <p className="font-semibold text-slate-200 truncate flex items-center gap-1">
                        <Database className="w-3 h-3 text-slate-400" />
                        <span>{p.database || 'None'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono text-slate-500 font-bold">Priority</p>
                      <span className={`inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${getPriorityBadge(p.priority)}`}>
                        {p.priority}
                      </span>
                    </div>
                  </div>

                  {/* Due Date & Version */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Due: {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'TBD'}</span>
                    </span>
                    {p.currentVersion && (
                      <span className="font-mono text-cyan-400 font-bold">{p.currentVersion}</span>
                    )}
                  </div>

                  {isOverdue && (
                    <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-800 text-[11px] text-rose-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      <span>Project is past due deadline</span>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Progress</span>
                      <span className="font-bold text-white">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center gap-2">
                  {p.liveDemoUrl && (
                    <button
                      type="button"
                      onClick={() => openPreview(p.liveDemoUrl, `${p.title} (${p.currentVersion || 'v1'})`)}
                      className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00FFC6] text-[#0A0713] font-black text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-sm"
                      title="View Live Sandbox Output Screen"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Output</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setTargetUploadId(p.id);
                      setUploadModalOpen(true);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-700"
                    title="Upload new deliverable version"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#00FFC6]" />
                    <span>Upload</span>
                  </button>
                  <Link
                    to={`/employee/projects/${p.id}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#131B2E] border border-slate-700 text-slate-200 font-bold text-xs hover:text-white hover:border-[#00FFC6] transition flex items-center justify-center gap-1.5"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmProject(p)}
                    className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-400 hover:text-rose-200 transition flex items-center justify-center"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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

      {/* Delete Project Confirmation Modal */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#140F28] border border-rose-800/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-950/60 border border-rose-800">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Delete Project</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete <strong className="text-white font-mono">"{deleteConfirmProject.title}"</strong>? All associated submissions, versions, and live output containers will be deleted.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
