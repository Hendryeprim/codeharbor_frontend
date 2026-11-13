import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { ComingSoonBadge, FreeBadge } from '../common/Badge';
import { LivePreviewModal } from '../common/LivePreviewModal';
import { getFullImageUrl } from '../../services/api';

export const ProjectCard = ({ project }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const isDownloadFree = Boolean(project.isFree);
  const downloadPrice = Number(project.price || 0);
  const isFree = isDownloadFree || downloadPrice === 0;
  const formattedDownloadPrice = isFree ? 'Free' : `₹${downloadPrice.toFixed(2)}`;

  // Optimize thumbnail URL for high-speed delivery
  const rawThumbnail = getFullImageUrl(project.thumbnail);
  const optimizedThumbnail = rawThumbnail.includes('unsplash.com') && !rawThumbnail.includes('w=400')
    ? `${rawThumbnail}&w=400&q=75&auto=format`
    : rawThumbnail;

  return (
    <div className="vessel-card group flex flex-col h-full bg-[#140F28] border border-[#322659]/80 hover:border-[#A855F7]/80 rounded-2xl overflow-hidden transition-all duration-200 shadow-lg">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0713]">
        <img
          src={optimizedThumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-95 group-hover:opacity-100"
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#140F28] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges Row */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            {isFree ? <FreeBadge /> : <ComingSoonBadge />}
          </div>

          {project.isFeatured && (
            <div className="bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md shrink-0 pointer-events-auto">
              ★ Featured
            </div>
          )}
        </div>

        {/* Bottom Badges Row */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          {project.category && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0A0713]/90 text-white border border-[#322659] pointer-events-auto max-w-[140px] truncate shadow-sm">
              {project.category.name}
            </span>
          )}

          {project.previewStatus === 'READY' && project.previewUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPreviewOpen(true);
              }}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-[#9333EA] to-[#7C3AED] text-white hover:brightness-110 shadow-purple-glow transition transform hover:scale-105 shrink-0 ml-auto cursor-pointer"
              title="Open Live Preview"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Live Preview</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-[#C084FC] transition line-clamp-1 mb-1.5">
            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Technology Stack Tags */}
          {Array.isArray(project.technologies) && project.technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              {project.technologies.filter(Boolean).slice(0, 3).map((tech) => (
                <span
                  key={tech.id || tech.name}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-200 bg-[#0A0713] border border-[#322659]"
                >
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="text-[10px] text-slate-400">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer info: Clear Price & Action */}
        <div className="pt-3 border-t border-[#322659]/70 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Download:</span>
            <span className={isFree ? 'text-emerald-400 font-bold' : 'text-white font-bold'}>
              {formattedDownloadPrice}
            </span>
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#9333EA] to-[#7C3AED] hover:brightness-110 transition duration-200"
          >
            <span>View Details</span>
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
