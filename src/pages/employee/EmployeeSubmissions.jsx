import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI } from '../../services/api';
import { LivePreviewModal } from '../../components/common/LivePreviewModal';
import { UploadCloud, Layers, FileCode, Github, Globe, CheckCircle2, Clock, AlertTriangle, ArrowRight, AlertCircle, Play, Trash2 } from 'lucide-react';

export const EmployeeSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Submission Confirmation State
  const [deleteConfirmSub, setDeleteConfirmSub] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live Output Screen Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [activeVersionId, setActiveVersionId] = useState(null);

  const openPreview = (url, title, versionId = null) => {
    if (!url) return;
    setActivePreviewUrl(url);
    setPreviewTitle(title || 'Live Project Output');
    setActiveVersionId(versionId);
    setPreviewModalOpen(true);
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await employeeAPI.getSubmissions();
      if (res.success) {
        setSubmissions(res.submissions || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async () => {
    if (!deleteConfirmSub) return;
    try {
      setIsDeleting(true);
      setError('');
      const res = await employeeAPI.deleteSubmission(deleteConfirmSub.id);
      if (res.success) {
        setSuccessMsg(res.message || 'Submission deleted successfully.');
        setDeleteConfirmSub(null);
        await fetchSubmissions();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete submission.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <UploadCloud className="w-6 h-6 text-[#00FFC6]" />
          <span>My Submissions & Deliverable Versions</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical timeline of submitted versions, code artifacts, automated test outcomes, and administrator evaluations.
        </p>
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
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
          No project deliverables submitted yet.
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-[#00FFC6] border border-cyan-500/30">
                    {sub.project?.projectType}
                  </span>
                  <h2 className="text-lg font-black text-white mt-1">{sub.project?.title}</h2>
                </div>
                <div className="flex items-center gap-2 self-start">
                  <Link
                    to={`/employee/projects/${sub.projectId}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>Project Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmSub(sub)}
                    className="p-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-400 hover:text-rose-200 transition"
                    title="Delete Submission"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Versions List */}
              <div className="space-y-3">
                {sub.versions?.map((v) => {
                  const latestExec = v.executions?.[0] || null;
                  const latestFeedback = v.feedbacks?.[0] || null;

                  return (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl bg-[#131B2E] border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#00FFC6] bg-cyan-950/60 px-2 py-0.5 rounded">
                            Version {v.versionNumber}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {new Date(v.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {v.fileName && (
                          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{v.fileName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          {v.liveDemoUrl && (
                            <button
                              type="button"
                              onClick={() => openPreview(v.liveDemoUrl, `${sub.project?.title} (v${v.versionNumber})`, v.id)}
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-400 to-[#00FFC6] text-black font-extrabold flex items-center gap-1.5 text-[11px] hover:brightness-110 shadow-sm"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>View Output Screen</span>
                            </button>
                          )}
                          {v.githubUrl && (
                            <a
                              href={v.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                            >
                              <Github className="w-3 h-3" />
                              <span>GitHub</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Execution & Feedback Status */}
                      <div className="flex flex-col md:items-end gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">Sandbox:</span>
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                              latestExec?.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {latestExec?.status || 'AWAITING RUN'}
                          </span>
                        </div>

                        {latestFeedback && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 uppercase font-mono">Decision:</span>
                            <span
                              className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                latestFeedback.status === 'APPROVED'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {latestFeedback.status.replace('_', ' ')}
                            </span>
                            {latestFeedback.overallScore != null && (
                              <span className="text-white font-mono font-black">{latestFeedback.overallScore}/100</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Live Output Screen Modal */}
      <LivePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        previewUrl={activePreviewUrl}
        projectTitle={previewTitle}
        versionId={activeVersionId}
      />

      {/* Delete Submission Confirmation Modal */}
      {deleteConfirmSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#140F28] border border-rose-800/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-950/60 border border-rose-800">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Delete Submission</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete the submission for <strong className="text-white font-mono">"{deleteConfirmSub.project?.title}"</strong>? All versions, executions, and output screens for this submission will be removed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmSub(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteSubmission}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
