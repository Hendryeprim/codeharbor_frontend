import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicAPI } from '../../services/api';
import { ProjectCard } from '../../components/project/ProjectCard';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Loader2,
  AlertCircle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  PackageX,
  Sparkles,
  Bot,
} from 'lucide-react';

export const ExploreProjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const technology = searchParams.get('technology') || '';
  const productType = searchParams.get('productType') || '';
  const isFree = searchParams.get('isFree') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Load Categories & Technologies for filter dropdowns
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, techRes] = await Promise.all([
          publicAPI.getCategories(),
          publicAPI.getTechnologies(),
        ]);
        if (catRes.categories) setCategories(catRes.categories);
        if (techRes.technologies) setTechnologies(techRes.technologies);
      } catch (err) {
        console.error('Error fetching filter metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products whenever searchParams change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          search,
          category,
          technology,
          productType,
          isFree,
          sortBy,
          page,
          limit: 12,
        };

        const res = await publicAPI.getProducts(params);
        if (res.success) {
          setProducts(res.products);
          setPagination(res.pagination);
        } else {
          setError(res.message || 'Failed to fetch projects');
        }
      } catch (err) {
        setError(err.message || 'Failed to connect to marketplace service');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    search || category || technology || productType || isFree || sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#E2E8F0]">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#C084FC] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Production Repository Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Explore Projects
        </h1>
        <p className="text-[#C0C7D1] text-xs sm:text-sm mt-1">
          Discover vetted software codebases, developer boilerplates, and full applications.
        </p>
      </div>

      {/* Main Search & Filter Card */}
      <div className="bg-[#140F28]/90 p-5 rounded-3xl border border-[#322659]/80 shadow-harbor-sm mb-8 space-y-4 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C084FC]" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search by title, description or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#322659] bg-[#0A0713] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C084FC]"
            />
            {search && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#322659] text-xs text-white bg-[#0A0713] focus:outline-none focus:border-[#C084FC]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#322659] text-xs font-bold text-white bg-[#0A0713]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C084FC]" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Dropdown Row */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#322659]/60 ${
            mobileFilterOpen ? 'block' : 'hidden md:grid'
          }`}
        >
          {/* Category Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#322659] text-xs text-white bg-[#0A0713] focus:outline-none focus:border-[#C084FC]"
            >
              <option value="">All Categories</option>
              {(categories || []).map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Technology Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Technology</label>
            <select
              value={technology}
              onChange={(e) => updateFilter('technology', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#322659] text-xs text-white bg-[#0A0713] focus:outline-none focus:border-[#C084FC]"
            >
              <option value="">All Technologies</option>
              {(technologies || []).map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Type Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Type</label>
            <select
              value={productType}
              onChange={(e) => updateFilter('productType', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#322659] text-xs text-white bg-[#0A0713] focus:outline-none focus:border-[#C084FC]"
            >
              <option value="">All Project Types</option>
              <option value="FULL_APPLICATION">Full Application</option>
              <option value="TEMPLATE">Template / Boilerplate</option>
              <option value="RESOURCE">Resource / Toolkit</option>
              <option value="PLUGIN">Plugin / Module</option>
            </select>
          </div>

          {/* Pricing Model */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Pricing Model</label>
            <select
              value={isFree}
              onChange={(e) => updateFilter('isFree', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#322659] text-xs text-white bg-[#0A0713] focus:outline-none focus:border-[#C084FC]"
            >
              <option value="">All (Free & Paid)</option>
              <option value="true">Free Access Only</option>
              <option value="false">Paid Only (Coming Soon)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Clear Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-slate-400 font-medium">
              Found <strong className="text-[#C084FC]">{pagination.totalCount}</strong> matching projects
            </span>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Content States */}
      {loading ? (
        <div className="py-28 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#C084FC]" />
          <p className="text-xs font-mono text-[#C084FC]">Querying PostgreSQL & indexing vectors...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-950/40 border border-rose-800 rounded-3xl text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Error Loading Catalogue</h3>
          <p className="text-xs text-rose-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 sm:p-16 bg-[#140F28] rounded-3xl border border-[#322659] text-center max-w-md mx-auto shadow-harbor-sm">
          <PackageX className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Matching Projects Found</h3>
          <p className="text-xs text-slate-400 mb-6">
            We couldn't find any software projects matching your criteria. Try adjusting your filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Responsive Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(products || []).map((product) => (
              <ProjectCard key={product.id} project={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => updateFilter('page', (page - 1).toString())}
                className="p-2.5 rounded-xl border border-[#322659] bg-[#140F28] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="px-4 py-2 text-xs font-mono font-bold text-[#C084FC] bg-[#140F28] border border-[#322659] rounded-xl">
                Page {page} of {pagination.totalPages}
              </span>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => updateFilter('page', (page + 1).toString())}
                className="p-2.5 rounded-xl border border-[#322659] bg-[#140F28] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
