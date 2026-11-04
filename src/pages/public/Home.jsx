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
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Loader2,
  Clock,
  Bot,
  Terminal,
  Database,
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
  const [activeConsoleTab, setActiveConsoleTab] = useState('architecture');
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
          {/* Live Harbor HUD Telemetry Ticker */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#140F28] border border-[#C084FC]/30 shadow-md text-xs font-mono mb-6 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
            <span className="font-bold text-[#C084FC]">HARBOR v2.5</span>
            <span className="text-slate-600">/</span>
            <span className="text-[#C0C7D1]">Zero-Trust Software Registry</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-semibold">Purchasing: Coming Soon</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto mb-5">
            Your Projects.{' '}
            <span className="text-gradient-cyan">
              Your Possibilities.
            </span>
          </h1>

          {/* Supporting Tagline & Brand Concept */}
          <p className="text-sm sm:text-base md:text-lg text-[#C0C7D1]/80 max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
            A premium harbor where software projects, cloud SaaS suites, and developer codebases are showcased, inspected by AI, and discovered with complete architectural transparency.
          </p>

          {/* Search & Match Prompt */}
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
              placeholder="Search by keywords, frameworks (React, Node, PostgreSQL, ERP)..."
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
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              to="/projects"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white font-black text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setBlueprintModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#140F28] hover:bg-[#1C1636] text-white font-extrabold text-xs uppercase tracking-wider border border-[#322659] hover:border-[#C084FC] transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#C084FC]" />
              <span>Generate AI Blueprint</span>
            </button>
          </div>

          {/* 2. THE INTERACTIVE HARBOR ARCHITECTURE COCKPIT */}
          <div className="max-w-4xl mx-auto rounded-2xl bg-[#0A0713] border border-[#322659]/80 shadow-xl overflow-hidden text-left">
            {/* Terminal Top Control Bar */}
            <div className="px-5 py-3 bg-[#0E0A1C] border-b border-[#322659]/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 font-mono text-xs text-[#C0C7D1] font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#C084FC]" />
                  harbor-engine // telemetry-cockpit
                </span>
              </div>

              {/* Console Tabs */}
              <div className="flex items-center gap-1.5 bg-[#0A0713] p-1 rounded-xl border border-[#322659]/60">
                <button
                  onClick={() => setActiveConsoleTab('architecture')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                    activeConsoleTab === 'architecture'
                      ? 'bg-[#9333EA] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Architecture.tsx
                </button>
                <button
                  onClick={() => setActiveConsoleTab('schema')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                    activeConsoleTab === 'schema'
                      ? 'bg-[#C084FC] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  schema.prisma
                </button>
                <button
                  onClick={() => setActiveConsoleTab('ai')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                    activeConsoleTab === 'ai'
                      ? 'bg-[#C084FC] text-white font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ✦ AI Health Check
                </button>
              </div>
            </div>

            {/* Console Content Display */}
            <div className="p-5 font-mono text-xs sm:text-sm bg-[#0A0713] min-h-[190px] flex items-center">
              {activeConsoleTab === 'architecture' && (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-[#322659]/40 pb-2">
                    <span className="text-[#C084FC]">// Tier-1 Decoupled Microservice Topology</span>
                    <span className="text-emerald-400 font-bold">● System Status: OPTIMAL</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-[#140F28] border border-[#322659]/70">
                      <div className="text-[10px] text-[#9333EA] font-bold uppercase">Layer 01</div>
                      <div className="font-bold text-[#E2E8F0] mt-0.5">React + Vite SPA</div>
                      <div className="text-[10px] text-slate-400 mt-1">Client Routing & Lucide Icons</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#140F28] border border-[#322659]/70">
                      <div className="text-[10px] text-[#C084FC] font-bold uppercase">Layer 02</div>
                      <div className="font-bold text-[#E2E8F0] mt-0.5">Express.js API Engine</div>
                      <div className="text-[10px] text-slate-400 mt-1">JWT Tokens & Rate Limiter</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#140F28] border border-[#322659]/70">
                      <div className="text-[10px] text-[#C084FC] font-bold uppercase">Layer 03</div>
                      <div className="font-bold text-[#E2E8F0] mt-0.5">PostgreSQL + Prisma</div>
                      <div className="text-[10px] text-slate-400 mt-1">Automated Migration & Vaults</div>
                    </div>
                  </div>
                </div>
              )}

              {activeConsoleTab === 'schema' && (
                <div className="w-full text-slate-300 leading-relaxed text-xs overflow-x-auto">
                  <p><span className="text-[#9333EA]">datasource</span> db {'{'}</p>
                  <p className="pl-4">provider = <span className="text-[#C084FC]">"postgresql"</span></p>
                  <p className="pl-4">url      = <span className="text-[#C084FC]">env("DATABASE_URL")</span></p>
                  <p>{'}'}</p>
                  <p className="mt-2"><span className="text-[#9333EA]">model</span> Product {'{'}</p>
                  <p className="pl-4">id           String   <span className="text-[#C084FC]">@id @default(uuid())</span></p>
                  <p className="pl-4">title        String   <span className="text-slate-500">// Enterprise Software Title</span></p>
                  <p className="pl-4">slug         String   <span className="text-[#C084FC]">@unique</span></p>
                  <p className="pl-4">price        Decimal  <span className="text-amber-400">@default(0.00)</span></p>
                  <p className="pl-4">isFree       Boolean  <span className="text-[#C084FC]">@default(false)</span></p>
                  <p>{'}'}</p>
                </div>
              )}

              {activeConsoleTab === 'ai' && (
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#C084FC] font-bold flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      Harbor AI Architectural Diagnostics: Active
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C084FC]/15 text-[#C084FC] text-[10px] font-bold border border-[#C084FC]/30">
                      A+ GRADE AUDIT
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#0E0A1C] border border-[#322659]/60 text-center">
                      <div className="text-2xl font-black text-[#C084FC]">98.4%</div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5">Code Reliability</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0E0A1C] border border-[#322659]/60 text-center">
                      <div className="text-2xl font-black text-[#C084FC]">A+</div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5">Security Score</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0E0A1C] border border-[#322659]/60 text-center">
                      <div className="text-2xl font-black text-[#9333EA]">0.0 ms</div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5">Query Overhead</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TECH STACK RADAR & FEATURED VESSELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#322659]/60">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#C084FC] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Project Templates & Verified Software</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Verified Project Templates & Vessels
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

      {/* 4. THE HARBOR ENGINEERING BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#9333EA] mb-2">
            <ShieldCheck className="w-4 h-4 text-[#C084FC]" />
            <span>The CoderHarbor Difference</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Engineered for Modern Developers
          </h2>
          <p className="text-xs sm:text-sm text-[#C0C7D1]">
            We bridge the gap between open-source uncertainty and enterprise-grade software projects with absolute architectural transparency.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Bento Cell 1: AI Copilot Spotlight */}
          <div className="md:col-span-2 p-7 rounded-2xl bg-[#140F28] border border-[#322659]/80 hover:border-[#C084FC]/50 transition duration-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/30 flex items-center justify-center mb-5">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Harbor AI Matchmaker & Copilot
              </h3>
              <p className="text-xs text-[#C0C7D1]/80 leading-relaxed mb-5">
                Tell Harbor AI what application you need to build in natural language. The engine parses requirements, checks data models, and recommends full-stack projects with ready-to-run code.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0A0713] border border-[#322659]/60 flex items-center justify-between text-xs font-mono text-[#C084FC]">
              <span>// Semantic Matching Accuracy: 98%</span>
              <span className="font-bold">Active Engine</span>
            </div>
          </div>

          {/* Bento Cell 2: Zero-Trust Private Vault */}
          <div className="p-7 rounded-2xl bg-[#140F28] border border-[#322659]/80 hover:border-[#9333EA]/50 transition duration-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#9333EA]/15 text-[#9333EA] border border-[#9333EA]/30 flex items-center justify-center mb-5">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Zero-Trust Private Vault
              </h3>
              <p className="text-xs text-[#C0C7D1]/80 leading-relaxed">
                Project ZIP archives are secured outside public web directories. File streams require authenticated authorization tokens.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#322659]/60 text-[11px] font-mono text-[#C084FC]">
              🔒 Encrypted Token Streaming
            </div>
          </div>

          {/* Bento Cell 3: PostgreSQL Native Standard */}
          <div className="p-7 rounded-2xl bg-[#140F28] border border-[#322659]/80 hover:border-[#C084FC]/50 transition duration-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#C084FC]/15 text-[#C084FC] border border-[#C084FC]/30 flex items-center justify-center mb-5">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                PostgreSQL & Prisma Native
              </h3>
              <p className="text-xs text-[#C0C7D1]/80 leading-relaxed">
                Clean relational schemas, automated migrations, strict foreign-key cascades, and zero ORM fragmentation.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#322659]/60 text-[11px] font-mono text-[#C084FC]">
              ⚡ Automated Migrations
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROJECT CATEGORIES VERTICALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#9333EA] mb-2">
            <Layers className="w-4 h-4" />
            <span>Marketplace Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Industry Technology Verticals
          </h2>
          <p className="text-xs sm:text-sm text-[#C0C7D1]">
            Find software engineered for your specific domain, from cloud SaaS to billing engines and developer templates.
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
                  {cat.description || 'Explore projects in this vertical'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#322659]/60 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                <span className="text-[#C084FC]">{cat.productCount ?? 0} vessels</span>
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
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#C084FC] mb-2">
              <Clock className="w-4 h-4" />
              <span>Recently Published</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Latest Additions to the Harbor
            </h2>
          </div>
          <Link
            to="/projects"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C084FC] hover:underline transition group"
          >
            <span>Explore Entire Catalogue</span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C084FC]/10 border border-[#C084FC]/30 text-[#C084FC] text-xs font-mono font-bold">
              <span>● CODERHARBOR DISCOVERY ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Explore Your Next Digital Project?
            </h2>
            <p className="text-[#C0C7D1] text-xs sm:text-sm leading-relaxed">
              Explore our verified repository of SaaS applications, business tools, and developer boilerplates. Your next production application begins here.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/projects"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#9333EA] via-[#C084FC] to-[#C084FC] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition flex items-center gap-2"
              >
                <span>Browse Full Catalogue</span>
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
