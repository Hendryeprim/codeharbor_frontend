import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  RotateCcw,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const LivePreviewModal = ({ isOpen, onClose, previewUrl, projectTitle }) => {
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  if (!isOpen || !previewUrl) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#070A12]/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`bg-[#0E0A1C] border border-[#322659] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          fullscreen ? 'fixed inset-2' : 'w-full max-w-6xl h-[88vh]'
        }`}
      >
        {/* Browser Top Chrome / Toolbar */}
        <div className="bg-[#140F28] border-b border-[#322659]/80 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition cursor-pointer"
              title="Close Preview"
            />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition cursor-pointer"
              title="Toggle Fullscreen"
            />
          </div>

          {/* Project Title & Status Badge */}
          <div className="hidden md:flex items-center gap-2 truncate max-w-xs">
            <span className="font-bold text-xs text-white truncate">{projectTitle || 'Live Project Preview'}</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#C084FC]/10 text-[#C084FC] border border-[#C084FC]/30 shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-ping" />
              LIVE
            </span>
          </div>

          {/* Device Responsive Switcher */}
          <div className="flex items-center gap-1 bg-[#0A0713] p-1 rounded-xl border border-[#322659]/60">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                device === 'desktop'
                  ? 'bg-[#A855F7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                device === 'tablet'
                  ? 'bg-[#A855F7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                device === 'mobile'
                  ? 'bg-[#A855F7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Mobile</span>
            </button>
          </div>

          {/* Actions: Reload, Open New Tab, Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reloadIframe}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C1636] transition"
              title="Reload Preview Frame"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#1C1636] hover:bg-[#322659] border border-[#322659] text-[11px] font-bold text-[#C084FC] flex items-center gap-1.5 transition"
              title="Open full preview in new browser tab"
            >
              <span>Open in Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#1C1636] transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Frame Container */}
        <div className="flex-1 bg-[#070A12] flex items-center justify-center p-2 sm:p-4 overflow-auto relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0A0713]/80 backdrop-blur-sm z-10 text-[#C084FC]">
              <Loader2 className="w-7 h-7 animate-spin text-[#C084FC]" />
              <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>Launching isolated sandbox preview...</span>
              </div>
            </div>
          )}

          <div
            className={`h-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-[#322659] bg-white ${getContainerWidth()}`}
          >
            <iframe
              key={iframeKey}
              src={previewUrl}
              title={`Live Preview - ${projectTitle}`}
              onLoad={() => setLoading(false)}
              sandbox="allow-scripts allow-forms allow-same-origin allow-modals allow-downloads"
              className="w-full h-full border-0"
            />
          </div>
        </div>

        {/* Footer Security Note */}
        <div className="bg-[#140F28] border-t border-[#322659]/60 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C084FC]" />
            <span>Isolated Sandbox Preview • Read-Only Session</span>
          </div>
          <span className="font-mono text-slate-500 truncate max-w-sm hidden sm:inline">
            {previewUrl}
          </span>
        </div>
      </div>
    </div>
  );
};

