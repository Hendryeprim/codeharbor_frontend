import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminPortalAPI } from '../../services/api';
import {
  FolderGit2,
  PlusCircle,
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
  Trash2,
  Edit,
  Eye,
  CheckSquare,
} from 'lucide-react';

export const AdminManagedProjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || '';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (currentStatus) params.status = currentStatus;
      if (search) params.search = search;

      const res = await adminPortalAPI.getProjects(params);
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

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete project "${title}"?`)) return;
    try {
      const res = await adminPortalAPI.deleteProject(id);
      if (res.success) {
        setActionSuccess('Project deleted.');
        fetchProjects();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  const tabs = [
    { label: 'All Projects', value: '' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-purple-400" />
            <span>Managed Employee Projects</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise project lifecycle from assignment through automated sandbox runs, quality reviews, and approvals.
          </p>
        </div>

        <Link
          to="/admin/managed-projects/create"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-purple-glow flex items-center gap-2 self-start sm:self-auto transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Project</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-400 font-bold">&times;</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#334155]/60">
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSearchParams(tab.value === '' ? {} : { status: tab.value })}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white shadow-purple-glow'
                  : 'bg-[#0F172A] text-slate-400 hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs space-y-2">
          <FolderGit2 className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
          <p className="font-bold text-white text-sm">No projects matching this filter</p>
          <p>Create a project and assign it to an employee to see it listed here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => {
            const emp = p.assignedEmployee;
            return (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] hover:border-purple-500/40 transition flex flex-col justify-between space-y-4 shadow-harbor-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {p.projectType}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${getStatusBadge(p.status)}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white hover:text-purple-300 transition line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                  </div>

                  {/* Assigned Employee Box */}
                  <div className="p-3 rounded-2xl bg-[#131B2E] border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[9px] uppercase font-mono text-slate-500 font-bold">Assigned Employee</p>
                      <p className="font-bold text-white mt-0.5">{emp ? emp.name : 'Unassigned'}</p>
                      {emp && (
                        <p className="text-[10px] text-cyan-400 font-mono">
                          {emp.employeeId} • {emp.designation}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/70 text-[#00FFC6] border border-cyan-500/30">
                      {p.primarySkill}
                    </span>
                  </div>

                  {/* Tech Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500 font-mono text-[9px] uppercase block">Framework</span>
                      <span className="font-semibold text-slate-200">{p.framework || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono text-[9px] uppercase block">Database</span>
                      <span className="font-semibold text-slate-200">{p.database || 'None'}</span>
                    </div>
                  </div>

                  {/* Progress & Due Date */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Progress</span>
                      <span className="text-white font-bold">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-[#00FFC6] h-1.5 rounded-full"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-500 font-mono">
                    Due: {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'N/A'}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to="/admin/project-reviews"
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-bold text-xs hover:brightness-110 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
