import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminPortalAPI } from '../../services/api';
import { LivePreviewModal } from '../../components/common/LivePreviewModal';
import {
  FileCheck2,
  Terminal,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Github,
  Globe,
  FileCode,
  Sparkles,
  Clock,
  Code2,
  Calendar,
  AlertCircle,
  Check,
  Download,
  ArrowLeft,
  Sliders,
} from 'lucide-react';

export const AdminProjectReviews = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

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

  // Selected Version for Execution Console
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState('');
  const [executionReport, setExecutionReport] = useState(null);

  // Review & Feedback Form State
  const [decision, setDecision] = useState('APPROVED'); // APPROVED, REVISION_REQUESTED, REJECTED
  const [comments, setComments] = useState('');
  const [technicalFeedback, setTechnicalFeedback] = useState('');
  const [requiredChanges, setRequiredChanges] = useState('');
  const [testingFeedback, setTestingFeedback] = useState('');
  const [revisionDeadline, setRevisionDeadline] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // 8 Category Scoring (0-10 or 0-100)
  const [scores, setScores] = useState({
    codeQuality: 85,
    functionality: 90,
    uiUx: 80,
    database: 85,
    testing: 80,
    documentation: 85,
    performance: 85,
    security: 90,
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Calculate Overall Score / 100
  const overallScore = Math.round(
    Object.values(scores).reduce((a, b) => a + Number(b), 0) / Object.keys(scores).length
  );

  const fetchReviewsList = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminPortalAPI.getReviews();
      if (res.success) {
        setReviews(res.reviews || []);
        if (submissionId) {
          fetchSingleReview(submissionId);
        } else if (res.reviews?.length > 0 && !selectedReview) {
          fetchSingleReview(res.reviews[0].id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleReview = async (subId) => {
    try {
      const res = await adminPortalAPI.getReviewById(subId);
      if (res.success) {
        setSelectedReview(res);
        const latestVer = res.submission?.versions?.[0] || null;
        if (latestVer) {
          setSelectedVersionId(latestVer.id);
          const latestExec = latestVer.executions?.[0] || null;
          if (latestExec) {
            setConsoleLogs(latestExec.consoleLogs || '');
            setExecutionReport(latestExec);
          } else {
            setConsoleLogs('Ready for isolated sandbox execution.\nClick "Run Project" or "Run Tests" to initialize sandbox container.');
            setExecutionReport(null);
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load submission review details.');
    }
  };

  useEffect(() => {
    fetchReviewsList();
  }, [submissionId]);

  const handleRunExecution = async () => {
    if (!selectedVersionId) return;
    try {
      setExecuting(true);
      setConsoleLogs((prev) => `${prev}\n[Console] Initializing isolated temporary sandbox container...`);
      const res = await adminPortalAPI.runExecution(selectedVersionId);
      if (res.success && res.execution) {
        setConsoleLogs(res.execution.consoleLogs || 'Execution finished.');
        setExecutionReport(res.execution);
        setActionSuccess('Isolated sandbox build and tests execution completed!');
        if (selectedReview?.submission?.id) {
          fetchSingleReview(selectedReview.submission.id);
        }
      }
    } catch (err) {
      setError(err.message || 'Execution error.');
    } finally {
      setExecuting(false);
    }
  };

  const handleStopExecution = async () => {
    if (!selectedVersionId) return;
    try {
      await adminPortalAPI.stopExecution(selectedVersionId);
      setConsoleLogs((prev) => `${prev}\n[Console] Execution stopped.`);
      setExecuting(false);
    } catch (err) {}
  };

  const handleScoreChange = (category, val) => {
    setScores((prev) => ({ ...prev, [category]: Number(val) }));
  };

  const handleSubmitReviewDecision = async (e) => {
    e.preventDefault();
    if (!selectedReview?.submission?.id) return;

    if (decision === 'REVISION_REQUESTED' && !requiredChanges.trim()) {
      alert('Please specify the required changes before requesting revision.');
      return;
    }
    if (decision === 'REJECTED' && !rejectionReason.trim()) {
      alert('Please specify the rejection reason before rejecting.');
      return;
    }

    try {
      setSubmittingFeedback(true);
      const payload = {
        versionId: selectedVersionId,
        status: decision,
        comments,
        technicalFeedback,
        requiredChanges: decision === 'REVISION_REQUESTED' ? requiredChanges : null,
        testingFeedback,
        revisionDeadline: decision === 'REVISION_REQUESTED' && revisionDeadline ? revisionDeadline : null,
        rejectionReason: decision === 'REJECTED' ? rejectionReason : null,
        scoreCodeQuality: scores.codeQuality,
        scoreFunctionality: scores.functionality,
        scoreUiUx: scores.uiUx,
        scoreDatabase: scores.database,
        scoreTesting: scores.testing,
        scoreDocumentation: scores.documentation,
        scorePerformance: scores.performance,
        scoreSecurity: scores.security,
        overallScore,
      };

      const res = await adminPortalAPI.submitFeedback(selectedReview.submission.id, payload);
      if (res.success) {
        setActionSuccess(`Decision recorded: ${decision}. Notification delivered to employee.`);
        fetchSingleReview(selectedReview.submission.id);
        fetchReviewsList();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const currentSubmission = selectedReview?.submission;
  const currentEmployee = selectedReview?.employee;
  const currentProject = currentSubmission?.project;
  const versions = currentSubmission?.versions || [];
  const currentVersion = versions.find((v) => v.id === selectedVersionId) || versions[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-purple-400" />
            <span>Project Review & Execution Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect employee deliverables, execute automated test sandboxes, verify test matrices, and score revisions.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-400 font-bold">&times;</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Left Submissions Selector, Right Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Submissions Selector (1 Col) */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase text-slate-400 font-bold px-1">
            Pending / Active Submissions
          </h3>

          <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {reviews.map((rev) => {
              const isSelected = selectedReview?.submission?.id === rev.id;
              return (
                <div
                  key={rev.id}
                  onClick={() => fetchSingleReview(rev.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-[#140F28] border-purple-500 shadow-purple-glow/20'
                      : 'bg-[#0F172A] border-[#334155]/70 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-cyan-400">
                      {rev.version}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full ${
                        rev.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : rev.status === 'REVISION_REQUIRED'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      {rev.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="font-bold text-white line-clamp-1">{rev.projectTitle}</p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {rev.employee?.name} ({rev.employee?.employeeId})
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>{rev.technology}</span>
                    <span>{new Date(rev.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Review Workspace (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          {!currentSubmission ? (
            <div className="p-16 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
              Select a submission from the list on the left to start code review and isolated execution.
            </div>
          ) : (
            <>
              {/* Submission Overview Card */}
              <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {currentProject?.projectType}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-[#00FFC6] border border-cyan-500/30">
                        {currentProject?.primarySkill}
                      </span>
                      {currentProject?.framework && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {currentProject.framework}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-white">{currentProject?.title}</h2>
                    <p className="text-xs text-slate-400">
                      Author: <span className="text-white font-bold">{currentEmployee?.user?.name}</span> ({currentEmployee?.employeeId}) • {currentEmployee?.designation}
                    </p>
                  </div>

                  {/* Version Picker */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 font-mono">Select Version:</span>
                    <select
                      value={selectedVersionId || ''}
                      onChange={(e) => {
                        setSelectedVersionId(e.target.value);
                        const v = versions.find((ver) => ver.id === e.target.value);
                        const ex = v?.executions?.[0];
                        setConsoleLogs(ex?.consoleLogs || 'Ready for sandbox run.');
                        setExecutionReport(ex || null);
                      }}
                      className="p-2 rounded-xl bg-[#0B0F1A] border border-slate-700 text-cyan-300 font-mono font-bold text-xs"
                    >
                      {versions.map((ver) => (
                        <option key={ver.id} value={ver.id}>
                          Version {ver.versionNumber} ({new Date(ver.createdAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Artifacts & Links Bar */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {/* View Output Screen (Primary Action) */}
                  {currentVersion?.liveDemoUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        openPreview(
                          currentVersion.liveDemoUrl,
                          `${currentProject?.title} (v${currentVersion.versionNumber})`,
                          currentVersion.id
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00FFC6] text-[#0A0713] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-neon-glow flex items-center gap-2 transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>View Output Screen / Live Preview</span>
                    </button>
                  )}

                  {/* Download ZIP */}
                  {currentVersion?.filePath && (
                    <a
                      href={`/api/admin/project-reviews/${currentVersion.id}/download`}
                      download
                      className="px-3 py-2 rounded-xl bg-[#131B2E] border border-slate-700 text-cyan-300 hover:text-white flex items-center gap-1.5 font-mono text-xs transition"
                      title="Download full project package"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Archive ({currentVersion.fileName || 'project.zip'})</span>
                    </a>
                  )}

                  {/* GitHub Repo Link */}
                  {currentVersion?.githubUrl && (
                    <a
                      href={currentVersion.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-[#131B2E] border border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 font-mono text-xs transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub Repository ↗</span>
                    </a>
                  )}
                </div>

                {currentVersion?.readmeContent && (
                  <div className="p-3.5 rounded-2xl bg-[#0B0F1A] border border-slate-800 text-xs">
                    <p className="text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">README / Submission Notes</p>
                    <p className="text-slate-300 whitespace-pre-line">{currentVersion.readmeContent}</p>
                  </div>
                )}
              </div>

              {/* Requirement 30: ADMIN EXECUTION CONSOLE PANEL */}
              <div className="rounded-3xl bg-[#090C15] border border-slate-800 shadow-harbor-lg overflow-hidden">
                <div className="bg-[#0F172A] border-b border-slate-800 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Terminal className="w-4 h-4 text-[#00FFC6]" />
                    <span className="font-mono text-xs font-black text-white uppercase tracking-wider">
                      Execution Console (Isolated Sandbox Container)
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Zero DB Exposure
                    </span>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunExecution}
                      disabled={executing}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#00FFC6] text-black font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-neon-glow"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{executing ? 'Executing Sandbox...' : 'Run Project & Tests'}</span>
                    </button>

                    <button
                      onClick={handleStopExecution}
                      disabled={!executing}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs flex items-center gap-1"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </button>
                  </div>
                </div>

                {/* Console Log Terminal Screen */}
                <div className="p-4 bg-black/90 font-mono text-[11px] text-emerald-400 min-h-[220px] max-h-[340px] overflow-y-auto whitespace-pre-wrap leading-relaxed border-b border-slate-900">
                  {consoleLogs}
                </div>

                {/* Execution Metrics Bar */}
                {executionReport && (
                  <div className="p-4 bg-[#0B0F1A] border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Status</span>
                      <span className="font-bold text-white">{executionReport.status}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Build / Syntax</span>
                      <span className="font-bold text-emerald-400">{executionReport.buildStatus || 'PASSED'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Runtime</span>
                      <span className="font-bold text-cyan-400">
                        {executionReport.runtimeMs ? `${(executionReport.runtimeMs / 1000).toFixed(2)}s` : '0.4s'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Exit Code</span>
                      <span className="font-bold text-white">{executionReport.exitCode ?? 0}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirement 31: 8-Category Scoring Matrix */}
              <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-400" />
                      <span>Evaluation & Quality Scoring Matrix</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Score individual engineering dimensions to compute normalized overall score.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Overall Score</span>
                    <span className="text-2xl font-black text-[#00FFC6] font-mono">{overallScore}/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  {Object.entries(scores).map(([category, val]) => {
                    const formattedTitle = category.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
                    return (
                      <div key={category} className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-300">{formattedTitle}</label>
                          <span className="font-mono font-bold text-white">{val}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={val}
                          onChange={(e) => handleScoreChange(category, e.target.value)}
                          className="w-full accent-[#00FFC6] cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirement 31, 32, 33, 34: Review Decision & Feedback Form */}
              <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-5">
                <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Review Decision, Action & Feedback</span>
                </h3>

                <form onSubmit={handleSubmitReviewDecision} className="space-y-4 text-xs">
                  {/* Decision Selector */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-2">Review Decision</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setDecision('APPROVED')}
                        className={`p-3.5 rounded-2xl border font-bold text-center transition flex items-center justify-center gap-2 ${
                          decision === 'APPROVED'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-neon-glow/20'
                            : 'bg-[#131B2E] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Approve Project</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDecision('REVISION_REQUESTED')}
                        className={`p-3.5 rounded-2xl border font-bold text-center transition flex items-center justify-center gap-2 ${
                          decision === 'REVISION_REQUESTED'
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-purple-glow/20'
                            : 'bg-[#131B2E] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Request Revision</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDecision('REJECTED')}
                        className={`p-3.5 rounded-2xl border font-bold text-center transition flex items-center justify-center gap-2 ${
                          decision === 'REJECTED'
                            ? 'bg-red-500/20 border-red-500 text-red-300'
                            : 'bg-[#131B2E] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span>Reject Project</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments & General Feedback */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Review Comments</label>
                    <textarea
                      rows={2}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Overall remarks and high-level impression of the codebase..."
                      className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                    />
                  </div>

                  {/* Technical & Testing Feedback */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Technical Architecture Feedback</label>
                      <textarea
                        rows={2}
                        value={technicalFeedback}
                        onChange={(e) => setTechnicalFeedback(e.target.value)}
                        placeholder="Code structure, patterns, PEP8 or clean architecture observations..."
                        className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Testing & QA Feedback</label>
                      <textarea
                        rows={2}
                        value={testingFeedback}
                        onChange={(e) => setTestingFeedback(e.target.value)}
                        placeholder="Edge case behavior, test assertions, or coverage feedback..."
                        className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                      />
                    </div>
                  </div>

                  {/* If Revision Requested: Required Changes and Revision Deadline (Rule 32) */}
                  {decision === 'REVISION_REQUESTED' && (
                    <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 space-y-3">
                      <div>
                        <label className="block font-bold text-rose-300 mb-1">
                          Required Changes <span className="text-rose-400">*</span>
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={requiredChanges}
                          onChange={(e) => setRequiredChanges(e.target.value)}
                          placeholder="e.g. Fix login validation. Add API error handling. Improve database relationships."
                          className="w-full p-2.5 rounded-xl border border-rose-800 bg-[#0B0F1A] text-white focus:outline-none focus:border-rose-400"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-rose-300 mb-1">Revision Deadline</label>
                        <input
                          type="date"
                          value={revisionDeadline}
                          onChange={(e) => setRevisionDeadline(e.target.value)}
                          className="w-full sm:w-64 p-2 rounded-xl border border-rose-800 bg-[#0B0F1A] text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* If Rejected: Rejection Reason (Rule 34) */}
                  {decision === 'REJECTED' && (
                    <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/60 space-y-2">
                      <label className="block font-bold text-red-300 mb-1">
                        Rejection Reason <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain specifically why the project is disqualified or rejected..."
                        className="w-full p-2.5 rounded-xl border border-red-800 bg-[#0B0F1A] text-white focus:outline-none focus:border-red-400"
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black uppercase tracking-wider text-xs hover:brightness-110 shadow-purple-glow flex items-center gap-2 transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>{submittingFeedback ? 'Recording Decision...' : `Submit Decision: ${decision}`}</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Live Output Screen Modal */}
      <LivePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        previewUrl={activePreviewUrl}
        projectTitle={previewTitle}
        versionId={activeVersionId}
      />
    </div>
  );
};
