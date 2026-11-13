import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicAPI } from '../../services/api';
import { ProjectCard } from '../../components/project/ProjectCard';
import { AIBlueprintModal } from '../../components/ai/AIBlueprintModal';
import {
  Search,
  ArrowRight,
  Compass,
  Code2,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Loader2,
  Clock,
  Bot,
  Lock,
} from 'lucide-react';

// In-memory instant cache for blazing fast navigation
let homeDataCache = null;

export const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState(homeDataCache?.featured || []);
  const [latestProjects, setLatestProjects] = useState(homeDataCache?.latest || []);
  const [categories, setCategories] = useState(homeDataCache?.categories || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(!homeDataCache);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [selectedStackFilter, setSelectedStackFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        if (!homeDataCache) setLoading(true);
        const [featuredRes, latestRes, catsRes] = await Promise.all([
          publicAPI.getFeaturedProducts().catch(() => ({ products: [] })),
          publicAPI.getProducts({ limit: 12, sortBy: 'newest' }).catch(() => ({ products: [] })),
          publicAPI.getCategories().catch(() => ({ categories: [] })),
        ]);

        const featured = featuredRes.products || [];
        const latest = latestRes.products || [];
        const cats = catsRes.categories || [];

        setFeaturedProjects(featured);
        setLatestProjects(latest);
        setCategories(cats);

        // Save to in-memory fast cache
        homeDataCache = { featured, latest, categories: cats };
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/projects');
    }
  };

  const stackPills = [
    { label: 'All Architectures', value: 'ALL' },
    { label: 'PostgreSQL & Prisma', value: 'PostgreSQL' },
    { label: 'React & Vite', value: 'React' },
    { label: 'Node.js Express', value: 'Node.js' },
    { label: 'ERP & Business', value: 'ERP' },
    { label: 'Billing & Invoicing', value: 'Billing' },
  ];

  // Combine latest uploaded projects and featured templates so every newly created project immediately appears
  const allShowcaseProjects = React.useMemo(() => {
    const projectMap = new Map();
    // Prioritize latest additions first so newly uploaded or modified project templates appear right up front
    [...latestProjects, ...featuredProjects].forEach((p) => {
      if (p && p.id && !projectMap.has(p.id)) {
        projectMap.set(p.id, p);
      }
    });
    return Array.from(projectMap.values());
  }, [latestProjects, featuredProjects]);

  const filteredFeatured = selectedStackFilter === 'ALL'
    ? allShowcaseProjects
    : allShowcaseProjects.filter((p) => {
        const matchesCategory = p.category?.name?.toLowerCase().includes(selectedStackFilter.toLowerCase());
        const matchesTech = p.technologies?.some((t) => t.name?.toLowerCase().includes(selectedStackFilter.toLowerCase()));
        const matchesTitle = p.title?.toLowerCase().includes(selectedStackFilter.toLowerCase());
        return matchesCategory || matchesTech || matchesTitle;
      });

  return (
    <div className="space-y-20 pb-20 overflow-hidden text-[#E2E8F0] relative">
      {/* 1. LIGHTHOUSE AURORA HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-20 bg-grid-pattern overflow-hidden">
        {/* Lightweight Lighthouse Beacon */}
        <div className="lighthouse-beam" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Clean Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#140F28] border border-[#C084FC]/30 shadow-md text-xs font-medium mb-6 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-[#C084FC]">Ready-to-Use Software Projects & Templates</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto mb-5">
            Your Projects.{' '}
            <span className="text-gradient-cyan">
              Your Possibilities.
            </span>
          </h1>

          {/* Supporting Tagline */}
          <p className="text-sm sm:text-base md:text-lg text-[#C0C7D1]/80 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Discover ready-to-deploy web apps, SaaS templates, and full source code projects with instant live previews.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mb-6 relative flex items-center shadow-xl rounded-2xl bg-[#0E0A1C] border border-[#322659] focus-within:border-[#C084FC] p-1.5 transition duration-200"
          >
            <div className="pl-4 text-[#9333EA]">
              <Search className="w-5 h-5 text-[#C084FC]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects (e.g. Billing, CRM, React, ERP, Portfolio)..."
              className="w-full px-3 py-2.5 text-xs sm:text-sm text-[#E2E8F0] placeholder-slate-500 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9333EA] via-[#C084FC] to-[#C084FC] text-white font-extrabold text-xs uppercase tracking-wider transition hover:brightness-110 shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/projects"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Browse All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setBlueprintModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#140F28] hover:bg-[#1C1636] text-white font-bold text-xs uppercase tracking-wider border border-[#322659] hover:border-[#C084FC] transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#C084FC]" />
              <span>AI Project Finder</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#322659]/60">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C084FC] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Top Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Featured Projects
            </h2>
          </div>

          {/* Interactive Stack Selector Pills */}
          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-1.5">
            {stackPills.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setSelectedStackFilter(pill.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition duration-150 cursor-pointer ${
                  selectedStackFilter === pill.value
                    ? 'bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white font-bold shadow-sm'
                    : 'bg-[#140F28] border border-[#322659]/70 text-[#C0C7D1] hover:text-white hover:border-[#C084FC]/50'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#C084FC]" />
          </div>
        ) : (filteredFeatured || []).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(filteredFeatured || []).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#140F28] rounded-2xl border border-[#322659] p-8">
            <p className="text-slate-400">No projects found matching the selected filter.</p>
          </div>
        )}
      </section>

      {/* 4. WHY CODERHARBOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C084FC] mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Why Choose CoderHarbor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Built for Fast & Easy Delivery
          </h2>
          <p className="text-xs sm:text-sm text-[#C0C7D1]">
            Clean, verified, and production-ready codebases with instant live previews and complete documentation.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 p-7 rounded-2xl bg-[#140F28] border border-[#322659]/80 hover:border-[#C084FC]/50 transition duration-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/30 flex items-center justify-center mb-5">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Smart AI Project Finder
              </h3>
              <p className="text-xs text-[#C0C7D1]/80 leading-relaxed mb-5">
                Describe what you need in plain language, and our AI assistant instantly matches you with the right template or full-stack project.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#0A0713] border border-[#322659]/60 flex items-center justify-between text-xs text-[#C084FC]">
              <span>Instant Requirement Matching</span>
              <span className="font-bold">AI Assistant</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#140F28] border border-[#322659]/80 hover:border-[#9333EA]/50 transition duration-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#9333EA]/15 text-[#9333EA] border border-[#9333EA]/30 flex items-center justify-center mb-5">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Verified Source Code
              </h3>
              <p className="text-xs text-[#C0C7D1]/80 leading-relaxed">
                Every ZIP archive is checked and securely stored so you get clean, ready-to-run source files every time.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#322659]/60 text-[11px] font-medium text-[#C084FC]">
              ✓ Safe & Verified Downloads
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#140F28] border border-[#322659]/80 hover:border-[#C084FC]/50 transition duration-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/30 flex items-center justify-center mb-5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Instant Live Previews
              </h3>
              <p className="text-xs text-[#C0C7D1]/80 leading-relaxed">
                Explore interactive demos and inspect project file structures directly in your browser before downloading.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#322659]/60 text-[11px] font-medium text-[#C084FC]">
              ⚡ Try Before You Download
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROJECT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9333EA] mb-2">
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Browse by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#C0C7D1]">
            Find ready-made solutions for your business, from billing software and SaaS apps to mobile templates.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(categories || []).map((cat) => (
            <Link
              key={cat.id}
              to={`/projects?category=${cat.slug}`}
              className="group p-5 rounded-xl bg-[#140F28] border border-[#322659]/70 hover:border-[#C084FC]/60 shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#0A0713] border border-[#322659] text-[#C084FC] flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-[#9333EA] group-hover:text-white transition">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-[#C084FC] transition mb-1 line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description || 'Explore projects in this category'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#322659]/60 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span className="text-[#C084FC]">{cat.productCount ?? 0} projects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:text-[#C084FC] transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. LATEST PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#322659]/60">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C084FC] mb-2">
              <Clock className="w-4 h-4" />
              <span>Recently Added</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Latest Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C084FC] hover:underline transition group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#C084FC]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(latestProjects || []).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-8 sm:p-12 border border-[#C084FC]/40 text-center bg-gradient-to-r from-[#140F28] via-[#0E0A1C] to-[#140F28] shadow-xl">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Launch Your Next Project?
            </h2>
            <p className="text-[#C0C7D1] text-xs sm:text-sm leading-relaxed">
              Browse our collection of ready-to-use SaaS applications, business tools, and website templates.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/projects"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#9333EA] via-[#C084FC] to-[#C084FC] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition flex items-center gap-2"
              >
                <span>Explore All Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Blueprint Generator Modal */}
      <AIBlueprintModal
        isOpen={blueprintModalOpen}
        onClose={() => setBlueprintModalOpen(false)}
      />
    </div>
  );
};
