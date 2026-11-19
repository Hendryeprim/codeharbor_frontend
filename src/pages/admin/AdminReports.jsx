import React, { useState, useEffect } from 'react';
import { adminPortalAPI } from '../../services/api';
import {
  BarChart3,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  AlertCircle,
  Code2,
} from 'lucide-react';

export const AdminReports = () => {
  const [logs, setLogs] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError('');
      const [logsRes, dashRes] = await Promise.all([
        adminPortalAPI.getAuditLogs(),
        adminPortalAPI.getDashboard(),
      ]);

      if (logsRes.success) setLogs(logsRes.logs || []);
      if (dashRes.success) setDashboardData(dashRes);
    } catch (err) {
      setError(err.message || 'Failed to load report analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (!actionFilter) return true;
    return l.action.toLowerCase().includes(actionFilter.toLowerCase());
  });

  const getActionBadge = (action) => {
    if (action.includes('APPROVED')) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (action.includes('REVISION')) return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    if (action.includes('SKILL')) return 'bg-cyan-500/20 text-[#00FFC6] border border-cyan-500/30';
    if (action.includes('SUBMISSION')) return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <span>Executive Reports & Audit Compliance Log</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Enterprise activity ledger, immutable security trail, and developer productivity audit records.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Operations Logged</span>
          <p className="text-2xl font-black text-white mt-1">{logs.length}</p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Full audit compliance enabled</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Active Staff Accounts</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">
            {dashboardData?.cards?.activeEmployees || 0}
          </p>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Locked technical profiles</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Managed Projects Active</span>
          <p className="text-2xl font-black text-purple-400 mt-1">
            {dashboardData?.cards?.totalProjects || 0}
          </p>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Multi-framework tracking</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Quality Acceptance Rate</span>
          <p className="text-2xl font-black text-[#00FFC6] mt-1">
            {dashboardData?.charts?.approvalRate || 100}%
          </p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Pass rate on automated reviews</span>
        </div>
      </div>

      {/* Requirement 40: AUDIT LOG VIEWER TABLE */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00FFC6]" />
            <div>
              <h2 className="text-sm font-black text-white">Immutable Security Audit Trail</h2>
              <p className="text-[11px] text-slate-400">
                Tracking employee creation, skill assignments, file uploads, runs, and feedback decisions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="p-2 rounded-xl bg-[#0B0F1A] border border-slate-700 text-xs text-slate-300 focus:outline-none"
            >
              <option value="">All Audit Actions</option>
              <option value="EMPLOYEE">Employee Actions</option>
              <option value="SKILL">Skill Assignments</option>
              <option value="PROJECT">Project Events</option>
              <option value="SUBMISSION">Submissions & Resubmissions</option>
              <option value="EXECUTION">Executions & Sandbox</option>
              <option value="APPROVED">Approvals</option>
              <option value="REVISION">Revisions</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-3 font-bold">Timestamp</th>
                <th className="pb-3 font-bold">Action</th>
                <th className="pb-3 font-bold">Actor</th>
                <th className="pb-3 font-bold">Entity</th>
                <th className="pb-3 font-bold">Details</th>
                <th className="pb-3 font-bold">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#131B2E]/60 transition">
                    <td className="py-3 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-200 font-bold">{log.user?.name || 'System / Service'}</td>
                    <td className="py-3 text-slate-300">{log.entity}</td>
                    <td className="py-3 text-slate-400 font-sans max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
                    <td className="py-3 text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
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
