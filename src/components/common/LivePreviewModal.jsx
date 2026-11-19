import React, { useState, useEffect, useRef } from 'react';
import { getFullPreviewUrl, employeeAPI, adminAPI } from '../../services/api';
import {
  X,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  RotateCcw,
  Maximize2,
  Minimize2,
  Loader2,
  Play,
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const LivePreviewModal = ({ isOpen, onClose, previewUrl, projectTitle, versionId: propVersionId }) => {
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [execution, setExecution] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const terminalEndRef = useRef(null);

  // Extract version ID from prop or preview URL
  const versionId =
    propVersionId ||
    (previewUrl ? (previewUrl.match(/(?:managed-|proxy\/|previews\/)([a-f0-9\-]+)/i) || [])[1] : null);

  const effectivePreviewUrl = execution?.version?.liveDemoUrl || previewUrl;
  const safePreviewUrl = getFullPreviewUrl(effectivePreviewUrl);

  // Fetch real-time execution logs & status from backend
  useEffect(() => {
    if (!isOpen || !versionId) return;

    let isMounted = true;
    const fetchExecution = async () => {
      try {
        let res = null;
        try {
          res = await employeeAPI.getSubmissionExecution(versionId);
        } catch (e) {
          res = await adminAPI.getProjectExecution(versionId);
        }

        if (isMounted && res && res.success && res.execution) {
          setExecution(res.execution);
          if (res.execution.status === 'RUNNING') {
            setIsRunning(true);
          } else {
            setIsRunning(false);
          }
        }
      } catch (err) {}
    };

    fetchExecution();
    const pollInterval = setInterval(fetchExecution, 2000);
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [isOpen, versionId, iframeKey]);

  // Auto-scroll terminal
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [execution?.consoleLogs, autoScroll]);

  if (!isOpen) return null;

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px] max-w-full';
      case 'tablet':
        return 'w-[768px] max-w-full';
      default:
        return 'w-full';
    }
  };

  const reloadIframe = () => {
    setLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleRerunProject = async () => {
    if (isRunning || !versionId) return;
    setIsRunning(true);
    try {
      let res = null;
      try {
        res = await employeeAPI.rerunSubmissionExecution(versionId);
      } catch (e) {
        res = await adminAPI.rerunExecution(versionId);
      }
      if (res && res.execution) {
        setExecution(res.execution);
      }
      reloadIframe();
    } catch (err) {
      console.error('[LivePreviewModal] Re-run failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyLogs = () => {
    if (!execution?.consoleLogs) return;
    navigator.clipboard.writeText(execution.consoleLogs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderLogLine = (line, idx) => {
    const trimmed = line.trim();
    let colorClass = 'text-slate-300';

    if (trimmed.startsWith('$') || trimmed.startsWith('>') || trimmed.startsWith('runner:~$')) {
      colorClass = 'text-cyan-400 font-semibold';
    } else if (trimmed.startsWith('✓') || trimmed.includes('successful') || trimmed.includes('SUCCESS') || trimmed.includes('Ready')) {
      colorClass = 'text-emerald-400 font-medium';
    } else if (
      trimmed.startsWith('ERROR:') ||
      trimmed.startsWith('fatal:') ||
      trimmed.startsWith('Error:') ||
      trimmed.includes('FAILED') ||
      trimmed.includes('Module not found')
    ) {
      colorClass = 'text-rose-400 font-medium';
    } else if (trimmed.startsWith('[') && trimmed.includes(']')) {
      colorClass = 'text-purple-300/80';
    }

    return (
      <div key={idx} className={`leading-relaxed whitespace-pre-wrap break-all ${colorClass}`}>
        {line}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#070A12]/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`bg-[#0E0A1C] border border-[#322659] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          fullscreen ? 'fixed inset-2 z-50' : 'w-full max-w-7xl h-[94vh]'
        }`}
      >
        {/* Top Browser Chrome / Navigation Bar */}
        <div className="bg-[#140F28] border-b border-[#322659]/80 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          {/* Traffic Lights & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-rose-500/90 hover:bg-rose-500 transition cursor-pointer shadow-sm"
                title="Close Preview"
              />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500/70" />
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 hover:bg-emerald-500 transition cursor-pointer shadow-sm"
                title="Toggle Fullscreen"
              />
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-xs sm:text-sm text-white truncate">
                {projectTitle || 'Actual Project Output'}
              </span>

              {isRunning ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  BUILDING & RUNNING...
                </span>
              ) : execution?.buildStatus === 'FAILED' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 shrink-0 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  BUILD ERROR
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTUAL PROJECT UI
                </span>
              )}
            </div>
          </div>

          {/* Center: Device Switcher (Desktop | Tablet | Mobile) */}
          <div className="flex items-center gap-1 bg-[#0A0713] p-1 rounded-xl border border-[#322659]/60">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                device === 'desktop'
                  ? 'bg-[#A855F7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                device === 'tablet'
                  ? 'bg-[#A855F7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                device === 'mobile'
                  ? 'bg-[#A855F7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Mobile</span>
            </button>
          </div>

          {/* Right Action Controls: Re-Run, Reload, Open in Tab, Fullscreen, Close */}
          <div className="flex items-center gap-2 shrink-0">
            {versionId && (
              <button
                type="button"
                onClick={handleRerunProject}
                disabled={isRunning}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-1.5 transition disabled:opacity-50"
                title="Re-run exact project in isolated sandbox"
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <Play className="w-3 h-3 fill-emerald-400" />
                )}
                <span>{isRunning ? 'Running...' : 'Re-Run Project'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={reloadIframe}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C1636] transition"
              title="Reload Preview Frame"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {safePreviewUrl && (
              <a
                href={safePreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#1C1636] hover:bg-[#322659] border border-[#322659] text-xs font-bold text-[#C084FC] flex items-center gap-1.5 transition"
                title="Open exact project UI in new browser tab"
              >
                <span className="hidden sm:inline">Open in Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setFullscreen(!fullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C1636] transition hidden sm:inline-flex"
              title="Toggle Fullscreen"
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#1C1636] transition"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: TOP = ACTUAL PROJECT UI (58%) | BOTTOM = REAL TERMINAL LOGS (42%) */}
        <div className="flex-1 bg-[#070A12] flex flex-col overflow-hidden relative">
          {/* TOP AREA: Actual Project UI */}
          <div className="h-[58%] border-b border-[#322659]/80 flex items-center justify-center p-2 sm:p-3 overflow-hidden relative bg-[#070A12]">
            {loading && isRunning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0A0713]/90 backdrop-blur-sm z-10 text-[#C084FC]">
                <Loader2 className="w-8 h-8 animate-spin text-[#C084FC]" />
                <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
                  <span>Executing project pipeline... see real-time logs below</span>
                </div>
              </div>
            )}

            <div
              className={`h-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-[#322659] bg-white ${getContainerWidth()}`}
            >
              {safePreviewUrl ? (
                <iframe
                  key={iframeKey}
                  src={safePreviewUrl}
                  title={`Project Preview - ${projectTitle}`}
                  onLoad={() => setLoading(false)}
                  sandbox="allow-scripts allow-forms allow-same-origin allow-modals allow-downloads"
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full bg-[#0E0A1C] flex flex-col items-center justify-center p-6 text-center text-slate-400 font-mono text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400 mb-2" />
                  <span>Waiting for execution worker to start server or build assets...</span>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM AREA: Real Terminal / Error Logs */}
          <div className="h-[42%] flex flex-col bg-[#060814] overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-[#0B0F24] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-mono font-bold text-white tracking-wide">
                  REAL EXECUTION / TERMINAL LOGS
                </span>
                {isRunning && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Executing...
                  </span>
                )}
                {execution?.buildStatus && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      execution.buildStatus === 'SUCCESS' || execution.buildStatus === 'PASSED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    Build: {execution.buildStatus}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                    autoScroll
                      ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Toggle auto-scroll to latest log output"
                >
                  Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={handleCopyLogs}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1 transition"
                  title="Copy full terminal output"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-3.5 overflow-auto font-mono text-xs select-text bg-[#060814]">
              {execution?.consoleLogs ? (
                execution.consoleLogs.split('\n').map((line, idx) => renderLogLine(line, idx))
              ) : (
                <div className="text-slate-500 italic py-4">
                  [Waiting for project execution logs...]
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* Footer Security / Status Note */}
        <div className="bg-[#140F28] border-t border-[#322659]/60 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Actual Submitted Project UI • Isolated Container Runtime</span>
          </div>
          <span className="font-mono text-slate-500 truncate max-w-md hidden sm:inline">
            {safePreviewUrl || 'Initializing...'}
          </span>
        </div>
      </div>
    </div>
  );
};
