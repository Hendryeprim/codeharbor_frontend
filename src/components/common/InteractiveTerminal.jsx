import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  CornerDownLeft,
  Cpu,
  Square,
  Package,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  Folder,
  FileText,
  ArrowUpCircle,
} from 'lucide-react';
import { detectLanguageInfo, resolveTerminalCommand } from '../../utils/languageDetect';

export const InteractiveTerminal = ({
  files = [],
  activeFile = '',
  skillSlug = 'python',
  running = false,
  interactiveActive = false,
  executionResult = null,
  envStatus = null,
  envLoading = false,
  creatingVenv = false,
  cwd = '',
  onRunFile,
  onRunCommand,
  onSendInput,
  onStopProcess,
  onClearOutput,
  onRefreshEnv,
  onCreateVenv,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [showDeps, setShowDeps] = useState(false);
  const [confirmInstallMsg, setConfirmInstallMsg] = useState(null);
  const outputRef = useRef(null);

  const langInfo = detectLanguageInfo(activeFile, skillSlug);
  const displayLang = executionResult?.detectedLanguage || langInfo.label;
  const venvExists = envStatus?.venv?.exists;
  const venvName = envStatus?.venv?.name || 'venv';
  const summary = envStatus?.summary || { totalRequired: 0, installed: 0, missing: 0, conflicts: 0 };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [executionResult?.stdout, executionResult?.stderr, running]);

  const executeShellOrFile = (cmd) => {
    const parsed = resolveTerminalCommand(cmd, files);
    if (parsed.type === 'clear') {
      onClearOutput?.();
      return;
    }
    if (parsed.type === 'run' && parsed.file) {
      const targetPath = parsed.file.path || parsed.file.filename;
      onRunFile?.(targetPath, cmd);
      return;
    }
    if (parsed.type === 'shell') {
      onRunCommand?.(parsed.command);
    }
  };

  const handleSubmitCommand = (e) => {
    e.preventDefault();
    const raw = commandInput;
    const cmd = raw.trim();

    if (running && interactiveActive) {
      setCommandInput('');
      onSendInput?.(raw);
      return;
    }

    if (!cmd || running) return;

    setHistory((prev) => [cmd, ...prev.slice(0, 39)]);
    setHistoryIdx(-1);
    setCommandInput('');
    executeShellOrFile(cmd);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'c' && running && interactiveActive) {
      e.preventDefault();
      onStopProcess?.();
      return;
    }
    if (running && interactiveActive) return;

    if (e.key === 'ArrowUp' && history.length > 0) {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(nextIdx);
      setCommandInput(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setCommandInput('');
      } else {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setCommandInput(history[nextIdx]);
      }
    }
  };

  const triggerProtectedPipAction = (command, label) => {
    if (!venvExists) {
      setConfirmInstallMsg({
        command,
        label,
        text: 'No active virtual environment detected. Creating a project venv first is strongly recommended to avoid global installs.',
      });
      return;
    }
    onRunCommand?.(command);
  };

  const promptPrefix =
    running && interactiveActive
      ? 'stdin >'
      : venvExists
      ? `(${venvName}) $`
      : '$';

  return (
    <div className="rounded-3xl bg-[#070A12] border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#0F172A] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono font-bold text-slate-300">Terminal</span>

          {/* Active Virtual Environment Pill */}
          {venvExists ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              title={`Active Python virtual environment: ${venvName}/`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>({venvName})</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={onCreateVenv}
              disabled={creatingVenv || running}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition disabled:opacity-50"
              title="Create and activate Python virtual environment (venv/)"
            >
              <Plus className={`w-3 h-3 ${creatingVenv ? 'animate-spin' : ''}`} />
              <span>{creatingVenv ? 'Creating venv...' : 'Create venv'}</span>
            </button>
          )}

          {/* Current Directory Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60">
            <Folder className="w-3 h-3 text-slate-400" />
            <span>/{cwd || 'workspace'}</span>
          </span>

          {/* Auto-detected Language Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${langInfo.badgeClass}`}
            title="Auto-detected language"
          >
            <Cpu className="w-3 h-3" />
            <span>{displayLang}</span>
          </span>

          {/* Dependency Dashboard Toggle */}
          <button
            type="button"
            onClick={() => setShowDeps((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border transition ${
              summary.missing > 0 || summary.conflicts > 0
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25'
            }`}
          >
            <Package className="w-3 h-3" />
            <span>
              Deps{summary.totalRequired > 0 ? ` (${summary.installed}/${summary.totalRequired})` : ''}
            </span>
            {showDeps ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {running && interactiveActive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 animate-pulse">
              LIVE STDIN
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          {running && interactiveActive && onStopProcess && (
            <button
              type="button"
              onClick={onStopProcess}
              className="px-2 py-0.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1 transition"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>Stop (Ctrl+C)</span>
            </button>
          )}
          {executionResult && !running && (
            <>
              <span className="text-slate-400">{executionResult.executionTimeMs ?? 0}ms</span>
              <span
                className={`px-1.5 py-0.5 rounded font-bold ${
                  executionResult.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                exit {executionResult.exitCode ?? 0}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Collapsible Dependency Management Dashboard */}
      {showDeps && (
        <div className="p-4 bg-[#0B1222] border-b border-slate-800 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">
                Required: {summary.totalRequired}
              </span>
              <span className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold">
                Installed: {summary.installed}
              </span>
              <span className="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-300 font-mono text-[10px] font-bold">
                Missing: {summary.missing}
              </span>
              <span className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-mono text-[10px] font-bold">
                Conflicts: {summary.conflicts}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {envStatus?.hasRequirements && (
                <button
                  type="button"
                  disabled={running}
                  onClick={() => triggerProtectedPipAction('pip install -r requirements.txt', 'Install All Dependencies')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition disabled:opacity-50"
                >
                  <Download className="w-3 h-3" />
                  <span>Install All</span>
                </button>
              )}
              <button
                type="button"
                disabled={running}
                onClick={() => triggerProtectedPipAction('pip freeze > requirements.txt', 'Generate requirements.txt')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1 transition disabled:opacity-50"
              >
                <FileText className="w-3 h-3" />
                <span>Freeze requirements.txt</span>
              </button>
              <button
                type="button"
                disabled={envLoading}
                onClick={onRefreshEnv}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${envLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {confirmInstallMsg && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-[11px] flex flex-wrap items-center justify-between gap-2">
              <span>{confirmInstallMsg.text}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const cmd = confirmInstallMsg.command;
                    setConfirmInstallMsg(null);
                    await onCreateVenv?.();
                    onRunCommand?.(cmd);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                >
                  Create venv &amp; Run
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cmd = confirmInstallMsg.command;
                    setConfirmInstallMsg(null);
                    onRunCommand?.(cmd);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-[10px]"
                >
                  Run Anyway
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmInstallMsg(null)}
                  className="px-2 py-1 text-slate-400 hover:text-white text-[10px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {envStatus?.pipError && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-700/50 text-rose-300 text-[11px]">
              {envStatus.pipError}
            </div>
          )}

          {envStatus?.invalidLines?.length > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-700/50 text-amber-300 text-[11px]">
              Invalid lines in requirements.txt: {envStatus.invalidLines.map((l) => `Line ${l.line} (${l.raw})`).join(', ')}
            </div>
          )}

          {envStatus?.dependencies?.length > 0 ? (
            <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-800 divide-y divide-slate-800/80 bg-[#070A12]">
              {envStatus.dependencies.map((dep) => (
                <div key={dep.name} className="px-3 py-2 flex items-center justify-between gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    {dep.status === 'INSTALLED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : dep.status === 'CONFLICT' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span className="text-white font-bold truncate">{dep.name}</span>
                    <span className="text-slate-400">{dep.constraint}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-400">
                      {dep.installedVersion ? `v${dep.installedVersion}` : 'Not installed'}
                    </span>
                    {dep.status !== 'INSTALLED' && (
                      <button
                        type="button"
                        disabled={running}
                        onClick={() =>
                          triggerProtectedPipAction(
                            dep.status === 'CONFLICT'
                              ? `pip install --upgrade "${dep.name}${dep.constraint !== 'latest' ? dep.constraint : ''}"`
                              : `pip install "${dep.name}${dep.constraint !== 'latest' ? dep.constraint : ''}"`,
                            `${dep.status === 'CONFLICT' ? 'Update' : 'Install'} ${dep.name}`
                          )
                        }
                        className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1"
                      >
                        <ArrowUpCircle className="w-3 h-3" />
                        <span>{dep.status === 'CONFLICT' ? 'Update' : 'Install'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-[11px]">
              {envStatus?.hasRequirements
                ? 'requirements.txt is empty.'
                : 'No requirements.txt found in project root. Run "pip freeze > requirements.txt" or click Freeze above.'}
              {envStatus?.installedPackages?.length > 0 &&
                ` (${envStatus.installedPackages.length} packages installed in active environment)`}
            </p>
          )}
        </div>
      )}

      {/* Output Area */}
      <div ref={outputRef} className="p-4 min-h-[160px] max-h-[280px] overflow-y-auto font-mono text-xs">
        {executionResult ? (
          <div className="space-y-1.5">
            {executionResult.command && (
              <div className="text-slate-500 text-[11px]">
                {venvExists ? `(${venvName}) ` : ''}$ {executionResult.command}
              </div>
            )}
            {executionResult.stdout && (
              <pre className="text-emerald-400 whitespace-pre-wrap">{executionResult.stdout}</pre>
            )}
            {executionResult.stderr && (
              <pre className="text-rose-400 whitespace-pre-wrap">{executionResult.stderr}</pre>
            )}
            {running && (
              <div className="flex items-center gap-2 text-cyan-400 pt-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[11px]">
                  {interactiveActive ? 'Running — type input below or press Ctrl+C to stop...' : 'Executing...'}
                </span>
              </div>
            )}
          </div>
        ) : running ? (
          <div className="flex items-center gap-2 text-cyan-400">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Starting {activeFile || 'command'} ({langInfo.label}) in secure workspace...</span>
          </div>
        ) : (
          <p className="text-slate-600 italic">
            Try <span className="text-slate-400">python {activeFile || 'main.py'}</span>,{' '}
            <span className="text-slate-400">pip list</span>,{' '}
            <span className="text-slate-400">pip install -r requirements.txt</span>,{' '}
            <span className="text-slate-400">cd</span>, or <span className="text-slate-400">ls</span>.
          </p>
        )}
      </div>

      {/* Interactive Command / Stdin Input */}
      <form
        onSubmit={handleSubmitCommand}
        className={`px-3 py-2 border-t flex items-center gap-2 transition ${
          running && interactiveActive
            ? 'bg-emerald-950/30 border-emerald-500/40'
            : 'bg-[#0B1120] border-slate-800/90'
        }`}
      >
        <span
          className={`text-xs font-mono font-bold select-none shrink-0 ${
            running && interactiveActive ? 'text-emerald-400' : venvExists ? 'text-emerald-400' : 'text-[#00FFC6]'
          }`}
        >
          {promptPrefix}
        </span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={running && !interactiveActive}
          placeholder={
            running && interactiveActive
              ? 'Program is waiting — type input (e.g. 1) and press Enter, or Ctrl+C to stop...'
              : 'Type command (pip install, python main.py, cd, git status, ls)...'
          }
          className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={(running && !interactiveActive) || (!running && !commandInput.trim())}
          className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40 ${
            running && interactiveActive
              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-300'
              : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/30 text-cyan-300'
          }`}
        >
          <span>{running && interactiveActive ? 'Send' : 'Run'}</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
