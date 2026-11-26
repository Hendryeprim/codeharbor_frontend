import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeCurriculumAPI } from '../../services/api';
import { ProjectFolderTree } from '../../components/common/ProjectFolderTree';
import { InteractiveTerminal } from '../../components/common/InteractiveTerminal';
import { detectLanguageInfo } from '../../utils/languageDetect';
import {
  FolderGit2,
  Play,
  UploadCloud,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Terminal,
  FileCode2,
  FolderTree,
  Plus,
  Trash2,
  Layers,
  MonitorPlay,
  ExternalLink,
  Save,
  Download,
  Loader2,
  X,
} from 'lucide-react';

export const EmployeeAdvancedProjectWorkspace = () => {
  const { skillSlug, taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [files, setFiles] = useState([
    { filename: 'main.py', content: '# Project Entry Point\nprint("Advanced Project Server Initialized.")\n' },
    { filename: 'models.py', content: '# Data Models\nclass Item:\n    def __init__(self, id, name):\n        self.id = id\n        self.name = name\n' },
    { filename: 'database.py', content: '# Database Configuration\nimport sqlite3\nconn = sqlite3.connect(":memory:")\nprint("Database connected.")\n' },
  ]);
  const [activeFile, setActiveFile] = useState('main.py');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [running, setRunning] = useState(false);
  const [terminalSessionId, setTerminalSessionId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [fileError, setFileError] = useState('');
  const [fileToDelete, setFileToDelete] = useState(null);
  const [newFileModalOpen, setNewFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [repoError, setRepoError] = useState('');
  const [downloadingZip, setDownloadingZip] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await employeeCurriculumAPI.getTaskDetails(taskId);
        if (res.success && res.task) {
          setTask(res.task);
          if (res.task.mySubmission?.projectFiles && Array.isArray(res.task.mySubmission.projectFiles)) {
            setFiles(res.task.mySubmission.projectFiles);
            if (res.task.mySubmission.projectFiles.length > 0) {
              setActiveFile(res.task.mySubmission.projectFiles[0].filename);
            }
          } else if (res.task.githubRepoUrl) {
            setLoadingRepo(true);
            setRepoError('');
            try {
              const repoRes = await employeeCurriculumAPI.getTaskRepoFiles(taskId);
              if (repoRes.success && Array.isArray(repoRes.files) && repoRes.files.length > 0) {
                const mapped = repoRes.files.map((f) => ({
                  filename: f.path || f.filename,
                  content: f.content ?? '',
                }));
                setFiles(mapped);
                const preferred = mapped.find((f) => /^(main|app|index)\.(py|java|js|sql)$/i.test(f.filename)) || mapped[0];
                setActiveFile(preferred.filename);
              }
            } catch (rErr) {
              setRepoError(rErr.message || 'Failed to load GitHub repository files.');
            } finally {
              setLoadingRepo(false);
            }
          } else if (res.task.initialCode) {
            setFiles([{ filename: 'main.py', content: res.task.initialCode }]);
          }
          if (res.task.mySubmission?.githubRepoUrl) {
            setGithubRepoUrl(res.task.mySubmission.githubRepoUrl);
          } else if (res.task.githubRepoUrl) {
            setGithubRepoUrl(res.task.githubRepoUrl);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load advanced project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleDownloadFolderZip = async () => {
    try {
      setDownloadingZip(true);
      const safeName = `${(task?.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.zip`;
      await employeeCurriculumAPI.downloadTaskZip(taskId, files, safeName);
    } catch (err) {
      setFileError(err.message || 'Failed to download project folder.');
    } finally {
      setDownloadingZip(false);
    }
  };

  const currentFileObj = files.find((f) => f.filename === activeFile) || files[0];

  const handleContentChange = (newContent) => {
    setFiles((prev) =>
      prev.map((f) => (f.filename === activeFile ? { ...f, content: newContent } : f))
    );
  };

  const handleAddNewFile = () => {
    setNewFileName('');
    setFileError('');
    setNewFileModalOpen(true);
  };

  const handleConfirmAddFile = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const clean = newFileName.trim().replace(/^[\/\\]+/, '');
    if (files.some((f) => f.filename === clean)) {
      setFileError('File with this name already exists.');
      return;
    }
    setFiles((prev) => [...prev, { filename: clean, content: `# ${clean}\n` }]);
    setActiveFile(clean);
    setNewFileModalOpen(false);
    setNewFileName('');
    setFileError('');
  };

  const handleDeleteFile = (fname) => {
    if (files.length <= 1) {
      setFileError('Project must have at least one file.');
      return;
    }
    setFileToDelete(fname);
  };

  const confirmDeleteFile = () => {
    if (!fileToDelete) return;
    const remaining = files.filter((f) => f.filename !== fileToDelete);
    setFiles(remaining);
    setActiveFile(remaining[0].filename);
    setFileToDelete(null);
  };

  const handleRunProject = async (targetEntryFile = activeFile || 'main.py', commandLabel = '') => {
    const entryToRun = targetEntryFile || activeFile || 'main.py';
    if (targetEntryFile && targetEntryFile !== activeFile && files.some((f) => f.filename === targetEntryFile)) {
      setActiveFile(targetEntryFile);
    }
    const cmdDisplay = commandLabel || `${detectLanguageInfo(entryToRun, task?.skillSlug).runPrefix || 'run'} ${entryToRun}`.trim();

    try {
      setRunning(true);
      setTerminalSessionId(null);
      setExecutionResult({
        stdout: '',
        stderr: '',
        executionTimeMs: 0,
        exitCode: 0,
        success: true,
        detectedLanguage: detectLanguageInfo(entryToRun, task?.skillSlug).label,
        command: cmdDisplay,
      });

      const startRes = await employeeCurriculumAPI.startTerminal(taskId, {
        projectFiles: files,
        entryFile: entryToRun,
      });
      if (!startRes.success || !startRes.sessionId) {
        throw new Error(startRes.message || 'Failed to start interactive terminal.');
      }

      setTerminalSessionId(startRes.sessionId);
      setExecutionResult((prev) => ({
        ...(prev || {}),
        detectedLanguage: startRes.detectedLanguage || prev?.detectedLanguage,
      }));

      await employeeCurriculumAPI.streamTerminal(taskId, startRes.sessionId, {
        onStdout: (chunk) => {
          setExecutionResult((prev) => ({
            ...(prev || {}),
            stdout: (prev?.stdout || '') + chunk,
          }));
        },
        onStderr: (chunk) => {
          setExecutionResult((prev) => ({
            ...(prev || {}),
            stderr: (prev?.stderr || '') + chunk,
          }));
        },
        onExit: (info) => {
          setExecutionResult((prev) => ({
            ...(prev || {}),
            executionTimeMs: info?.executionTimeMs ?? 0,
            exitCode: info?.exitCode ?? 0,
            success: (info?.exitCode ?? 0) === 0,
          }));
          setTerminalSessionId(null);
          setRunning(false);
        },
      });
    } catch (err) {
      setExecutionResult((prev) => ({
        stdout: prev?.stdout || '',
        stderr: (prev?.stderr || '') + (err.message || 'Execution error occurred.'),
        executionTimeMs: 0,
        exitCode: 1,
        success: false,
        command: cmdDisplay,
      }));
    } finally {
      setTerminalSessionId(null);
      setRunning(false);
    }
  };

  const handleSendTerminalInput = async (inputStr) => {
    if (!terminalSessionId) return;
    setExecutionResult((prev) => ({
      ...(prev || {}),
      stdout: (prev?.stdout || '') + `${inputStr}\n`,
    }));
    try {
      await employeeCurriculumAPI.sendTerminalInput(taskId, terminalSessionId, inputStr);
    } catch (err) {
      setExecutionResult((prev) => ({
        ...(prev || {}),
        stderr: (prev?.stderr || '') + `\n[Input Error]: ${err.message}`,
      }));
    }
  };

  const handleStopTerminal = async () => {
    if (!terminalSessionId) return;
    try {
      await employeeCurriculumAPI.stopTerminal(taskId, terminalSessionId);
    } catch {}
    setTerminalSessionId(null);
    setRunning(false);
  };

  const handleSubmitProject = async () => {
    try {
      setSubmitting(true);
      setSubmitSuccess('');
      setSubmitError('');
      const res = await employeeCurriculumAPI.submitTask(taskId, {
        projectFiles: files,
        githubRepoUrl: githubRepoUrl.trim() || null,
        executionOutput: executionResult?.stdout || '',
        submittedCode: currentFileObj?.content || '',
      });

      if (res.success) {
        setSubmitSuccess('Advanced Project submitted successfully! Awaiting Administrator evaluation.');
        const updated = await employeeCurriculumAPI.getTaskDetails(taskId);
        if (updated.success) setTask(updated.task);
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit project.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00FFC6]"></div>
      </div>
    );
  }

  const sub = task?.mySubmission;
  const isApproved = sub?.status === 'APPROVED';
  const isPending = sub?.status === 'PENDING_REVIEW';
  const isRejected = sub?.status === 'REJECTED';

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <span className="text-[#00FFC6] font-bold uppercase">{task?.skillName}</span>
              <span className="text-slate-500">/</span>
              <span className="text-amber-400 font-bold uppercase">ADVANCED FULL PROJECT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{task?.title}</h1>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isApproved ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Project Approved ✓</span>
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
            <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30">
              Active Project
            </span>
          )}
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-600/60 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
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
        <div className="p-4 bg-rose-950/40 border border-rose-600/60 rounded-2xl text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{submitError}</span>
          </div>
          <button onClick={() => setSubmitError('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {fileError && (
        <div className="p-4 bg-amber-950/40 border border-amber-600/60 rounded-2xl text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{fileError}</span>
          </div>
          <button onClick={() => setFileError('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isRejected && (
        <div className="p-4 bg-rose-950/40 border border-rose-600/60 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <div>
            <strong className="text-white">Admin Correction:</strong> {sub.adminComment}
          </div>
        </div>
      )}

      {/* GitHub Mapping Banner */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FolderGit2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">GitHub Repository Mapping (Optional)</p>
            <p className="text-[11px] text-slate-400">
              Link your remote GitHub repository for this Advanced project deliverable.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={githubRepoUrl}
            onChange={(e) => setGithubRepoUrl(e.target.value)}
            placeholder="https://github.com/username/project.git"
            className="px-3.5 py-1.5 rounded-xl bg-[#070A12] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Multi-File Project Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Explorer */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handleAddNewFile}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
              title="Add New File"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>New File</span>
            </button>
          </div>

          <ProjectFolderTree
            files={files}
            activeFile={activeFile}
            onSelectFile={(fname) => setActiveFile(fname)}
            onDeleteFile={files.length > 1 ? handleDeleteFile : undefined}
            onDownloadZip={handleDownloadFolderZip}
            downloadingZip={downloadingZip}
            loadingRepo={loadingRepo}
            repoError={repoError}
            title="Project Folder"
          />

          <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#334155]/80 text-[11px] text-slate-400 shadow-harbor-sm">
            <p className="font-bold text-white mb-1">Project Instructions</p>
            <p className="leading-relaxed whitespace-pre-wrap">{task?.instructions}</p>
          </div>
        </div>

        {/* Right: Code Editor & Terminal */}
        <div className="lg:col-span-9 space-y-4">
          <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#334155]/80 space-y-3 shadow-harbor-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                <span>Editing: {activeFile}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                    detectLanguageInfo(activeFile, task?.skillSlug).badgeClass
                  }`}
                >
                  {detectLanguageInfo(activeFile, task?.skillSlug).label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">Autosaved in workspace</span>
              </div>
            </div>

            <textarea
              value={currentFileObj?.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              spellCheck="false"
              className="w-full h-80 p-4 rounded-2xl bg-[#070A12] border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none focus:border-cyan-500 leading-relaxed resize-y selection:bg-cyan-500/30"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleRunProject(activeFile || 'main.py')}
                disabled={running}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs flex items-center gap-2 shadow-neon-glow hover:brightness-110 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
                <span>{running ? 'Running Project...' : `Run (${activeFile || 'main.py'})`}</span>
              </button>

              <button
                onClick={handleSubmitProject}
                disabled={submitting || isApproved}
                className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 ${
                  isApproved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-black shadow-neon-glow hover:brightness-110 disabled:opacity-50'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>
                  {isApproved
                    ? 'Project Approved ✓'
                    : submitting
                    ? 'Submitting...'
                    : isRejected
                    ? 'Resubmit Project'
                    : 'Submit Project Deliverable'}
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Terminal */}
          <InteractiveTerminal
            files={files}
            activeFile={activeFile}
            skillSlug={task?.skillSlug}
            running={running}
            interactiveActive={Boolean(terminalSessionId)}
            executionResult={executionResult}
            onRunFile={(targetPath, cmd) => handleRunProject(targetPath, cmd)}
            onSendInput={handleSendTerminalInput}
            onStopProcess={handleStopTerminal}
            onClearOutput={() => setExecutionResult(null)}
            onShowInfo={(msg, isErr = false) =>
              setExecutionResult({
                stdout: isErr ? '' : msg,
                stderr: isErr ? msg : '',
                executionTimeMs: 0,
                exitCode: isErr ? 1 : 0,
                success: !isErr,
              })
            }
          />
        </div>
      </div>
      {/* New File Modal */}
      {newFileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0F172A] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                <span>Create New Project File</span>
              </h3>
              <button onClick={() => setNewFileModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddFile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">File Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. routes.py or config.json"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setNewFileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white text-xs font-bold shadow-lg"
                >
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete File Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0F172A] border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Delete File?</h3>
                <p className="text-xs text-slate-400 font-mono">{fileToDelete}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this file from your project workspace?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteFile}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
