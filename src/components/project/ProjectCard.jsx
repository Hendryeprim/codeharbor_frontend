import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ComingSoonBadge, FreeBadge, ProductTypeBadge } from '../common/Badge';

export const ProjectCard = ({ project }) => {
  const isFree = Boolean(project.isFree);
  const formattedPrice = isFree ? 'Free' : `$${Number(project.price).toFixed(2)}`;
  const projectCode = `CH-${String(project.id).padStart(3, '0')}`;

  // Optimize thumbnail URL for high-speed delivery
  const rawThumbnail = project.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=75';
  const optimizedThumbnail = rawThumbnail.includes('unsplash.com') && !rawThumbnail.includes('w=400')
    ? `${rawThumbnail}&w=400&q=75&auto=format`
    : rawThumbnail;

  return (
    <div className="vessel-card group flex flex-col h-full bg-[#131B2E] border border-[#334155]/70 hover:border-[#22D3EE]/70 rounded-2xl overflow-hidden transition-all duration-200">
      {/* Top Terminal Header Bar */}
      <div className="px-4 py-2 bg-[#0B0F1A] border-b border-[#334155]/60 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-slate-400 font-semibold">{projectCode}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-[#00FFC6] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFC6]" />
            Verified
          </span>
        </div>
      </div>

      {/* Fast Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0E17]">
        <img
          src={optimizedThumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges Row (Left: Pricing/ComingSoon, Right: Featured) - No overlapping! */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            {isFree ? <FreeBadge /> : <ComingSoonBadge />}
          </div>

          {project.isFeatured && (
            <div className="bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md shrink-0 pointer-events-auto">
              ★ Featured
            </div>
          )}
        </div>

        {/* Bottom Badges Row (Left: Category, Right: AI Ready) - Fully separated! */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          {project.category && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B0F1A]/95 text-[#22D3EE] border border-[#22D3EE]/30 pointer-events-auto max-w-[140px] truncate shadow-sm">
              {project.category.name}
            </span>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B0F1A]/95 border border-[#00FFC6]/40 text-[#00FFC6] text-[10px] font-mono font-bold shadow-sm shrink-0 pointer-events-auto ml-auto">
            <Sparkles className="w-3 h-3 text-[#00FFC6]" />
            <span>AI Ready</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
        <div>
          <div className="mb-2">
            <ProductTypeBadge type={project.productType} />
          </div>

          <h3 className="font-extrabold text-base text-[#E2E8F0] group-hover:text-[#22D3EE] transition line-clamp-1 mb-2">
            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>

          <p className="text-xs text-[#C0C7D1]/80 line-clamp-2 mb-4 leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Technology Stack Tags */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech.id || tech.name}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono text-[#E2E8F0] bg-[#0B0F1A] border border-[#334155]"
                >
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-[10px] text-slate-500 font-mono">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer info: Price & Action */}
        <div className="pt-4 border-t border-[#334155]/60 flex items-center justify-between mt-auto">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#C0C7D1]/60 tracking-wider">Pricing</div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-extrabold font-mono ${isFree ? 'text-[#00FFC6]' : 'text-white'}`}>
                {formattedPrice}
              </span>
              {!isFree && (
                <span className="text-[9px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Coming Soon
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0B0F1A] bg-gradient-to-r from-[#0EA5E9] via-[#22D3EE] to-[#00FFC6] hover:brightness-110 transition duration-200"
          >
            <span>Inspect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
