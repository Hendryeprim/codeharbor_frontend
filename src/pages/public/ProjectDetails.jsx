import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicAPI, customerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ComingSoonBadge, FreeBadge, ProductTypeBadge } from '../../components/common/Badge';
import { ComingSoonModal } from '../../components/common/ComingSoonModal';
import { AIProjectInspector } from '../../components/ai/AIProjectInspector';
import {
  ExternalLink,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  LifeBuoy,
  Cpu,
  Layers,
  Sparkles,
  Loader2,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Terminal,
} from 'lucide-react';

export const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await publicAPI.getProductBySlug(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          setSelectedImage(res.product.thumbnail || (res.product.images?.[0]?.imageUrl ?? null));
        } else {
          setError(res.message || 'Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleFreeDownload = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/projects/${slug}` } });
      return;
    }

    const downloadableFile = product?.files?.[0];
    if (!downloadableFile) {
      alert('No archive file is associated with this project.');
      return;
    }

    try {
      setDownloading(true);
      await customerAPI.downloadFreeFile(downloadableFile.id, downloadableFile.originalName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      alert(err.message || 'Error initiating download');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-[#E2E8F0]">
        <Loader2 className="w-10 h-10 animate-spin text-[#00FFC6]" />
        <p className="text-xs font-mono text-[#00FFC6]">Loading project architecture specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-[#E2E8F0]">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-slate-400 text-xs mb-6">{error || 'The requested project could not be found or has been archived.'}</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#131B2E] border border-[#334155] text-white font-semibold text-xs hover:border-[#00FFC6] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const isFree = Boolean(product.isFree);
  const canDownload = isFree && product.downloadAllowed && product.files?.length > 0;
  const allImages = [
    ...(product.thumbnail ? [{ id: 'thumb', imageUrl: product.thumbnail, altText: product.title }] : []),
    ...(product.images || []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#E2E8F0] space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/" className="hover:text-[#22D3EE]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/projects" className="hover:text-[#22D3EE]">Projects</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-[#00FFC6] font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Media Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[16/10] bg-[#0F172A] rounded-3xl overflow-hidden shadow-harbor-lg border border-[#334155] relative group">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {isFree ? <FreeBadge size="lg" /> : <ComingSoonBadge size="lg" />}
            </div>
          </div>

          {/* Screenshot Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-24 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img.imageUrl
                      ? 'border-[#00FFC6] shadow-neon-glow'
                      : 'border-[#334155] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt={img.altText || 'Thumbnail'} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Action Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#131B2E]/90 rounded-3xl p-6 sm:p-8 border border-[#334155]/80 shadow-harbor-md backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <ProductTypeBadge type={product.productType} />
              {product.category && (
                <Link
                  to={`/projects?category=${product.category.slug}`}
                  className="text-xs font-mono font-bold text-[#22D3EE] hover:underline"
                >
                  {product.category.name}
                </Link>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#C0C7D1] leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] mb-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Marketplace Pricing
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-3xl font-black ${isFree ? 'text-[#00FFC6]' : 'text-white'}`}>
                  {isFree ? 'FREE ACCESS' : `$${Number(product.price).toFixed(2)}`}
                </span>
                {!isFree && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Online Purchasing Coming Soon
                  </span>
                )}
              </div>
            </div>

            {/* Prominent Action Button */}
            {isFree ? (
              canDownload ? (
                <div className="space-y-3">
                  <button
                    onClick={handleFreeDownload}
                    disabled={downloading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs uppercase tracking-wider shadow-neon-glow hover:brightness-110 transition flex items-center justify-center gap-2"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Preparing Source Package...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Free Source Package</span>
                      </>
                    )}
                  </button>
                  {downloadSuccess && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-[#00FFC6] flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-[#00FFC6] shrink-0" />
                      <span>Download initiated successfully! Check browser downloads.</span>
                    </div>
                  )}
                  {!isAuthenticated && (
                    <p className="text-[10px] text-slate-400 text-center">
                      Free download requires an active account. You'll be prompted to log in.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] text-xs text-slate-400 text-center">
                  Free package download is currently being verified by administrator.
                </div>
              )
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-amber-500/40 text-amber-400 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Purchase (Coming Soon)</span>
                </button>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 leading-relaxed">
                  <strong>Notice:</strong> Online checkout is coming soon. Payment gateway integration (Stripe / Razorpay) is scheduled for the next release phase.
                </div>
              </div>
            )}

            {/* Demo Link */}
            {product.demoUrl && (
              <div className="mt-4">
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#334155] text-xs font-bold text-white hover:border-[#22D3EE] transition bg-[#0F172A]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Launch Live Interactive Demo</span>
                </a>
              </div>
            )}
          </div>

          {/* Deliverables Checklist */}
          <div className="pt-6 border-t border-[#334155]/60 mt-6 grid grid-cols-2 gap-4 text-xs text-[#C0C7D1]">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#00FFC6]" />
              <span>Full Source Code</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0EA5E9]" />
              <span>{product.documentationAvailable ? 'Docs Included' : 'Standard README'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
              <span>Vault Shielded</span>
            </div>
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-[#00FFC6]" />
              <span>Direct Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI CODEBASE & ARCHITECTURE INSPECTOR */}
      <AIProjectInspector slug={product.slug} projectTitle={product.title} />

      {/* Deep Technical Specifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#131B2E]/90 rounded-3xl p-6 sm:p-8 border border-[#334155]/70 shadow-harbor-sm backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00FFC6]" />
              <span>Architecture & Implementation Overview</span>
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
              {product.fullDescription}
            </div>
          </div>

          {/* Deliverables & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#131B2E]/90 rounded-3xl p-6 border border-[#334155]/70">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#0EA5E9]" />
                <span>Deliverables Manifest</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {product.deliverables || 'Complete repository, database migrations, Docker environment scripts, and documentation.'}
              </p>
            </div>

            <div className="bg-[#131B2E]/90 rounded-3xl p-6 border border-[#334155]/70">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#22D3EE]" />
                <span>Runtime Requirements</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {product.installationRequirements || 'Standard Node.js runtime, PostgreSQL 14+ database instance, and package manager.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Meta (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tech Stack List */}
          <div className="bg-[#131B2E]/90 rounded-3xl p-6 border border-[#334155]/70">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00FFC6]" />
              <span>Technology Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.technologies && product.technologies.length > 0 ? (
                product.technologies.map((tech) => (
                  <span
                    key={tech.id}
                    className="px-3 py-1.5 rounded-xl bg-[#0F172A] text-white font-mono font-semibold text-xs border border-[#334155]"
                  >
                    {tech.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Standard Web Technologies</span>
              )}
            </div>
          </div>

          {/* License & Support */}
          <div className="bg-[#131B2E]/90 rounded-3xl p-6 border border-[#334155]/70 space-y-5">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00FFC6]" />
                <span>Digital Product License</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {product.licenseText || 'Standard Single Commercial Deployment License. Resale of raw code package prohibited.'}
              </p>
            </div>

            <div className="pt-4 border-t border-[#334155]/60">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <LifeBuoy className="w-4 h-4 text-[#0EA5E9]" />
                <span>Support Guarantee</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {product.supportInformation || 'Direct issue tracking and setup assistance via CoderHarbor Support Desk.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Explanatory Modal */}
      <ComingSoonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productTitle={product.title}
        price={product.price}
      />
    </div>
  );
};
