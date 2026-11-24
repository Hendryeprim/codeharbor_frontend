import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeCurriculumAPI } from '../../services/api';
import {
  Code2,
  Play,
  UploadCloud,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Terminal,
  FolderGit2,
  FileCode2,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const EmployeeCodingWorkspace = () => {
  const { skillSlug, taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await employeeCurriculumAPI.getTaskDetails(taskId);
        if (res.success && res.task) {
          setTask(res.task);
          // If already submitted, load submitted code; otherwise initial code
          if (res.task.mySubmission?.submittedCode) {
            setCode(res.task.mySubmission.submittedCode);
            if (res.task.mySubmission.executionOutput) {
              setExecutionResult({
                stdout: res.task.mySubmission.executionOutput,
                stderr: '',
                executionTimeMs: 0,
                success: true,
              });
            }
          } else {
            setCode(res.task.initialCode || '');
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleRunCode = async () => {
    if (!code || !code.trim()) {
      setExecutionResult({
        stdout: '',
        stderr: 'Please write code in the editor before running.',
        executionTimeMs: 0,
        exitCode: 1,
        success: false,
      });
      return;
    }

    try {
      setRunning(true);
      setExecutionResult(null);
      const res = await employeeCurriculumAPI.runCode(taskId, { code });
      if (res.success) {
        setExecutionResult({
          stdout: res.stdout,
          stderr: res.stderr,
          executionTimeMs: res.executionTimeMs,
          exitCode: res.exitCode,
          success: (res.exitCode ?? 0) === 0,
        });
      }
    } catch (err) {
      setExecutionResult({
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

  const handleSubmitTask = async () => {
    setSubmitError('');
    if (!code || !code.trim()) {
      setSubmitError('Please write and test your code before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitSuccess('');
      const res = await employeeCurriculumAPI.submitTask(taskId, {
        submittedCode: code,
        executionOutput: executionResult?.stdout || '',
      });

      if (res.success) {
        setSubmitSuccess('Task submitted successfully! Awaiting Administrator review.');
        // Refresh task status
        const updated = await employeeCurriculumAPI.getTaskDetails(taskId);
        if (updated.success) setTask(updated.task);
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetCode = () => {
    setCode(task?.initialCode || '');
    setExecutionResult(null);
    setResetConfirmOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00FFC6]"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="p-5 bg-rose-950/40 border border-rose-800 rounded-3xl text-rose-300 text-xs">
          {error || 'Task could not be loaded or is locked.'}
        </div>
        <Link
          to="/employee/skills"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Skill Tracks</span>
        </Link>
      </div>
    );
  }

  const sub = task.mySubmission;
  const isApproved = sub?.status === 'APPROVED';
  const isPending = sub?.status === 'PENDING_REVIEW';
  const isRejected = sub?.status === 'REJECTED';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/employee/skills"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-[#00FFC6] font-bold uppercase">{task.skillName}</span>
              <span className="text-slate-500">/</span>
              <span className="text-cyan-400 font-bold uppercase">{task.level}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{task.title}</h1>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isApproved ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Approved by Admin</span>
            </span>
          ) : isPending ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Pending Review</span>
            </span>
          ) : isRejected ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30">
              <AlertCircle className="w-4 h-4" />
              <span>Revisions Requested</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-400 bg-slate-800 border border-slate-700">
              In Progress
            </span>
          )}
        </div>
      </div>

      {/* Submission Status Alerts */}
      {submitSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-600/60 rounded-2xl text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{submitSuccess}</span>
          </div>
          <button onClick={() => setSubmitSuccess('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-rose-950/40 border border-rose-600/60 rounded-2xl text-rose-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{submitError}</span>
          </div>
          <button onClick={() => setSubmitError('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isApproved && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              <strong>Great job!</strong> Your task has been reviewed and approved by the Administrator.
              {sub.adminComment && ` Feedback: "${sub.adminComment}"`}
            </span>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="p-4 bg-rose-950/40 border border-rose-600/60 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <div>
            <strong className="text-white">Admin Correction Required:</strong>{' '}
            {sub.adminComment || 'Please revise your code and output to meet all task requirements.'}
          </div>
        </div>
      )}

      {/* Main Workspace Grid (Left: Specifications / Right: Editor & Terminal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Task Specifications */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#0F172A] border border-[#334155]/80 space-y-4 shadow-harbor-sm">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                Objective & Description
              </span>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{task.description}</p>
            </div>

            <div className="border-t border-slate-800/80 pt-3">
              <span className="text-[10px] font-mono uppercase font-bold text-[#00FFC6] tracking-wider">
                Instructions
              </span>
              <p className="text-xs text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed">
                {task.instructions}
              </p>
            </div>

            {task.expectedOutput && (
              <div className="border-t border-slate-800/80 pt-3">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
                  Expected Output
                </span>
                <pre className="mt-1.5 p-3 rounded-xl bg-[#070A12] border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                  {task.expectedOutput}
                </pre>
              </div>
            )}

            {task.githubRepoUrl && (
              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300 truncate">
                  <FolderGit2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{task.githubRepoUrl}</span>
                </div>
                <a
                  href={task.githubRepoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Terminal */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          {/* Editor Header */}
          <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#334155]/80 space-y-3 shadow-harbor-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white">
                  solution.{task.skillSlug === 'sql' ? 'sql' : task.skillSlug === 'java' ? 'java' : 'py'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResetConfirmOpen(true)}
                  title="Reset to template"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono">Reset</span>
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="relative flex-1 min-h-[340px]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                spellCheck="false"
                className="w-full h-full min-h-[340px] p-4 rounded-2xl bg-[#070A12] border border-slate-800/80 text-emerald-400 font-mono text-xs focus:outline-none focus:border-cyan-500 leading-relaxed resize-y selection:bg-cyan-500/30"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleRunCode}
                disabled={running}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs flex items-center gap-2 shadow-neon-glow hover:brightness-110 transition disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
                <span>{running ? 'Running in Sandbox...' : 'Run Code'}</span>
              </button>

              <button
                onClick={handleSubmitTask}
                disabled={submitting || isApproved}
                className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition ${
                  isApproved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-black shadow-neon-glow hover:brightness-110 disabled:opacity-50'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>
                  {isApproved
                    ? 'Task Approved ✓'
                    : submitting
                    ? 'Submitting...'
                    : isRejected
                    ? 'Resubmit Task'
                    : isPending
                    ? 'Update Submission'
                    : 'Submit Task'}
                </span>
              </button>
            </div>
          </div>

          {/* Terminal / Output Panel */}
          <div className="rounded-3xl bg-[#070A12] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono font-bold text-slate-300">
                  Terminal / Execution Output
                </span>
              </div>
              {executionResult && (
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-slate-400">{executionResult.executionTimeMs}ms</span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold ${
                      executionResult.success
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    exit {executionResult.exitCode ?? 0}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 min-h-[140px] max-h-[260px] overflow-y-auto font-mono text-xs">
              {running ? (
                <div className="flex items-center gap-2 text-cyan-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Executing program in secure container...</span>
                </div>
              ) : executionResult ? (
                <div className="space-y-2">
                  {executionResult.stdout && (
                    <pre className="text-emerald-400 whitespace-pre-wrap">
                      {executionResult.stdout}
                    </pre>
                  )}
                  {executionResult.stderr && (
                    <pre className="text-rose-400 whitespace-pre-wrap">
                      {executionResult.stderr}
                    </pre>
                  )}
                </div>
              ) : (
                <p className="text-slate-600 italic">
                  Click "Run Code" above to execute your code and see stdout/stderr output here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0F172A] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Reset Editor Code?</h3>
                <p className="text-xs text-slate-400">Your current changes will be reverted.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to revert your code to the initial starter template?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetCode}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg"
              >
                Reset Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
