import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../services/api';
import { Layers, ArrowRight, Code2, Loader2, Sparkles } from 'lucide-react';

export const ProjectCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicAPI.getCategories();
        if (res.categories) setCategories(res.categories);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#E2E8F0]">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#00FFC6] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Industry Verticals</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Software Project Categories
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]">
          Explore specialized software verticals. Each category houses full applications, enterprise architectures, and developer boilerplate kits ready for deployment.
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00FFC6]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/projects?category=${cat.slug}`}
              className="group p-6 rounded-3xl bg-[#131B2E]/90 border border-[#334155]/70 hover:border-[#22D3EE]/60 shadow-harbor-sm hover:shadow-harbor-md transition-all duration-300 flex flex-col justify-between backdrop-blur-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0F172A] border border-[#334155] text-[#22D3EE] flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-[#0EA5E9] group-hover:text-[#0B0F1A] transition">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-[#22D3EE] transition mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {cat.description || 'Enterprise architecture and production-grade software frameworks.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#334155]/60 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#00FFC6] bg-[#00FFC6]/10 px-2.5 py-1 rounded-full text-[10px] font-mono border border-[#00FFC6]/20">
                  {cat.productCount ?? 0} {cat.productCount === 1 ? 'Project' : 'Projects'} Available
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-[#22D3EE] transition text-xs font-bold">
                  <span>Browse Vertical</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
