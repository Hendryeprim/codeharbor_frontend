import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, Loader2 } from 'lucide-react';
import { ComingSoonBadge, FreeBadge, ProductTypeBadge } from '../common/Badge';
import { LivePreviewModal } from '../common/LivePreviewModal';

export const ProjectCard = ({ project }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const isDownloadFree = Boolean(project.isFree);
  const downloadPrice = Number(project.price || 0);
  const isFree = isDownloadFree || downloadPrice === 0;
  const formattedDownloadPrice = isFree ? 'Free' : `₹${downloadPrice.toFixed(2)}`;

  const isViewFree = Boolean(project.isViewFree ?? true);
  const viewPrice = Number(project.viewPrice || 0);
  const formattedViewPrice = isViewFree || viewPrice === 0 ? 'Free' : `₹${viewPrice.toFixed(2)}`;
  const projectCode = `CH-${String(project.id).padStart(3, '0')}`;

  // Optimize thumbnail URL for high-speed delivery
  const rawThumbnail = project.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=75';
  const optimizedThumbnail = rawThumbnail.includes('unsplash.com') && !rawThumbnail.includes('w=400')
    ? `${rawThumbnail}&w=400&q=75&auto=format`
    : rawThumbnail;

  return (
    <div className="vessel-card group flex flex-col h-full bg-[#140F28] border border-[#322659]/80 hover:border-[#A855F7]/80 rounded-2xl overflow-hidden transition-all duration-200">
      {/* Top Terminal Header Bar */}
      <div className="px-4 py-2 bg-[#0A0713] border-b border-[#322659]/70 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-slate-400 font-semibold">{projectCode}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-[#C084FC] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA]" />
            Verified
          </span>
        </div>
      </div>

      {/* Fast Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0713]">
        <img
          src={optimizedThumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#140F28] via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges Row (Left: Pricing/ComingSoon, Right: Featured) - No overlapping! */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            {isFree ? <FreeBadge /> : <ComingSoonBadge />}
          </div>

          {project.isFeatured && (
            <div className="bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md shrink-0 pointer-events-auto">
              ★ Featured
            </div>
          )}
        </div>

        {/* Bottom Badges Row (Left: Category, Right: Live Preview / AI Ready) */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          {project.category && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0A0713]/95 text-white border border-[#322659] pointer-events-auto max-w-[130px] truncate shadow-sm">
              {project.category.name}
            </span>
          )}

          {project.previewStatus === 'READY' && project.previewUrl ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPreviewOpen(true);
              }}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black bg-gradient-to-r from-[#9333EA] to-[#7C3AED] text-white hover:brightness-110 shadow-purple-glow transition transform hover:scale-105 shrink-0 ml-auto cursor-pointer"
              title="Launch Instant Live Preview"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>⚡ Live Preview</span>
            </button>
          ) : project.previewStatus === 'BUILDING' ? (
            <span className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 ml-auto">
              <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
              <span>Building Preview</span>
            </span>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0A0713]/95 border border-[#322659] text-[#C084FC] text-[10px] font-mono font-bold shadow-sm shrink-0 pointer-events-auto ml-auto">
              <Sparkles className="w-3 h-3 text-[#A855F7]" />
              <span className="text-white">AI Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
        <div>
          <div className="mb-2">
            <ProductTypeBadge type={project.productType} />
          </div>

          <h3 className="font-extrabold text-base text-white group-hover:text-[#C084FC] transition line-clamp-1 mb-2">
            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Technology Stack Tags */}
          {Array.isArray(project.technologies) && project.technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-5">
              {project.technologies.filter(Boolean).slice(0, 4).map((tech) => (
                <span
                  key={tech.id || tech.name}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-200 bg-[#0A0713] border border-[#322659]"
                >
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-[10px] text-slate-400 font-mono">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer info: Dual Price & Action */}
        <div className="pt-3 border-t border-[#322659]/70 flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              Pricing Details
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-[#C084FC] font-bold" title="Price to view / live preview">
                View: {formattedViewPrice}
              </span>
              <span className="text-slate-500 font-bold">/</span>
              <span className={isDownloadFree || downloadPrice === 0 ? 'text-[#C084FC] font-bold' : 'text-white font-bold'} title="Price to download full code">
                Code: {formattedDownloadPrice}
              </span>
            </div>
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#9333EA] to-[#7C3AED] hover:brightness-110 shadow-purple-glow transition duration-200"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Responsive Live Preview Modal */}
      {project.previewUrl && (
        <LivePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          previewUrl={project.previewUrl}
          projectTitle={project.title}
        />
      )}
    </div>
  );
};
