import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft, Cpu, Square } from 'lucide-react';
import { detectLanguageInfo, resolveTerminalCommand } from '../../utils/languageDetect';

export const InteractiveTerminal = ({
  files = [],
  activeFile = '',
  skillSlug = 'python',
  running = false,
  interactiveActive = false,
  executionResult = null,
  onRunFile,
  onSendInput,
  onStopProcess,
  onClearOutput,
  onShowInfo,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const outputRef = useRef(null);

  const langInfo = detectLanguageInfo(activeFile, skillSlug);
  const displayLang = executionResult?.detectedLanguage || langInfo.label;

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [executionResult?.stdout, executionResult?.stderr, running]);

  const handleSubmitCommand = (e) => {
    e.preventDefault();
    const raw = commandInput;
    const cmd = raw.trim();

    // If an interactive program is currently running, send raw input directly to stdin!
    if (running && interactiveActive) {
      setCommandInput('');
      onSendInput?.(raw);
      return;
    }

    if (!cmd || running) return;

    setHistory((prev) => [cmd, ...prev.slice(0, 29)]);
    setHistoryIdx(-1);
    setCommandInput('');

    const parsed = resolveTerminalCommand(cmd, files);
    if (parsed.type === 'clear') {
      onClearOutput?.();
      return;
    }

    if (parsed.type === 'ls') {
      const list = files.map((f) => f.path || f.filename).join('\n');
      onShowInfo?.(`$ ${cmd}\n${list || '(No files in workspace)'}`);
      return;
    }

    if (parsed.type === 'run' && parsed.file) {
      const targetPath = parsed.file.path || parsed.file.filename;
      onRunFile?.(targetPath, cmd);
      return;
    }

    if (parsed.type === 'not_found') {
      const available = files
        .slice(0, 12)
        .map((f) => f.path || f.filename)
        .join(', ');
      onShowInfo?.(
        `$ ${cmd}\nFile not found: "${parsed.target}".\nAvailable files: ${available || 'none'}`,
        true
      );
    }
  };

  const handleKeyDown = (e) => {
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

  return (
    <div className="rounded-3xl bg-[#070A12] border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#0F172A] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono font-bold text-slate-300">
            Terminal / Execution Output
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${langInfo.badgeClass}`}
            title="Auto-detected language"
          >
            <Cpu className="w-3 h-3" />
            <span>{displayLang}</span>
          </span>
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
              <span>Stop</span>
            </button>
          )}
          {executionResult && (
            <>
              {executionResult.command && (
                <span className="text-cyan-400/80 hidden sm:inline">$ {executionResult.command}</span>
              )}
              {!running && (
                <>
                  <span className="text-slate-400">{executionResult.executionTimeMs ?? 0}ms</span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold ${
                      executionResult.success
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    exit {executionResult.exitCode ?? 0}
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Output Area */}
      <div ref={outputRef} className="p-4 min-h-[160px] max-h-[280px] overflow-y-auto font-mono text-xs">
        {executionResult ? (
          <div className="space-y-1.5">
            {executionResult.command && (
              <div className="text-slate-500 text-[11px]">$ {executionResult.command}</div>
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
                  {interactiveActive ? 'Waiting for your input below...' : 'Executing...'}
                </span>
              </div>
            )}
          </div>
        ) : running ? (
          <div className="flex items-center gap-2 text-cyan-400">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Starting {activeFile || 'program'} ({langInfo.label}) in secure container...</span>
          </div>
        ) : (
          <p className="text-slate-600 italic">
            Type a filename below (e.g. <span className="text-slate-400">{activeFile || 'main.py'}</span> or <span className="text-slate-400">ls</span>) and press Enter, or click &quot;Run Code&quot;.
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
          className={`text-xs font-mono font-bold select-none ${
            running && interactiveActive ? 'text-emerald-400' : 'text-[#00FFC6]'
          }`}
        >
          {running && interactiveActive ? 'stdin >' : '$'}
        </span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={running && !interactiveActive}
          placeholder={
            running && interactiveActive
              ? 'Program is waiting — type your input (e.g. 1) and press Enter...'
              : `Type filename to run (e.g. ${activeFile || 'main.py'}) or ls / clear...`
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
