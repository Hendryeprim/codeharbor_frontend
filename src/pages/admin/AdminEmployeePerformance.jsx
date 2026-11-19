import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminPortalAPI } from '../../services/api';
import { BarChart3, TrendingUp, Users, CheckCircle2, AlertTriangle, ArrowLeft, AlertCircle, Eye } from 'lucide-react';

export const AdminEmployeePerformance = () => {
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        setLoading(true);
        const res = await adminPortalAPI.getEmployeePerformance();
        if (res.success) {
          setPerformance(res.performance || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load employee performance.');
      } finally {
        setLoading(false);
      }
    };
    fetchPerf();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/employees"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <span>Employee Performance Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate engineering velocity, completion rates, quality review scores, and milestone delivery.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400"></div>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0F172A] border border-[#334155] overflow-hidden shadow-harbor-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="py-3 px-4 font-bold">Employee</th>
                  <th className="py-3 px-4 font-bold">Primary Skill</th>
                  <th className="py-3 px-4 font-bold text-center">Assigned</th>
                  <th className="py-3 px-4 font-bold text-center">Completed</th>
                  <th className="py-3 px-4 font-bold text-center">In Progress</th>
                  <th className="py-3 px-4 font-bold text-center">Revisions</th>
                  <th className="py-3 px-4 font-bold text-center">Completion Rate</th>
                  <th className="py-3 px-4 font-bold text-center">Avg Score</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {performance.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-500">
                      No employee performance metrics available.
                    </td>
                  </tr>
                ) : (
                  performance.map((p) => (
                    <tr key={p.id} className="hover:bg-[#131B2E]/60 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{p.name}</p>
                        <p className="text-[10px] font-mono text-cyan-400">{p.employeeId}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#00FFC6]">{p.primarySkill}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-white font-bold">{p.totalAssigned}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-emerald-400 font-bold">{p.completed}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-amber-400 font-bold">{p.inProgress}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-rose-400 font-bold">{p.revisionRequired}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-mono font-bold text-white text-xs">{p.completionRate}%</span>
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-cyan-400 to-[#00FFC6] h-1.5 rounded-full"
                              style={{ width: `${p.completionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-black text-sm text-[#00FFC6]">
                        {p.averageScore != null ? `${p.averageScore}/100` : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/employees/${p.id}`}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Profile</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
