import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../../services/api';
import { FolderCode, Download, ExternalLink, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export const CustomerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await customerAPI.getMyProjects();
        if (res.projects) setProjects(res.projects);
      } catch (err) {
        console.error('Failed to load customer projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDownload = async (project) => {
    const file = project.files?.[0];
    if (!file) {
      alert('No downloadable file attached.');
      return;
    }

    try {
      setDownloadingId(project.id);
      await customerAPI.downloadFreeFile(file.id, file.originalName);
    } catch (err) {
      alert(err.message || 'Download failed');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 text-[#E2E8F0]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          My Authorized Projects
        </h1>
        <p className="text-xs text-[#C0C7D1] mt-1">
          Review software codebases you are permitted to download and deploy.
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00FFC6]" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => {
            const hasDownloadable = p.files && p.files.length > 0;
            return (
              <div
                key={p.id}
                className="bg-[#131B2E]/90 rounded-3xl p-6 border border-[#334155]/80 shadow-harbor-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={p.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80'}
                      alt={p.title}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#334155]"
                    />
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#00FFC6] bg-[#00FFC6]/10 px-2 py-0.5 rounded border border-[#00FFC6]/30">
                        {p.accessType === 'DOWNLOADED' ? 'Downloaded' : 'Free Access'}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-[11px] text-slate-400">{p.category?.name}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#C0C7D1] line-clamp-2 leading-relaxed mb-4">
                    {p.shortDescription}
                  </p>

                  {/* Tech stack */}
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.technologies.slice(0, 3).map((t) => (
                        <span key={t.id} className="px-2 py-0.5 text-[10px] font-mono bg-[#0F172A] rounded border border-[#334155] text-slate-300">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#334155]/60 flex items-center justify-between gap-3">
                  <Link
                    to={`/projects/${p.slug}`}
                    className="text-xs font-semibold text-[#22D3EE] hover:text-[#00FFC6] flex items-center gap-1"
                  >
                    <span>Inspect Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  {hasDownloadable && (
                    <button
                      onClick={() => handleDownload(p)}
                      disabled={downloadingId === p.id}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs transition flex items-center gap-1.5 shadow-neon-glow hover:brightness-110"
                    >
                      {downloadingId === p.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Package</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#131B2E] rounded-3xl p-12 text-center border border-[#334155] max-w-md mx-auto">
          <FolderCode className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">No Projects Accessible Yet</h3>
          <p className="text-xs text-slate-400 mb-5">
            Explore free developer starter templates in the marketplace to get started.
          </p>
          <Link
            to="/projects?isFree=true"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] text-xs font-bold uppercase tracking-wider"
          >
            Explore Free Templates
          </Link>
        </div>
      )}
    </div>
  );
};
