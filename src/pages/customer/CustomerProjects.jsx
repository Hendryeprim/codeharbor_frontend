import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI, publicAPI, getFullImageUrl } from '../../services/api';
import { ProjectCard } from '../../components/project/ProjectCard';
import {
  FolderCode,
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
  ShoppingBag,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const CustomerProjects = () => {
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'my-projects'
  const [myProjects, setMyProjects] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [myRes, allRes] = await Promise.all([
          customerAPI.getMyProjects().catch(() => ({ projects: [] })),
          publicAPI.getProducts({ limit: 20 }).catch(() => ({ products: [] })),
        ]);
        if (myRes.projects) setMyProjects(myRes.projects);
        if (allRes.products) setAllTemplates(allRes.products);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Project Templates & Workspace
          </h1>
          <p className="text-xs text-[#C0C7D1] mt-1">
            Browse software blueprints, test live previews, and inspect specifications.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#140F28] border border-[#322659]/70 shrink-0">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'marketplace'
                ? 'bg-gradient-to-r from-[#0EA5E9] to-[#C084FC] text-white shadow-purple-glow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Project Templates ({allTemplates.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'my-projects'
                ? 'bg-gradient-to-r from-[#0EA5E9] to-[#C084FC] text-white shadow-purple-glow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FolderCode className="w-3.5 h-3.5" />
            <span>My Codebases ({myProjects.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C084FC]" />
        </div>
      ) : activeTab === 'marketplace' ? (
        /* Marketplace Templates Grid */
        <div>
          {(allTemplates || []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(allTemplates || []).map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="bg-[#140F28] rounded-3xl p-12 text-center border border-[#322659] max-w-md mx-auto">
              <Layers className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">No Templates Found</h3>
              <p className="text-xs text-slate-400">Check back soon for new project releases.</p>
            </div>
          )}
        </div>
      ) : (
        /* My Downloaded Projects Tab */
        <div>
          {(myProjects || []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(myProjects || []).map((p) => {
                const hasDownloadable = p.files && p.files.length > 0;
                return (
                  <div
                    key={p.id}
                    className="bg-[#140F28]/90 rounded-3xl p-6 border border-[#322659]/80 shadow-harbor-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={getFullImageUrl(p.thumbnail)}
                          alt={p.title}
                          className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#322659]"
                        />
                        <div>
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#C084FC] bg-[#C084FC]/10 px-2 py-0.5 rounded border border-[#C084FC]/30">
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
                      {Array.isArray(p.technologies) && p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.technologies.filter(Boolean).slice(0, 3).map((t) => (
                            <span
                              key={t.id || t.name}
                              className="px-2 py-0.5 text-[10px] font-mono bg-[#0E0A1C] rounded border border-[#322659] text-slate-300"
                            >
                              {t.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#322659]/60 flex items-center justify-between gap-3">
                      <Link
                        to={`/projects/${p.slug}`}
                        className="text-xs font-semibold text-[#A855F7] hover:text-[#C084FC] flex items-center gap-1"
                      >
                        <span>Inspect Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {hasDownloadable && (
                        <button
                          onClick={() => handleDownload(p)}
                          disabled={downloadingId === p.id}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#C084FC] text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-purple-glow hover:brightness-110"
                        >
                          {downloadingId === p.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Downloading...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download ZIP</span>
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
            <div className="bg-[#140F28] rounded-3xl p-12 text-center border border-[#322659] max-w-md mx-auto">
              <FolderCode className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">No Acquired Projects Yet</h3>
              <p className="text-xs text-slate-400 mb-5">
                Browse our full catalogue of developer templates and software packages.
              </p>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#C084FC] text-white text-xs font-bold uppercase tracking-wider"
              >
                Browse Project Templates
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
