import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeCurriculumAPI } from '../../services/api';
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
  const [submitting, setSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

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
          } else if (res.task.initialCode) {
            setFiles([{ filename: 'main.py', content: res.task.initialCode }]);
          }
          if (res.task.mySubmission?.githubRepoUrl) {
            setGithubRepoUrl(res.task.mySubmission.githubRepoUrl);
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

  const currentFileObj = files.find((f) => f.filename === activeFile) || files[0];

  const handleContentChange = (newContent) => {
    setFiles((prev) =>
      prev.map((f) => (f.filename === activeFile ? { ...f, content: newContent } : f))
    );
  };

  const handleAddNewFile = () => {
    const name = prompt('Enter new file name (e.g. routes.py or config.json):');
    if (!name) return;
    const clean = name.trim().replace(/^[\/\\]+/, '');
    if (files.some((f) => f.filename === clean)) {
      alert('File with this name already exists.');
      return;
    }
    setFiles((prev) => [...prev, { filename: clean, content: `# ${clean}\n` }]);
    setActiveFile(clean);
  };

  const handleDeleteFile = (fname) => {
    if (files.length <= 1) {
      alert('Project must have at least one file.');
      return;
    }
    if (confirm(`Delete ${fname}?`)) {
      const remaining = files.filter((f) => f.filename !== fname);
      setFiles(remaining);
      setActiveFile(remaining[0].filename);
    }
  };

  const handleRunProject = async () => {
    try {
      setRunning(true);
      setExecutionResult(null);
      const res = await employeeCurriculumAPI.runCode(taskId, {
        projectFiles: files,
        entryFile: 'main.py',
      });
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

  const handleSubmitProject = async () => {
    try {
      setSubmitting(true);
      setSubmitSuccess('');
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
      alert(err.message || 'Failed to submit project.');
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
        <div className="p-4 bg-emerald-950/40 border border-emerald-600/60 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{submitSuccess}</span>
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
          <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#334155]/80 space-y-3 shadow-harbor-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span>Project Files</span>
              </span>
              <button
                onClick={handleAddNewFile}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                title="Add New File"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {files.map((f) => (
                <div
                  key={f.filename}
                  onClick={() => setActiveFile(f.filename)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between cursor-pointer transition ${
                    activeFile === f.filename
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-[#00FFC6] font-bold border border-[#00FFC6]/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{f.filename}</span>
                  </div>
                  {files.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(f.filename);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <p className="font-bold text-white mb-1">Project Instructions</p>
              <p className="leading-relaxed line-clamp-6">{task?.instructions}</p>
            </div>
          </div>
        </div>

        {/* Right: Code Editor & Terminal */}
        <div className="lg:col-span-9 space-y-4">
          <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#334155]/80 space-y-3 shadow-harbor-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                <span>Editing: {activeFile}</span>
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
                onClick={handleRunProject}
                disabled={running}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs flex items-center gap-2 shadow-neon-glow hover:brightness-110 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
                <span>{running ? 'Running Project...' : 'Run Project (main.py)'}</span>
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

          {/* Terminal */}
          <div className="rounded-3xl bg-[#070A12] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono font-bold text-slate-300">
                  Project Terminal Output
                </span>
              </div>
              {executionResult && (
                <span className="text-[10px] font-mono text-slate-400">
                  {executionResult.executionTimeMs}ms
                </span>
              )}
            </div>

            <div className="p-4 min-h-[140px] max-h-[260px] overflow-y-auto font-mono text-xs">
              {running ? (
                <div className="flex items-center gap-2 text-cyan-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Booting isolated project runtime...</span>
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
                  Click "Run Project" to execute the full multi-file application and view console logs here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
