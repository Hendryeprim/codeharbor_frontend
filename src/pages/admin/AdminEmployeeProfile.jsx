import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminPortalAPI } from '../../services/api';
import {
  Users,
  Code2,
  Calendar,
  Building2,
  Briefcase,
  Mail,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  FolderPlus,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const AdminEmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminPortalAPI.getEmployeeById(id);
      if (res.success && res.employee) {
        setEmployee(res.employee);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch employee profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A855F7]"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6 bg-rose-950/40 border border-rose-800 rounded-3xl text-rose-300 text-sm space-y-3">
        <div className="flex items-center gap-2 font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Employee Profile Not Found</span>
        </div>
        <p>{error || 'Requested employee profile could not be loaded.'}</p>
        <Link to="/admin/employees" className="text-xs text-[#00FFC6] underline inline-block">
          &larr; Back to Employee Directory
        </Link>
      </div>
    );
  }

  const stats = employee.stats || {};
  const assignments = employee.assignments || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/employees"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{employee.name}</h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-[#00FFC6] border border-cyan-500/30">
                {employee.employeeId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {employee.designation} • {employee.department}
            </p>
          </div>
        </div>

        <Link
          to={`/admin/managed-projects/create?employeeId=${employee.id}`}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-purple-glow flex items-center gap-2 transition"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Assign New Project</span>
        </Link>
      </div>

      {/* Identity & Technical Specialization Card */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
          <p className="text-[10px] uppercase font-mono text-slate-500 font-bold">Primary Skill (Locked)</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Code2 className="w-4 h-4 text-[#00FFC6]" />
            <span className="font-black text-[#00FFC6] text-base">{employee.primarySkill}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
          <p className="text-[10px] uppercase font-mono text-slate-500 font-bold">Corporate Email</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-white truncate">{employee.email}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
          <p className="text-[10px] uppercase font-mono text-slate-500 font-bold">Joined Date</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-200">
              {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
          <p className="text-[10px] uppercase font-mono text-slate-500 font-bold">Status</p>
          <span
            className={`inline-block mt-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
              employee.status === 'ACTIVE'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {employee.status}
          </span>
        </div>
      </div>

      {/* Project Statistics Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs">
          <p className="text-[10px] font-semibold text-slate-400">Assigned</p>
          <p className="text-xl font-black text-white mt-1">{stats.assignedProjects || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
          <p className="text-[10px] font-semibold text-slate-400">Pending</p>
          <p className="text-xl font-black text-white mt-1">{stats.pendingProjects || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <p className="text-[10px] font-semibold text-slate-400">Completed</p>
          <p className="text-xl font-black text-white mt-1">{stats.completedProjects || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#00FFC6]/10 border border-[#00FFC6]/20 text-xs">
          <p className="text-[10px] font-semibold text-slate-400">Approved</p>
          <p className="text-xl font-black text-white mt-1">{stats.approvedProjects || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs">
          <p className="text-[10px] font-semibold text-slate-400">Revision Required</p>
          <p className="text-xl font-black text-white mt-1">{stats.revisionRequired || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs">
          <p className="text-[10px] font-semibold text-slate-400">Average Score</p>
          <p className="text-xl font-black text-[#00FFC6] mt-1">
            {stats.averageScore != null ? `${stats.averageScore}%` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Projects Assigned Table */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-purple-400" />
          <span>Project Assignments History</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-3 font-bold">Project Title</th>
                <th className="pb-3 font-bold">Type</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Score</th>
                <th className="pb-3 font-bold">Assigned Date</th>
                <th className="pb-3 font-bold">Due Date</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    No projects assigned to this employee yet.
                  </td>
                </tr>
              ) : (
                assignments.map((a) => (
                  <tr key={a.assignmentId} className="hover:bg-[#131B2E]/60 transition">
                    <td className="py-3 font-bold text-white">{a.projectTitle}</td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">{a.projectType}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                          a.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : a.status === 'REVISION_REQUIRED'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {a.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-[#00FFC6]">
                      {a.score != null ? `${a.score}/100` : '-'}
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {new Date(a.assignedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/managed-projects`}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px]"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
