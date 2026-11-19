import React, { useState, useEffect } from 'react';
import { adminPortalAPI } from '../../services/api';
import { Terminal, Clock, CheckCircle2, AlertTriangle, XCircle, Search, AlertCircle, Eye, X } from 'lucide-react';

export const AdminExecutions = () => {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Execution Details Modal
  const [selectedExec, setSelectedExec] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const fetchExecutions = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminPortalAPI.getExecutions();
      if (res.success) {
        setExecutions(res.executions || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load execution logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
  }, []);

  const openExecutionDetails = async (id) => {
    try {
      setLoadingModal(true);
      const res = await adminPortalAPI.getExecutionById(id);
      if (res.success && res.execution) {
        setSelectedExec(res.execution);
      }
    } catch (e) {
      alert('Failed to load execution details.');
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Terminal className="w-6 h-6 text-purple-400" />
          <span>Automated Sandbox Execution History</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time diagnostics and isolated test suite logs captured across project submissions.
        </p>
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
      ) : executions.length === 0 ? (
        <div className="p-12 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
          No automated sandbox executions recorded yet.
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0F172A] border border-[#334155] overflow-hidden shadow-harbor-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="py-3 px-4 font-bold">Execution ID</th>
                  <th className="py-3 px-4 font-bold">Project & Version</th>
                  <th className="py-3 px-4 font-bold">Employee</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Build</th>
                  <th className="py-3 px-4 font-bold">Tests</th>
                  <th className="py-3 px-4 font-bold">Runtime</th>
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                  <th className="py-3 px-4 font-bold text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {executions.map((ex) => (
                  <tr key={ex.id} className="hover:bg-[#131B2E]/60 transition">
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px] truncate max-w-[120px]">
                      {ex.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{ex.projectTitle}</p>
                      <p className="text-[10px] font-mono text-cyan-400">v{ex.versionNumber}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{ex.employeeName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                          ex.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {ex.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-[11px]">
                      {ex.buildStatus || 'PASSED'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300 text-[11px]">
                      {ex.passedCount} / {ex.testsCount} passed
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400 text-[11px]">
                      {ex.runtimeMs ? `${(ex.runtimeMs / 1000).toFixed(2)}s` : '0.4s'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {new Date(ex.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openExecutionDetails(ex.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Logs</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Execution Terminal Modal */}
      {selectedExec && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-harbor-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00FFC6]" />
                <h3 className="text-sm font-mono font-black text-white uppercase">
                  Sandbox Execution Diagnostics
                </h3>
              </div>
              <button onClick={() => setSelectedExec(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black font-mono text-xs text-emerald-400 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {selectedExec.consoleLogs || 'No execution logs recorded.'}
            </div>

            {selectedExec.testResults && selectedExec.testResults.length > 0 && (
              <div className="space-y-1.5 border-t border-slate-800 pt-3 text-xs">
                <p className="font-bold text-white font-mono text-[11px] uppercase">Suite Breakdown</p>
                {selectedExec.testResults.map((tr) => (
                  <div key={tr.id} className="flex items-center justify-between p-2 rounded-xl bg-[#131B2E]">
                    <span className="text-slate-300 font-medium">{tr.testName}</span>
                    <span className={tr.status === 'PASS' ? 'text-emerald-400 font-bold font-mono' : 'text-rose-400 font-bold font-mono'}>
                      {tr.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
