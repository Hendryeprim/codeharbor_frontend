import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicAPI, customerAPI, getFullImageUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ComingSoonBadge, FreeBadge, ProductTypeBadge } from '../../components/common/Badge';
import { ComingSoonModal } from '../../components/common/ComingSoonModal';
import { LivePreviewModal } from '../../components/common/LivePreviewModal';
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
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  RotateCcw,
  Eye,
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
  const [livePreviewOpen, setLivePreviewOpen] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('preview'); // 'preview' | 'gallery'
  const [inlineDevice, setInlineDevice] = useState('desktop');
  const [inlineIframeKey, setInlineIframeKey] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await publicAPI.getProductBySlug(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          setSelectedImage(res.product.thumbnail ? getFullImageUrl(res.product.thumbnail) : (res.product.images?.[0]?.imageUrl ? getFullImageUrl(res.product.images[0].imageUrl) : null));
          if (res.product.previewStatus === 'READY' && res.product.previewUrl) {
            setActiveMediaTab('preview');
          } else {
            setActiveMediaTab('gallery');
          }
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
        <Loader2 className="w-10 h-10 animate-spin text-[#C084FC]" />
        <p className="text-xs font-mono text-[#C084FC]">Loading project architecture specifications...</p>
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
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#140F28] border border-[#322659] text-white font-semibold text-xs hover:border-[#C084FC] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const isDownloadFree = Boolean(product.isFree);
  const downloadPrice = Number(product.price || 0);
  const isViewFree = Boolean(product.isViewFree ?? true);
  const viewPrice = Number(product.viewPrice || 0);
  const isEntirelyFree = (isDownloadFree || downloadPrice === 0) && (isViewFree || viewPrice === 0);
  const isFreeDownload = isDownloadFree || downloadPrice === 0;
  const isFreeView = isViewFree || viewPrice === 0;
  const isFree = isFreeDownload;
  const canDownload = isFreeDownload && product.downloadAllowed && product.files?.length > 0;
  const allImages = [
    ...(product.thumbnail ? [{ id: 'thumb', imageUrl: getFullImageUrl(product.thumbnail), altText: product.title }] : []),
    ...(product.images || []).map((img) => ({ ...img, imageUrl: getFullImageUrl(img.imageUrl) })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#E2E8F0] space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/" className="hover:text-[#C084FC]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/projects" className="hover:text-[#C084FC]">Projects</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-[#C084FC] font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Interactive Running Template & Media Gallery */}
        <div className="lg:col-span-7 space-y-3">
          {/* View Mode Tabs */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              {product.previewStatus === 'READY' && product.previewUrl && (
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('preview')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeMediaTab === 'preview'
                      ? 'bg-gradient-to-r from-[#C084FC] to-[#9333EA] text-white shadow-purple-glow'
                      : 'bg-[#140F28] border border-[#322659] text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#0A0713] animate-ping" />
                  <span>⚡ Live Running Template</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveMediaTab('gallery')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeMediaTab === 'gallery' || !product.previewUrl
                    ? 'bg-[#1C1636] border border-[#C084FC] text-white'
                    : 'bg-[#140F28] border border-[#322659] text-slate-400 hover:text-white'
                }`}
              >
                <span>📷 Visual Gallery</span>
              </button>
            </div>

            {product.previewStatus === 'READY' && (
              <span className="text-[11px] font-mono text-[#C084FC] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC]" />
                Sandbox Online
              </span>
            )}
          </div>

          {/* Interactive Running Template Frame */}
          {activeMediaTab === 'preview' && product.previewStatus === 'READY' && product.previewUrl ? (
            <div className="bg-[#0E0A1C] rounded-3xl overflow-hidden shadow-harbor-lg border border-[#322659] flex flex-col h-[520px]">
              {/* Sandbox Top Control Bar */}
              <div className="bg-[#140F28] border-b border-[#322659]/80 px-4 py-2.5 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-[11px] font-mono text-slate-300 font-semibold ml-1 hidden sm:inline">
                    sandbox://{product.slug}
                  </span>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center gap-1 bg-[#0A0713] p-0.5 rounded-xl border border-[#322659]/60">
                  <button
                    type="button"
                    onClick={() => setInlineDevice('desktop')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition flex items-center gap-1 cursor-pointer ${
                      inlineDevice === 'desktop'
                        ? 'bg-[#C084FC] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Desktop (Full Width)"
                  >
                    <Laptop className="w-3 h-3" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInlineDevice('tablet')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition flex items-center gap-1 cursor-pointer ${
                      inlineDevice === 'tablet'
                        ? 'bg-[#C084FC] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tablet (768px)"
                  >
                    <Tablet className="w-3 h-3" />
                    <span className="hidden sm:inline">Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInlineDevice('mobile')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition flex items-center gap-1 cursor-pointer ${
                      inlineDevice === 'mobile'
                        ? 'bg-[#C084FC] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Mobile (375px)"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                {/* Sandbox Action Shortcuts */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInlineIframeKey((k) => k + 1)}
                    className="p-1.5 rounded-lg hover:bg-[#1C1636] text-slate-400 hover:text-white transition cursor-pointer"
                    title="Reload Sandbox"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={product.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-[#1C1636] text-slate-400 hover:text-[#C084FC] transition cursor-pointer"
                    title="Open Live Preview in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setLivePreviewOpen(true)}
                    className="p-1.5 rounded-lg hover:bg-[#1C1636] text-slate-400 hover:text-[#C084FC] transition cursor-pointer"
                    title="Expand Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Iframe Viewport Container */}
              <div className="flex-1 bg-[#070A12] flex items-center justify-center p-2 sm:p-3 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 rounded-xl overflow-hidden border border-[#322659]/60 shadow-2xl bg-white ${
                    inlineDevice === 'mobile'
                      ? 'w-[375px] max-w-full'
                      : inlineDevice === 'tablet'
                      ? 'w-[768px] max-w-full'
                      : 'w-full'
                  }`}
                >
                  <iframe
                    key={inlineIframeKey}
                    src={product.previewUrl}
                    title={`${product.title} Live Template Sandbox`}
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Screenshot Gallery Display */
            <div className="space-y-4">
              <div className="aspect-[16/10] bg-[#0E0A1C] rounded-3xl overflow-hidden shadow-harbor-lg border border-[#322659] relative group">
                <img
                  src={selectedImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  {isEntirelyFree ? <FreeBadge size="lg" /> : <ComingSoonBadge size="lg" />}
                </div>
              </div>

              {/* Screenshot Thumbnails */}
              {(allImages || []).length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {(allImages || []).map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImage(img.imageUrl)}
                      className={`w-24 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                        selectedImage === img.imageUrl
                          ? 'border-[#C084FC] shadow-purple-glow'
                          : 'border-[#322659] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.imageUrl} alt={img.altText || 'Thumbnail'} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Action Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#140F28]/90 rounded-3xl p-6 sm:p-8 border border-[#322659]/80 shadow-harbor-md backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <ProductTypeBadge type={product.productType} />
              {product.category && (
                <Link
                  to={`/projects?category=${product.category.slug}`}
                  className="text-xs font-mono font-bold text-[#C084FC] hover:underline"
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

            {/* Clean Action & Pricing Section */}
            {isEntirelyFree ? (
              /* Completely Free Project: No prices, clean direct action buttons */
              <div className="space-y-4 mb-6">
                {product.previewStatus === 'READY' && product.previewUrl && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setLivePreviewOpen(true)}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C084FC] via-[#C084FC] to-[#9333EA] text-white font-black text-sm uppercase tracking-wider shadow-purple-glow hover:brightness-110 transition flex items-center justify-center gap-2.5 cursor-pointer transform hover:scale-[1.01]"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0A0713] animate-ping" />
                      <span>⚡ LIVE INTERACTIVE PREVIEW</span>
                      <ExternalLink className="w-4 h-4 text-white" />
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-mono">
                      Experience the running application directly in the interactive browser sandbox.
                    </p>
                  </div>
                )}

                {product.previewStatus === 'BUILDING' && (
                  <div className="p-3.5 rounded-2xl bg-[#0E0A1C] border border-amber-500/40 text-amber-300 text-xs flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold">Live Preview In Progress</p>
                      <p className="text-[10px] text-slate-400">Compiling this codebase in an isolated build sandbox...</p>
                    </div>
                  </div>
                )}

                {product.previewStatus === 'REQUIRES_INFRASTRUCTURE' && (
                  <div className="p-3 rounded-xl bg-[#0E0A1C] border border-[#322659] text-xs text-slate-300 flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <span className="text-[11px]">Full-stack architecture (Frontend + Node.js Backend / DB). Complete source code package available for free download.</span>
                  </div>
                )}

                {canDownload ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleFreeDownload}
                      disabled={downloading}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white font-extrabold text-xs uppercase tracking-wider shadow-purple-glow hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
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
                      <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-[#C084FC] flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0" />
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
                  <div className="p-4 rounded-xl bg-[#0E0A1C] border border-[#322659] text-xs text-slate-400 text-center">
                    Free package download is currently being verified by administrator.
                  </div>
                )}
              </div>
            ) : (
              /* Paid Project: Display TWO distinct Price Buttons (Preview Price & Download Price) */
              <div className="space-y-4 mb-6">
                {/* 1. Preview Price Button */}
                {isFreeView ? (
                  <button
                    type="button"
                    onClick={() => (product.previewStatus === 'READY' ? setLivePreviewOpen(true) : null)}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#C084FC]/15 via-[#C084FC]/15 to-[#9333EA]/15 border border-[#C084FC]/60 hover:border-[#C084FC] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-between shadow-purple-glow cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C084FC] group-hover:animate-ping" />
                      <Eye className="w-4 h-4 text-[#C084FC]" />
                      <span className="text-white font-bold">⚡ Live Interactive Preview</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#C084FC]/20 border border-[#C084FC]/50 text-[#C084FC] text-xs font-mono font-black">
                      FREE
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => (product.previewStatus === 'READY' ? setLivePreviewOpen(true) : setModalOpen(true))}
                    className="w-full py-4 px-5 rounded-2xl bg-[#0E0A1C] hover:bg-[#140F28] border border-[#C084FC]/60 hover:border-[#C084FC] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-between group shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Eye className="w-4 h-4 text-[#C084FC]" />
                      <span className="text-white font-bold">⚡ Live Preview Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-[#C084FC]/20 border border-[#C084FC]/50 text-[#C084FC] text-xs font-mono font-black">
                        ₹{viewPrice.toFixed(2)}
                      </span>
                    </div>
                  </button>
                )}

                {/* Preview status notifications if needed */}
                {product.previewStatus === 'BUILDING' && (
                  <div className="p-3 rounded-xl bg-[#0E0A1C] border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                    <span className="text-[11px]">Compiling this codebase in an isolated build sandbox...</span>
                  </div>
                )}

                {product.previewStatus === 'REQUIRES_INFRASTRUCTURE' && (
                  <div className="p-3 rounded-xl bg-[#0E0A1C] border border-[#322659] text-xs text-slate-300 flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <span className="text-[11px]">Full-stack architecture. Complete source package available below.</span>
                  </div>
                )}

                {/* 2. Download Price Button */}
                {isFreeDownload ? (
                  canDownload ? (
                    <button
                      type="button"
                      onClick={handleFreeDownload}
                      disabled={downloading}
                      className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-between shadow-purple-glow hover:brightness-110 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span>{downloading ? 'Preparing Source Package...' : 'Download Full Source Code'}</span>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-[#0A0713]/20 text-white text-xs font-mono font-black">
                        FREE
                      </span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#0E0A1C] border border-[#322659] text-xs text-slate-400 text-center">
                      Free package download is currently being verified by administrator.
                    </div>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="w-full py-4 px-5 rounded-2xl bg-[#0E0A1C] hover:bg-[#1C1636] border border-amber-500/50 hover:border-amber-400 text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-between group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300 font-bold">Download Source Code</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-black">
                        ₹{downloadPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-amber-400/80 font-mono hidden sm:inline">
                        (Coming Soon)
                      </span>
                    </div>
                  </button>
                )}

                {downloadSuccess && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-[#C084FC] flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <span>Download initiated successfully! Check browser downloads.</span>
                  </div>
                )}

                {/* Notice below paid buttons */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚡ Online Purchasing: Coming Soon</span>
                  </div>
                  <span className="text-slate-400 text-[10px] font-mono">Payment gateway in setup</span>
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
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#322659] text-xs font-bold text-white hover:border-[#C084FC] transition bg-[#0E0A1C]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>Launch Live Interactive Demo</span>
                </a>
              </div>
            )}
          </div>

          {/* Deliverables Checklist */}
          <div className="pt-6 border-t border-[#322659]/60 mt-6 grid grid-cols-2 gap-4 text-xs text-[#C0C7D1]">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#C084FC]" />
              <span>Full Source Code</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#9333EA]" />
              <span>{product.documentationAvailable ? 'Docs Included' : 'Standard README'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C084FC]" />
              <span>Vault Shielded</span>
            </div>
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-[#C084FC]" />
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
          <div className="bg-[#140F28]/90 rounded-3xl p-6 sm:p-8 border border-[#322659]/70 shadow-harbor-sm backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#C084FC]" />
              <span>Architecture & Implementation Overview</span>
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
              {product.fullDescription}
            </div>
          </div>

          {/* Deliverables & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#140F28]/90 rounded-3xl p-6 border border-[#322659]/70">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#9333EA]" />
                <span>Deliverables Manifest</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {product.deliverables || 'Complete repository, database migrations, Docker environment scripts, and documentation.'}
              </p>
            </div>

            <div className="bg-[#140F28]/90 rounded-3xl p-6 border border-[#322659]/70">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#C084FC]" />
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
          <div className="bg-[#140F28]/90 rounded-3xl p-6 border border-[#322659]/70">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#C084FC]" />
              <span>Technology Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(product.technologies) && product.technologies.length > 0 ? (
                product.technologies.filter(Boolean).map((tech) => (
                  <span
                    key={tech.id || tech.name}
                    className="px-3 py-1.5 rounded-xl bg-[#0E0A1C] text-white font-mono font-semibold text-xs border border-[#322659]"
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
          <div className="bg-[#140F28]/90 rounded-3xl p-6 border border-[#322659]/70 space-y-5">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C084FC]" />
                <span>Digital Product License</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {product.licenseText || 'Standard Single Commercial Deployment License. Resale of raw code package prohibited.'}
              </p>
            </div>

            <div className="pt-4 border-t border-[#322659]/60">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <LifeBuoy className="w-4 h-4 text-[#9333EA]" />
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

      {/* Responsive Live Sandbox Preview Modal */}
      {product.previewUrl && (
        <LivePreviewModal
          isOpen={livePreviewOpen}
          onClose={() => setLivePreviewOpen(false)}
          previewUrl={product.previewUrl}
          projectTitle={product.title}
        />
      )}
    </div>
  );
};
