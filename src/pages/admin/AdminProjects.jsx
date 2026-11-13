import React, { useState, useEffect, useRef } from 'react';
import { adminAPI, publicAPI, getFullImageUrl } from '../../services/api';
import { LivePreviewModal } from '../../components/common/LivePreviewModal';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  X,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  Upload,
  Image,
  FileArchive,
  Film,
  Check,
  RotateCcw,
  FileText,
  Play,
  ExternalLink,
  GitBranch,
} from 'lucide-react';

export const AdminProjects = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [zipFile, setZipFile] = useState(null);
  const [sourceMode, setSourceMode] = useState('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [initialGithubUrl, setInitialGithubUrl] = useState('');
  const [backendGithubUrl, setBackendGithubUrl] = useState('');
  const [initialBackendGithubUrl, setInitialBackendGithubUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [activePreview, setActivePreview] = useState(null);
  const [logsModal, setLogsModal] = useState(null);
  const [directUploadingId, setDirectUploadingId] = useState(null);
  const [targetProductIdForZip, setTargetProductIdForZip] = useState(null);
  const [pageNotification, setPageNotification] = useState(null);
  const [modalNotification, setModalNotification] = useState(null);
  const [syncingGithub, setSyncingGithub] = useState(false);
  const imageInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const directZipInputRef = useRef(null);

  const showPageMessage = (message, type = 'success') => {
    setPageNotification({ type, message });
    setTimeout(() => {
      setPageNotification((prev) => (prev?.message === message ? null : prev));
    }, 6000);
  };

  const showModalMessage = (message, type = 'error') => {
    setModalNotification({ type, message });
  };

  const handleSyncGithubNow = async () => {
    if (!editingId || !githubUrl.trim()) return;
    setSyncingGithub(true);
    setModalNotification(null);
    try {
      const res = await adminAPI.importGithubRepo(
        editingId,
        githubUrl.trim(),
        backendGithubUrl.trim(),
        githubToken.trim()
      );
      showModalMessage(res.message || 'GitHub repository re-synced and live preview built successfully!', 'success');
      fetchData();
    } catch (err) {
      showModalMessage('Failed to sync GitHub: ' + err.message, 'error');
    } finally {
      setSyncingGithub(false);
    }
  };

  const openDirectZipUpload = (productId) => {
    setTargetProductIdForZip(productId);
    directZipInputRef.current?.click();
  };

  const handleDirectZipUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !targetProductIdForZip) return;

    setDirectUploadingId(targetProductIdForZip);
    try {
      const zipFd = new FormData();
      zipFd.append('file', file);
      zipFd.append('productId', targetProductIdForZip);
      zipFd.append('version', '1.0.0');
      const res = await adminAPI.uploadProjectFile(zipFd);
      showPageMessage(res.message || 'ZIP archive uploaded! Live preview is being built.', 'success');
      fetchData();
    } catch (err) {
      showPageMessage('Upload failed: ' + err.message, 'error');
    } finally {
      setDirectUploadingId(null);
      setTargetProductIdForZip(null);
      if (directZipInputRef.current) directZipInputRef.current.value = '';
    }
  };

  const handleRebuildPreview = async (id) => {
    try {
      const res = await adminAPI.rebuildPreview(id);
      showPageMessage(res.message || 'Rebuild started.', 'success');
      fetchData();
    } catch (err) {
      showPageMessage('Rebuild failed: ' + err.message, 'error');
    }
  };

  const handleTogglePreview = async (id, currentStatus) => {
    try {
      const enable = currentStatus === 'DISABLED';
      await adminAPI.togglePreview(id, enable);
      showPageMessage(enable ? 'Preview enabled.' : 'Preview disabled.', 'success');
      fetchData();
    } catch (err) {
      showPageMessage('Toggle failed: ' + err.message, 'error');
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setModalNotification(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await adminAPI.uploadImage(fd);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, thumbnail: res.url }));
        showModalMessage('Image uploaded successfully!', 'success');
      }
    } catch (err) {
      showModalMessage('Failed to upload image: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    categoryId: '',
    thumbnail: '',
    demoUrl: '',
    productType: 'FULL_APPLICATION',
    price: 0,
    isFree: false,
    viewPrice: 0,
    isViewFree: true,
    isFeatured: false,
    status: 'PUBLISHED',
    licenseText: '',
    supportInformation: '',
    installationRequirements: '',
    deliverables: '',
    downloadAllowed: false,
    technologyIds: [],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, techRes] = await Promise.all([
        adminAPI.getProducts().catch((err) => {
          console.error('Products fetch error:', err);
          return { products: [] };
        }),
        adminAPI.getCategories().catch(async () => {
          return await publicAPI.getCategories().catch((err) => {
            console.error('Categories fetch error:', err);
            return { categories: [] };
          });
        }),
        adminAPI.getTechnologies().catch(async () => {
          return await publicAPI.getTechnologies().catch((err) => {
            console.error('Technologies fetch error:', err);
            return { technologies: [] };
          });
        }),
      ]);

      if (prodRes && prodRes.products) setProducts(prodRes.products || []);
      if (catRes && catRes.categories) setCategories(catRes.categories || []);
      if (techRes && techRes.technologies) setTechnologies(techRes.technologies || []);
    } catch (err) {
      console.error('Failed to load admin projects data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    if (categories.length === 0) {
      fetchData();
    }
    setModalNotification(null);
    setEditingId(null);
    setEditingProduct(null);
    setZipFile(null);
    setSourceMode('github');
    setGithubUrl('');
    setInitialGithubUrl('');
    setBackendGithubUrl('');
    setInitialBackendGithubUrl('');
    setGithubToken('');
    setFormData({
      title: '',
      shortDescription: '',
      fullDescription: '',
      categoryId: categories[0]?.id || '',
      thumbnail: '',
      demoUrl: '',
      productType: 'FULL_APPLICATION',
      price: 0,
      isFree: true,
      viewPrice: 0,
      isViewFree: true,
      isFeatured: false,
      status: 'PUBLISHED',
      licenseText: 'Standard Single Domain Developer License',
      supportInformation: '6 months technical bug assistance included',
      installationRequirements: 'Node.js 18+, PostgreSQL 14+, npm or yarn package manager',
      deliverables: 'Full Source Code (Frontend & Backend), Database Schemas, Documentation PDF',
      downloadAllowed: true,
      technologyIds: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setModalNotification(null);
    setEditingId(p.id);
    setEditingProduct(p);
    setZipFile(null);
    const existingFile = p.files?.[0];
    const isGithubFile = existingFile?.fileType === 'application/vnd.github+zip';
    const [feSpec = '', beSpec = ''] = isGithubFile && existingFile?.filename
      ? existingFile.filename.split(' + ').map((s) => s.trim())
      : [];
    const existingGithubUrl = feSpec ? `https://github.com/${feSpec.replace('@', '/tree/')}` : '';
    const existingBackendUrl = beSpec ? `https://github.com/${beSpec.replace('@', '/tree/')}` : '';
    setSourceMode(isGithubFile || !existingFile ? 'github' : 'zip');
    setGithubUrl(existingGithubUrl);
    setInitialGithubUrl(existingGithubUrl);
    setBackendGithubUrl(existingBackendUrl);
    setInitialBackendGithubUrl(existingBackendUrl);
    setGithubToken('');
    setFormData({
      title: p.title || '',
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      categoryId: p.categoryId || '',
      thumbnail: p.thumbnail || '',
      demoUrl: p.demoUrl || '',
      productType: p.productType || 'FULL_APPLICATION',
      price: p.price ?? 0,
      isFree: p.isFree ?? false,
      viewPrice: p.viewPrice ?? 0,
      isViewFree: p.isViewFree ?? true,
      isFeatured: p.isFeatured ?? false,
      status: p.status || 'PUBLISHED',
      licenseText: p.licenseText || '',
      supportInformation: p.supportInformation || '',
      installationRequirements: p.installationRequirements || '',
      deliverables: p.deliverables || '',
      downloadAllowed: p.downloadAllowed ?? false,
      technologyIds: p.technologies
        ? p.technologies
            .map((t) => (typeof t === 'object' && t !== null ? t.id || t.technologyId || t.technology?.id : t))
            .filter(Boolean)
        : [],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let savedProduct;
      if (editingId) {
        savedProduct = await adminAPI.updateProduct(editingId, formData);
      } else {
        savedProduct = await adminAPI.createProduct(formData);
      }

      const prodId = editingId || savedProduct?.product?.id;

      const githubChanged =
        githubUrl.trim() !== initialGithubUrl ||
        backendGithubUrl.trim() !== initialBackendGithubUrl ||
        Boolean(githubToken.trim());

      // Import from GitHub link (zero source storage) OR upload ZIP
      if (prodId && sourceMode === 'github' && githubUrl.trim() && githubChanged) {
        await adminAPI.importGithubRepo(
          prodId,
          githubUrl.trim(),
          backendGithubUrl.trim(),
          githubToken.trim()
        );
      } else if (prodId && sourceMode === 'zip' && zipFile) {
        const zipFd = new FormData();
        zipFd.append('file', zipFile);
        zipFd.append('productId', prodId);
        zipFd.append('version', '1.0.0');
        await adminAPI.uploadProjectFile(zipFd);
      }

      setZipFile(null);
      setGithubUrl('');
      setInitialGithubUrl('');
      setBackendGithubUrl('');
      setInitialBackendGithubUrl('');
      setGithubToken('');
      setModalOpen(false);
      showPageMessage(editingId ? 'Project updated successfully!' : 'Project created successfully!', 'success');
      fetchData();
    } catch (err) {
      showModalMessage(err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await adminAPI.deleteProduct(id);
      showPageMessage('Product deleted successfully.', 'success');
      fetchData();
    } catch (err) {
      showPageMessage(err.message || 'Failed to delete product', 'error');
    }
  };

  const toggleFeatured = async (p) => {
    try {
      await adminAPI.updateProduct(p.id, { isFeatured: !p.isFeatured });
      showPageMessage(`Project "${p.title}" ${!p.isFeatured ? 'marked as featured' : 'unmarked from featured'}.`, 'success');
      fetchData();
    } catch (err) {
      showPageMessage(err.message || 'Failed to toggle featured status', 'error');
    }
  };

  const toggleStatus = async (p) => {
    const nextStatus = p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await adminAPI.updateProduct(p.id, { status: nextStatus });
      showPageMessage(`Project status updated to ${nextStatus}.`, 'success');
      fetchData();
    } catch (err) {
      showPageMessage(err.message || 'Failed to toggle status', 'error');
    }
  };

  const toggleTech = (techId) => {
    const exists = formData.technologyIds.includes(techId);
    if (exists) {
      setFormData({
        ...formData,
        technologyIds: formData.technologyIds.filter((id) => id !== techId),
      });
    } else {
      setFormData({
        ...formData,
        technologyIds: [...formData.technologyIds, techId],
      });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
            Digital Project Inventory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
            Project Management
          </h1>
          <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
            Create, publish, edit, and organize digital project software packages and code bundles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#0A84FF] hover:shadow-purple-glow text-white font-bold text-xs flex items-center gap-2 transition duration-200 shrink-0 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] placeholder-slate-500 text-xs focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]"
        />
      </div>

      {/* Page Notification Banner */}
      {pageNotification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border animate-fadeIn ${
            pageNotification.type === 'error'
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
          }`}
        >
          <span className="font-medium">{pageNotification.message}</span>
          <button
            type="button"
            onClick={() => setPageNotification(null)}
            className="ml-3 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Projects Table */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#A855F7]" />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] rounded-2xl border border-[#322659]/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A0713]/80 text-[#C0C7D1] uppercase tracking-wider font-semibold border-b border-[#322659]/60">
                <tr>
                  <th className="px-5 py-3.5">Project</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Pricing</th>
                  <th className="px-5 py-3.5">Live Preview</th>
                  <th className="px-5 py-3.5">Featured</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#322659]/40 text-[#E2E8F0]">
                {(filteredProducts || []).map((p) => (
                  <tr key={p.id} className="hover:bg-[#1C1636]/40 transition">
                    <td className="px-5 py-3.5 font-bold">
                      <div className="flex items-center gap-3">
                        <img
                          src={getFullImageUrl(p.thumbnail)}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#322659]"
                        />
                        <div className="overflow-hidden">
                          <p className="truncate max-w-[220px] font-bold text-[#E2E8F0]">{p.title}</p>
                          <span className="text-[10px] text-[#C0C7D1]/50 font-mono">/{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#C0C7D1]">{p.category?.name || '—'}</td>
                    <td className="px-5 py-3.5 font-bold">
                      <div className="flex flex-col gap-0.5 text-xs font-mono">
                        <span className="text-[#A855F7] font-bold">
                          View: {p.isViewFree || Number(p.viewPrice || 0) === 0 ? 'Free' : `₹${Number(p.viewPrice).toFixed(2)}`}
                        </span>
                        <span className={p.isFree || Number(p.price || 0) === 0 ? 'text-[#C084FC] font-bold' : 'text-[#E2E8F0]'}>
                          Code: {p.isFree || Number(p.price || 0) === 0 ? 'Free' : `₹${Number(p.price).toFixed(2)}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1.5 items-start">
                        {p.previewStatus === 'READY' ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <Zap className="w-3 h-3 text-[#C084FC]" />
                              READY
                            </span>
                            <button
                              onClick={() => setActivePreview({ url: p.previewUrl, title: p.title })}
                              className="px-2 py-0.5 rounded bg-[#140F28] hover:bg-[#1C1636] text-[#C084FC] border border-[#C084FC]/30 text-[10px] font-mono flex items-center gap-1 transition"
                              title="Test Live Preview"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              View
                            </button>
                          </div>
                        ) : p.previewStatus === 'BUILDING' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            BUILDING
                          </span>
                        ) : p.previewStatus === 'REQUIRES_INFRASTRUCTURE' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30" title="Full-stack container required">
                            FULLSTACK
                          </span>
                        ) : p.previewStatus === 'FAILED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            FAILED
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] text-slate-500 font-mono">No Source</span>
                            <button
                              onClick={() => openDirectZipUpload(p.id)}
                              disabled={directUploadingId === p.id}
                              className="px-2 py-0.5 rounded bg-[#C084FC]/15 hover:bg-[#C084FC]/30 text-[#C084FC] border border-[#C084FC]/40 text-[10px] font-bold flex items-center gap-1 transition"
                              title="Upload ZIP file and auto-generate Live Preview"
                            >
                              {directUploadingId === p.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3 h-3" />
                                  <span>+ Upload ZIP</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {p.previewStatus && p.previewStatus !== 'NONE' && (
                          <div className="flex items-center gap-2 text-[10px] flex-wrap">
                            <button
                              onClick={() => openDirectZipUpload(p.id)}
                              disabled={directUploadingId === p.id}
                              className="text-slate-400 hover:text-[#C084FC] flex items-center gap-0.5 transition"
                              title="Replace or update project ZIP"
                            >
                              <Upload className="w-2.5 h-2.5" />
                              {directUploadingId === p.id ? 'Uploading...' : 'New ZIP'}
                            </button>
                            <button
                              onClick={() => handleRebuildPreview(p.id)}
                              className="text-slate-400 hover:text-[#A855F7] flex items-center gap-0.5 transition"
                              title="Rebuild Preview"
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              Rebuild
                            </button>
                            {p.previewBuildLogs && (
                              <button
                                onClick={() => setLogsModal({ title: p.title, logs: p.previewBuildLogs })}
                                className="text-slate-400 hover:text-[#C084FC] flex items-center gap-0.5 transition"
                                title="View Build Logs"
                              >
                                <FileText className="w-2.5 h-2.5" />
                                Logs
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                          p.isFeatured
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-[#1C1636] text-[#C0C7D1]/50 hover:text-[#C0C7D1]'
                        }`}
                      >
                        {p.isFeatured ? '★ Featured' : '☆ Standard'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleStatus(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          p.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <a
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-1.5 rounded-lg text-slate-400 hover:text-[#A855F7] hover:bg-[#1C1636]"
                        title="Preview Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#A855F7] hover:bg-[#1C1636]"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-gradient-to-b from-[#140F28] to-[#0A0713] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#322659] my-8 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#322659]/60 mb-5">
              <h3 className="text-lg font-bold text-[#E2E8F0]">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalNotification && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-center justify-between border animate-fadeIn ${
                  modalNotification.type === 'error'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                }`}
              >
                <span className="font-medium">{modalNotification.message}</span>
                <button
                  type="button"
                  onClick={() => setModalNotification(null)}
                  className="ml-3 text-slate-400 hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 text-xs">
              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. HarborERP Billing Suite"
                  className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#C0C7D1] mb-1">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 text-xs focus:outline-none focus:border-[#A855F7] bg-[#0E0A1C] text-[#E2E8F0]"
                  >
                    <option value="">Select Category</option>
                    {(categories || []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#C0C7D1] mb-1">Type</label>
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 text-xs focus:outline-none focus:border-[#A855F7] bg-[#0E0A1C] text-[#E2E8F0]"
                  >
                    <option value="FULL_APPLICATION">Full Application</option>
                    <option value="TEMPLATE">Template / UI</option>
                    <option value="RESOURCE">Resource / Toolkit</option>
                    <option value="PLUGIN">Plugin / Module</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#C0C7D1] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 text-xs focus:outline-none focus:border-[#A855F7] bg-[#0E0A1C] text-[#E2E8F0]"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="COMING_SOON">Coming Soon</option>
                  </select>
                </div>
              </div>

              {/* Simple Pricing & Access */}
              <div className="p-4 bg-[#0A0713]/90 rounded-2xl border border-[#A855F7]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-[#322659]/60 pb-2">
                  <span className="font-bold text-xs text-[#C084FC] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Pricing &amp; Access
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Live Preview Price */}
                  <div className="p-3 rounded-xl bg-[#0E0A1C] border border-[#322659] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#A855F7]" />
                        <span>Preview Price (₹)</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C084FC] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isViewFree}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isViewFree: e.target.checked,
                              viewPrice: e.target.checked ? 0 : formData.viewPrice,
                            })
                          }
                          className="rounded text-[#C084FC] w-3.5 h-3.5 bg-[#0A0713] border-[#322659]"
                        />
                        <span>Free</span>
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.viewPrice}
                        onChange={(e) => setFormData({ ...formData, viewPrice: e.target.value })}
                        disabled={formData.isViewFree}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-[#322659] bg-[#0A0713] text-[#E2E8F0] font-mono text-xs disabled:opacity-40 focus:outline-none focus:border-[#A855F7]"
                      />
                    </div>
                  </div>

                  {/* Download Price */}
                  <div className="p-3 rounded-xl bg-[#0E0A1C] border border-[#322659] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#C084FC]" />
                        <span>Download Price (₹)</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C084FC] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFree}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isFree: e.target.checked,
                              price: e.target.checked ? 0 : formData.price,
                            })
                          }
                          className="rounded text-[#C084FC] w-3.5 h-3.5 bg-[#0A0713] border-[#322659]"
                        />
                        <span>Free</span>
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        disabled={formData.isFree}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-[#322659] bg-[#0A0713] text-[#E2E8F0] font-mono text-xs disabled:opacity-40 focus:outline-none focus:border-[#C084FC]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      id="downloadAllowed"
                      checked={formData.downloadAllowed}
                      onChange={(e) => setFormData({ ...formData, downloadAllowed: e.target.checked })}
                      className="rounded text-[#A855F7] w-4 h-4 bg-[#0E0A1C] border-[#322659]"
                    />
                    <span className="font-semibold">Allow ZIP Download</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief 1-line summary of the project..."
                  className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Features, setup details, and overview..."
                  className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              {/* Cover Image & Demo URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-[#C0C7D1]">Cover Image</label>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="text-[11px] text-[#C084FC] hover:underline flex items-center gap-1 font-bold"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </button>
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="Upload file or paste image URL"
                      className="w-full px-3 py-2 pr-12 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                    />
                    {formData.thumbnail && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg overflow-hidden border border-[#322659]">
                        <img src={getFullImageUrl(formData.thumbnail)} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#C0C7D1] mb-1">
                    Demo / Video Link <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                  />
                </div>
              </div>

              {/* Project Source: GitHub Link (Zero Storage) or ZIP Upload */}
              <div className="p-4 rounded-2xl bg-[#0A0713] border border-[#C084FC]/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    {sourceMode === 'github' ? (
                      <GitBranch className="w-4 h-4 text-[#C084FC]" />
                    ) : (
                      <FileArchive className="w-4 h-4 text-[#C084FC]" />
                    )}
                    Project Source &amp; Preview
                  </span>

                  <div className="flex items-center gap-1 bg-[#140F28] p-1 rounded-xl border border-[#322659]">
                    <button
                      type="button"
                      onClick={() => setSourceMode('github')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                        sourceMode === 'github'
                          ? 'bg-[#A855F7] text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <GitBranch className="w-3 h-3" />
                      GitHub Link (No Storage)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSourceMode('zip')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                        sourceMode === 'zip'
                          ? 'bg-[#A855F7] text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      Upload ZIP
                    </button>
                  </div>
                </div>

                {editingProduct?.files && editingProduct.files.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 text-xs text-[#A855F7] flex items-center justify-between flex-wrap gap-2">
                    <span>
                      Current Source:{' '}
                      <strong>
                        {editingProduct.files[0].fileType === 'application/vnd.github+zip'
                          ? `GitHub (${editingProduct.files[0].filename})`
                          : editingProduct.files[0].originalName}
                      </strong>{' '}
                      ({(editingProduct.files[0].fileSize / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">
                      {editingProduct.previewStatus}
                    </span>
                  </div>
                )}

                {sourceMode === 'github' ? (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#C0C7D1] mb-1">
                        Frontend / Main GitHub Link
                      </label>
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username/frontend-repo (or single full project repo)"
                        className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#C0C7D1] mb-1">
                        Backend GitHub Link <span className="text-[10px] text-slate-400 font-normal">(Optional — use if backend is in a separate repo)</span>
                      </label>
                      <input
                        type="url"
                        value={backendGithubUrl}
                        onChange={(e) => setBackendGithubUrl(e.target.value)}
                        placeholder="Leave blank if frontend & backend are in one repo"
                        className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#C0C7D1] mb-1">
                        GitHub Token <span className="text-[10px] text-slate-400 font-normal">(Optional — needed only for Private repos)</span>
                      </label>
                      <input
                        type="password"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="Leave blank for public repositories"
                        className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                      />
                    </div>
                    <p className="text-[11px] text-emerald-400/90">
                      ✓ Paste 1 link if both folders are in one repo, or 2 separate links — builds live template preview &amp; downloads combined code with zero server ZIP storage.
                    </p>

                    {editingId && githubUrl.trim() && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleSyncGithubNow}
                          disabled={syncingGithub}
                          className="px-3 py-1.5 rounded-xl bg-[#A855F7]/15 hover:bg-[#A855F7]/25 border border-[#A855F7]/40 text-[#C084FC] hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          {syncingGithub ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A855F7]" />
                              <span>Re-syncing &amp; Building Real Live Preview...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 text-[#C084FC]" />
                              <span>Force Re-sync &amp; Rebuild Preview from GitHub</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      ref={zipInputRef}
                      type="file"
                      accept=".zip,.tar,.gz,.7z,.rar"
                      onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => zipInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7]/20 to-[#C084FC]/20 border border-[#C084FC]/50 text-xs font-bold text-white hover:brightness-125 transition flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-[#C084FC]" />
                        <span>{zipFile ? 'Change ZIP File' : 'Upload .ZIP File'}</span>
                      </button>

                      {zipFile ? (
                        <span className="text-xs text-[#C084FC] font-mono flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C084FC]/10 border border-[#C084FC]/30">
                          <Check className="w-4 h-4 text-[#C084FC]" />
                          {zipFile.name} ({(zipFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Accepts .zip, .rar, .7z, .tar.gz
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Technologies */}
              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1.5">Technologies</label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-[#0A0713]/70 rounded-xl border border-[#322659]/60 max-h-28 overflow-y-auto">
                  {(technologies || []).map((t) => {
                    const isSelected = Array.isArray(formData.technologyIds) && formData.technologyIds.includes(t.id);
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => toggleTech(t.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                          isSelected
                            ? 'bg-[#A855F7] text-white shadow-sm'
                            : 'bg-[#1C1636] border border-[#322659] text-slate-300 hover:text-white'
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {submitting && (sourceMode === 'github' ? githubUrl.trim() && (githubUrl.trim() !== initialGithubUrl || backendGithubUrl.trim() !== initialBackendGithubUrl || githubToken.trim()) : zipFile) && (
                <div className="p-3 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 text-xs text-[#A855F7] flex items-center gap-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-[#C084FC] shrink-0" />
                  <span>
                    {sourceMode === 'github'
                      ? 'Fetching GitHub repository & building live template preview... Please wait.'
                      : `Uploading project archive (${(zipFile.size / (1024 * 1024)).toFixed(1)} MB) & building preview... Please wait.`}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#322659]/60">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#322659] font-semibold text-slate-300 hover:bg-[#1C1636] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#0A84FF] hover:shadow-purple-glow text-white font-semibold shadow-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {submitting
                      ? sourceMode === 'github' && githubUrl.trim() && (githubUrl.trim() !== initialGithubUrl || backendGithubUrl.trim() !== initialBackendGithubUrl || githubToken.trim())
                        ? 'Importing GitHub & Building...'
                        : zipFile
                        ? 'Uploading & Building...'
                        : 'Saving...'
                      : editingId
                      ? 'Update Project'
                      : 'Create Project'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Hidden file picker for direct table ZIP upload */}
      <input
        ref={directZipInputRef}
        type="file"
        accept=".zip,.tar,.gz,.7z"
        onChange={handleDirectZipUpload}
        className="hidden"
      />

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={!!activePreview}
        onClose={() => setActivePreview(null)}
        previewUrl={activePreview?.url}
        projectTitle={activePreview?.title}
      />

      {/* Build Logs Modal */}
      {logsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0713] border border-[#322659] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#322659]/60 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C084FC]" />
                <h3 className="text-base font-bold text-white">
                  Build & Deployment Logs: {logsModal.title}
                </h3>
              </div>
              <button
                onClick={() => setLogsModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#070A12] border border-[#1C1636] text-[11px] font-mono text-[#A855F7] max-h-96 overflow-y-auto whitespace-pre-wrap select-text">
              {logsModal.logs || 'No build logs available for this project.'}
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setLogsModal(null)}
                className="px-4 py-2 rounded-xl bg-[#1C1636] hover:bg-[#322659] text-white text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
