import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeCurriculumAPI } from '../../services/api';
import { ProjectFolderTree } from '../../components/common/ProjectFolderTree';
import { InteractiveTerminal } from '../../components/common/InteractiveTerminal';
import { detectLanguageInfo } from '../../utils/languageDetect';
import { useInteractiveTerminal } from '../../hooks/useInteractiveTerminal';
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
  X,
} from 'lucide-react';

export const EmployeeCodingWorkspace = () => {
  const { skillSlug, taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [code, setCode] = useState('');
  const [repoFiles, setRepoFiles] = useState([]);
  const [originalRepoFiles, setOriginalRepoFiles] = useState([]);
  const [activeFile, setActiveFile] = useState('');
  const [repoTitle, setRepoTitle] = useState('Project Folder');
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [repoError, setRepoError] = useState('');
  const [downloadingZip, setDownloadingZip] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const {
    running,
    terminalSessionId,
    executionResult,
    setExecutionResult,
    envStatus,
    envLoading,
    creatingVenv,
    cwd,
    refreshEnv,
    createVenv,
    runSession,
    sendInput,
    stopProcess,
    clearOutput,
  } = useInteractiveTerminal({
    taskId,
    onRequirementsUpdated: (newReqContent) => {
      setRepoFiles((prev) => {
        const exists = prev.some((f) => (f.path || f.filename) === 'requirements.txt');
        if (exists) {
          return prev.map((f) =>
            (f.path || f.filename) === 'requirements.txt' ? { ...f, content: newReqContent } : f
          );
        }
        return [...prev, { path: 'requirements.txt', filename: 'requirements.txt', content: newReqContent }];
      });
      if (activeFile === 'requirements.txt') setCode(newReqContent);
    },
  });

  const pickPreferredFile = (filesList) => {
    if (!filesList || filesList.length === 0) return null;
    const preferredNames = ['main.py', 'app.py', 'index.py', 'solution.py', 'Main.java', 'main.sql', 'query.sql'];
    for (const pref of preferredNames) {
      const found = filesList.find((f) => (f.path || f.filename).toLowerCase() === pref.toLowerCase());
      if (found) return found;
    }
    const codeFile = filesList.find((f) => /\.(py|java|sql|js|ts|jsx|tsx|html|css)$/i.test(f.path || f.filename));
    return codeFile || filesList[0];
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await employeeCurriculumAPI.getTaskDetails(taskId);
        if (res.success && res.task) {
          const loadedTask = res.task;
          setTask(loadedTask);

          const defaultExt = loadedTask.skillSlug === 'sql' ? 'sql' : loadedTask.skillSlug === 'java' ? 'java' : 'py';
          const defaultFilename = `solution.${defaultExt}`;

          // 1. If employee already has saved projectFiles in submission, load them
          if (Array.isArray(loadedTask.mySubmission?.projectFiles) && loadedTask.mySubmission.projectFiles.length > 0) {
            const subFiles = loadedTask.mySubmission.projectFiles;
            setRepoFiles(subFiles);
            const first = pickPreferredFile(subFiles);
            setActiveFile(first?.filename || first?.path || defaultFilename);
            setCode(loadedTask.mySubmission.submittedCode || first?.content || '');
          } else if (loadedTask.githubRepoUrl) {
            // 2. Fetch full folder & files from GitHub repository
            setLoadingRepo(true);
            setRepoError('');
            try {
              const repoRes = await employeeCurriculumAPI.getTaskRepoFiles(taskId);
              if (repoRes.success && Array.isArray(repoRes.files) && repoRes.files.length > 0) {
                setRepoFiles(repoRes.files);
                setOriginalRepoFiles(repoRes.files);
                if (repoRes.repo?.repo) {
                  setRepoTitle(repoRes.repo.repo);
                }
                const first = pickPreferredFile(repoRes.files);
                if (first) {
                  setActiveFile(first.path || first.filename);
                  setCode(loadedTask.mySubmission?.submittedCode || first.content || '');
                }
              } else {
                const fallback = [{ path: defaultFilename, filename: defaultFilename, content: loadedTask.initialCode || '' }];
                setRepoFiles(fallback);
                setOriginalRepoFiles(fallback);
                setActiveFile(defaultFilename);
                setCode(loadedTask.mySubmission?.submittedCode || loadedTask.initialCode || '');
              }
            } catch (rErr) {
              setRepoError(rErr.message || 'Could not load repository files.');
              const fallback = [{ path: defaultFilename, filename: defaultFilename, content: loadedTask.initialCode || '' }];
              setRepoFiles(fallback);
              setActiveFile(defaultFilename);
              setCode(loadedTask.mySubmission?.submittedCode || loadedTask.initialCode || '');
            } finally {
              setLoadingRepo(false);
            }
          } else {
            // 3. Single starter file
            const starterCode = loadedTask.mySubmission?.submittedCode || loadedTask.initialCode || '';
            const fallback = [{ path: defaultFilename, filename: defaultFilename, content: starterCode }];
            setRepoFiles(fallback);
            setOriginalRepoFiles(fallback);
            setActiveFile(defaultFilename);
            setCode(starterCode);
          }

          if (loadedTask.mySubmission?.executionOutput) {
            setExecutionResult({
              stdout: loadedTask.mySubmission.executionOutput,
              stderr: '',
              executionTimeMs: 0,
              success: true,
            });
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

  const handleSelectFile = (filePath) => {
    const found = repoFiles.find((f) => (f.path || f.filename) === filePath);
    if (!found) return;
    setActiveFile(filePath);
    setCode(found.content ?? '');
  };

  const handleCodeChange = (newVal) => {
    setCode(newVal);
    setRepoFiles((prev) =>
      prev.map((f) =>
        (f.path || f.filename) === activeFile ? { ...f, content: newVal } : f
      )
    );
  };

  const handleDownloadFolderZip = async () => {
    try {
      setDownloadingZip(true);
      const safeName = `${(repoTitle || task?.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.zip`;
      const filesPayload = repoFiles.map((f) => ({
        filename: f.path || f.filename,
        content: f.content ?? '',
      }));
      await employeeCurriculumAPI.downloadTaskZip(taskId, filesPayload, safeName);
    } catch (err) {
      setSubmitError(err.message || 'Failed to download folder ZIP.');
    } finally {
      setDownloadingZip(false);
    }
  };

  // Auto-inspect venv and requirements.txt once files finish loading
  useEffect(() => {
    if (!loading && task && repoFiles.length > 0) {
      refreshEnv(repoFiles);
    }
  }, [loading, task?.id]);

  const handleRunFileTarget = async (targetFilePath = activeFile, commandLabel = '') => {
    const fileObj = repoFiles.find((f) => (f.path || f.filename) === targetFilePath);
    const codeToRun = fileObj ? (fileObj.content ?? '') : code;
    const entryName = targetFilePath || activeFile || `solution.${task?.skillSlug === 'sql' ? 'sql' : task?.skillSlug === 'java' ? 'java' : 'py'}`;

    if (fileObj && targetFilePath !== activeFile) {
      setActiveFile(targetFilePath);
      setCode(codeToRun);
    }

    if (!codeToRun || !codeToRun.trim()) {
      setExecutionResult({
        stdout: '',
        stderr: 'Please write code in the editor before running.',
        executionTimeMs: 0,
        exitCode: 1,
        success: false,
        command: commandLabel || entryName,
      });
      return;
    }

    await runSession({
      files: repoFiles,
      code: codeToRun,
      entryFile: entryName,
      skillSlug: task?.skillSlug,
      commandLabel,
    });
  };

  const handleRunCommand = (rawCommand) =>
    runSession({
      files: repoFiles,
      code,
      entryFile: activeFile || 'main.py',
      rawCommand,
      skillSlug: task?.skillSlug,
      commandLabel: rawCommand,
    });

  const handleRunCode = () => handleRunFileTarget(activeFile);

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
        projectFiles:
          repoFiles.length > 0
            ? repoFiles.map((f) => ({
                filename: f.path || f.filename,
                content: f.content ?? '',
              }))
            : undefined,
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
    if (originalRepoFiles.length > 0) {
      setRepoFiles(originalRepoFiles);
      const orig = originalRepoFiles.find((f) => (f.path || f.filename) === activeFile);
      setCode(orig ? orig.content : task?.initialCode || '');
    } else {
      setCode(task?.initialCode || '');
    }
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

          </div>

          {/* Interactive Folder & File Explorer (Replaces static GitHub link) */}
          <ProjectFolderTree
            files={repoFiles}
            activeFile={activeFile}
            onSelectFile={handleSelectFile}
            onDownloadZip={handleDownloadFolderZip}
            downloadingZip={downloadingZip}
            loadingRepo={loadingRepo}
            repoError={repoError}
            title={repoTitle}
          />
        </div>

        {/* Right Column: Code Editor & Terminal */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          {/* Editor Header */}
          <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#334155]/80 space-y-3 shadow-harbor-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2 min-w-0">
                <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-white truncate">
                  {activeFile || `solution.${task.skillSlug === 'sql' ? 'sql' : task.skillSlug === 'java' ? 'java' : 'py'}`}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border shrink-0 ${
                    detectLanguageInfo(activeFile, task.skillSlug).badgeClass
                  }`}
                >
                  {detectLanguageInfo(activeFile, task.skillSlug).label}
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
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Write or edit your code here..."
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

          {/* Interactive Terminal / Output Panel */}
          <InteractiveTerminal
            files={repoFiles}
            activeFile={activeFile}
            skillSlug={task.skillSlug}
            running={running}
            interactiveActive={Boolean(terminalSessionId)}
            executionResult={executionResult}
            envStatus={envStatus}
            envLoading={envLoading}
            creatingVenv={creatingVenv}
            cwd={cwd}
            onRunFile={(targetPath, cmd) => handleRunFileTarget(targetPath, cmd)}
            onRunCommand={handleRunCommand}
            onSendInput={sendInput}
            onStopProcess={stopProcess}
            onClearOutput={clearOutput}
            onRefreshEnv={() => refreshEnv(repoFiles)}
            onCreateVenv={() => createVenv(repoFiles)}
          />
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
