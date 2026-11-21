import React, { useState, useEffect } from 'react';
import { adminCurriculumAPI } from '../../services/api';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Terminal,
  X,
  User,
  FolderGit2,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Code2,
} from 'lucide-react';

export const AdminTaskSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminCurriculumAPI.getSubmissions({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      if (res.success) {
        setSubmissions(res.submissions || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load task submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const openReviewModal = (sub) => {
    setSelectedSub(sub);
    setAdminComment(sub.adminComment || '');
    setRunResult(
      sub.executionOutput
        ? { stdout: sub.executionOutput, stderr: '', executionTimeMs: 0, success: true }
        : null
    );
    setReviewModalOpen(true);
  };

  const handleRunCode = async () => {
    if (!selectedSub) return;
    try {
      setRunning(true);
      setRunResult(null);
      const res = await adminCurriculumAPI.runSubmissionCode(selectedSub.id);
      if (res.success) {
        setRunResult({
          stdout: res.stdout,
          stderr: res.stderr,
          executionTimeMs: res.executionTimeMs,
          exitCode: res.exitCode,
          success: (res.exitCode ?? 0) === 0,
        });
      }
    } catch (err) {
      setRunResult({
        stdout: '',
        stderr: err.message || 'Execution error occurred.',
        executionTimeMs: 0,
        exitCode: 1,
        success: false,
      });
    } finally {
      setRunning(false);
    }
  };

  const handleReviewAction = async (action) => {
    if (!selectedSub) return;
    if (action === 'REJECT' && !adminComment.trim()) {
      alert('Please provide a correction comment when rejecting a submission.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await adminCurriculumAPI.reviewSubmission(selectedSub.id, {
        action,
        adminComment: adminComment.trim(),
      });

      if (res.success) {
        setActionSuccess(res.message);
        setReviewModalOpen(false);
        fetchSubmissions();
      }
    } catch (err) {
      alert(err.message || 'Failed to process review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-[#00FFC6]" />
            <span>Task Submissions & Reviews</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate employee task deliverables, run submitted code live in isolated sandbox, and trigger automatic level unlocking upon approval.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none self-start sm:self-auto">
          {['ALL', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white shadow-purple-glow'
                  : 'bg-[#0F172A] text-slate-400 hover:text-white border border-[#334155]/60'
              }`}
            >
              {st === 'ALL'
                ? 'All Submissions'
                : st === 'PENDING_REVIEW'
                ? 'Pending Review'
                : st === 'APPROVED'
                ? 'Approved'
                : 'Rejected'}
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-600/60 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Submissions Table */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00FFC6]"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
          No task submissions found matching current filter.
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0F172A] border border-[#334155]/80 overflow-hidden shadow-harbor-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#334155] bg-[#131B2E] text-slate-400 font-mono uppercase text-[10px]">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Skill & Level</th>
                  <th className="p-4">Task Title</th>
                  <th className="p-4">Submitted At</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {submissions.map((sub) => {
                  const empUser = sub.employeeProfile?.user;
                  return (
                    <tr key={sub.id} className="hover:bg-[#131B2E]/60 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                            {empUser?.name ? empUser.name.charAt(0).toUpperCase() : 'E'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{empUser?.name || 'Staff'}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {sub.employeeProfile?.employeeId || 'EMP'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-xs">{sub.task?.skill?.name}</span>
                          <span
                            className={`text-[10px] font-mono font-bold mt-0.5 ${
                              sub.task?.level === 'BASIC'
                                ? 'text-cyan-400'
                                : sub.task?.level === 'INTERMEDIATE'
                                ? 'text-amber-400'
                                : 'text-purple-400'
                            }`}
                          >
                            {sub.task?.level}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 max-w-xs">
                        <p className="font-bold text-white text-xs truncate">{sub.task?.title}</p>
                        {sub.githubRepoUrl && (
                          <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 mt-0.5 truncate">
                            <FolderGit2 className="w-3 h-3" />
                            <span className="truncate">{sub.githubRepoUrl}</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-slate-400 text-[11px] font-mono">
                        {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="p-4">
                        {sub.status === 'APPROVED' ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 w-max">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        ) : sub.status === 'PENDING_REVIEW' ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 w-max">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>Pending</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30 w-max">
                            <AlertCircle className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => openReviewModal(sub)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-extrabold text-xs shadow-purple-glow hover:brightness-110 transition"
                        >
                          Review & Run
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Review & Run Modal */}
      {reviewModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-2xl my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-purple-400">
                  {selectedSub.task?.skill?.name} • {selectedSub.task?.level}
                </span>
                <h2 className="text-lg font-black text-white">{selectedSub.task?.title}</h2>
                <p className="text-xs text-slate-400">
                  Submitted by {selectedSub.employeeProfile?.user?.name} ({selectedSub.employeeProfile?.employeeId})
                </p>
              </div>
              <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task Instructions & Expected Output Preview */}
            <div className="p-3.5 rounded-2xl bg-[#070A12] border border-slate-800 text-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-300">Instructions: {selectedSub.task?.instructions}</span>
                {selectedSub.githubRepoUrl && (
                  <a
                    href={selectedSub.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 flex items-center gap-1 font-mono text-[11px] underline"
                  >
                    <span>Open GitHub Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {selectedSub.task?.expectedOutput && (
                <div className="text-[11px] font-mono text-slate-400">
                  <strong className="text-amber-400">Expected:</strong> {selectedSub.task.expectedOutput}
                </div>
              )}
            </div>

            {/* Submitted Code Viewer & Run Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Employee's Submitted Code</span>
                </span>
                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-neon-glow hover:brightness-110 disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
                  <span>{running ? 'Running...' : 'Run Submitted Code'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={selectedSub.submittedCode || '# No single file code submitted'}
                rows="8"
                className="w-full p-4 rounded-2xl bg-[#070A12] border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none leading-relaxed select-all"
              />
            </div>

            {/* Live Terminal Output Panel */}
            <div className="rounded-2xl bg-[#070A12] border border-slate-800 overflow-hidden">
              <div className="px-3.5 py-2 bg-[#131B2E] border-b border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Terminal Execution Output</span>
                </span>
                {runResult && (
                  <span className="text-[10px] font-mono text-slate-400">{runResult.executionTimeMs}ms</span>
                )}
              </div>
              <div className="p-3.5 min-h-[100px] max-h-[180px] overflow-y-auto font-mono text-xs">
                {running ? (
                  <div className="text-cyan-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Executing in sandbox...</span>
                  </div>
                ) : runResult ? (
                  <div className="space-y-1">
                    {runResult.stdout && <pre className="text-emerald-400 whitespace-pre-wrap">{runResult.stdout}</pre>}
                    {runResult.stderr && <pre className="text-rose-400 whitespace-pre-wrap">{runResult.stderr}</pre>}
                  </div>
                ) : (
                  <p className="text-slate-600 italic">Click "Run Submitted Code" to verify program output.</p>
                )}
              </div>
            </div>

            {/* Admin Comment & Decision Action */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Feedback / Comment (Optional on Approval, Required on Rejection)</span>
                </label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="e.g. Good implementation. Correct output. Or: Fix edge case for zero input."
                  rows="2"
                  className="w-full p-3 rounded-xl bg-[#070A12] border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('REJECT')}
                  disabled={submittingReview}
                  className="px-5 py-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600 hover:text-white text-xs font-bold transition disabled:opacity-50"
                >
                  Reject with Feedback
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('APPROVE')}
                  disabled={submittingReview}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg hover:brightness-110 transition disabled:opacity-50"
                >
                  {submittingReview ? 'Processing...' : 'Approve & Unlock Next Level'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
