import React, { useState, useEffect, useRef } from 'react';
import { adminAPI, publicAPI } from '../../services/api';
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
  const [activePreview, setActivePreview] = useState(null);
  const [logsModal, setLogsModal] = useState(null);
  const [directUploadingId, setDirectUploadingId] = useState(null);
  const [targetProductIdForZip, setTargetProductIdForZip] = useState(null);
  const imageInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const directZipInputRef = useRef(null);

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
      alert(res.message || 'ZIP archive uploaded! Live preview is being built.');
      fetchData();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setDirectUploadingId(null);
      setTargetProductIdForZip(null);
      if (directZipInputRef.current) directZipInputRef.current.value = '';
    }
  };

  const handleRebuildPreview = async (id) => {
    try {
      const res = await adminAPI.rebuildPreview(id);
      alert(res.message || 'Rebuild started.');
      fetchData();
    } catch (err) {
      alert('Rebuild failed: ' + err.message);
    }
  };

  const handleTogglePreview = async (id, currentStatus) => {
    try {
      const enable = currentStatus === 'DISABLED';
      await adminAPI.togglePreview(id, enable);
      fetchData();
    } catch (err) {
      alert('Toggle failed: ' + err.message);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await adminAPI.uploadImage(fd);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, thumbnail: res.url }));
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
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
        adminAPI.getProducts(),
        publicAPI.getCategories(),
        publicAPI.getTechnologies(),
      ]);

      if (prodRes.success) setProducts(prodRes.products || []);
      if (catRes.success) setCategories(catRes.categories || []);
      if (techRes.success) setTechnologies(techRes.technologies || []);
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
    setEditingId(null);
    setEditingProduct(null);
    setZipFile(null);
    setFormData({
      title: '',
      shortDescription: '',
      fullDescription: '',
      categoryId: categories[0]?.id || '',
      thumbnail: '',
      demoUrl: '',
      productType: 'FULL_APPLICATION',
      price: 0,
      isFree: false,
      viewPrice: 0,
      isViewFree: true,
      isFeatured: false,
      status: 'PUBLISHED',
      licenseText: 'Standard Single Domain Developer License',
      supportInformation: '6 months technical bug assistance included',
      installationRequirements: 'Node.js 18+, PostgreSQL 14+, npm or yarn package manager',
      deliverables: 'Full Source Code (Frontend & Backend), Database Schemas, Documentation PDF',
      downloadAllowed: false,
      technologyIds: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setEditingProduct(p);
    setZipFile(null);
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

      // If a ZIP archive was attached, upload it
      if (zipFile) {
        const prodId = editingId || savedProduct?.product?.id;
        if (prodId) {
          const zipFd = new FormData();
          zipFd.append('file', zipFile);
          zipFd.append('productId', prodId);
          zipFd.append('version', '1.0.0');
          await adminAPI.uploadProjectFile(zipFd);
        }
      }

      setZipFile(null);
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await adminAPI.deleteProduct(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const toggleFeatured = async (p) => {
    try {
      await adminAPI.updateProduct(p.id, { isFeatured: !p.isFeatured });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleStatus = async (p) => {
    const nextStatus = p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await adminAPI.updateProduct(p.id, { status: nextStatus });
      fetchData();
    } catch (err) {
      alert(err.message);
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
                          src={p.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80'}
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
                            <span className="text-[11px] text-slate-500 font-mono">No ZIP</span>
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
                {editingId ? 'Edit Project Specifications' : 'Add New Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 text-xs">
              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. HarborERP – Multi-Branch Supply Suite"
                  className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block font-semibold text-[#C0C7D1] mb-1">Product Type *</label>
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 text-xs focus:outline-none focus:border-[#A855F7] bg-[#0E0A1C] text-[#E2E8F0]"
                  >
                    <option value="FULL_APPLICATION">Full Application</option>
                    <option value="TEMPLATE">Template / Boilerplate</option>
                    <option value="RESOURCE">Resource / Toolkit</option>
                    <option value="PLUGIN">Plugin / Module</option>
                  </select>
                </div>
              </div>

              {/* DUAL PRICING CONFIGURATION (VIEW PRICE & DOWNLOAD PRICE) */}
              <div className="p-4 bg-[#0A0713]/90 rounded-2xl border border-[#A855F7]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-[#322659]/60 pb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#C084FC] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Dual Pricing Structure (View Access vs. Download Access)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Independent Pricing Tiers</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tier 1: View / Live Preview Access */}
                  <div className="p-3 rounded-xl bg-[#0E0A1C] border border-[#322659] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#A855F7]" />
                        <span>Live Preview / View Price (₹)</span>
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
                        <span>Free to View</span>
                      </label>
                    </div>
                    <div>
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
                      <p className="text-[10px] text-slate-400 mt-1">Amount charged to launch or explore the live interactive preview.</p>
                    </div>
                  </div>

                  {/* Tier 2: Full Source Code Download / Purchase */}
                  <div className="p-3 rounded-xl bg-[#0E0A1C] border border-[#322659] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#C084FC]" />
                        <span>Source Code Download Price (₹)</span>
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
                        <span>Free Download</span>
                      </label>
                    </div>
                    <div>
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
                      <p className="text-[10px] text-slate-400 mt-1">Amount charged to download the full ZIP source codebase.</p>
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
                    <span className="font-semibold">Allow Verified ZIP Download Access</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence overview for card listings..."
                  className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1">Full Technical Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Comprehensive architecture overview, database structures, features..."
                  className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              {/* Thumbnail and Demo URL section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Thumbnail with Direct File Upload */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-[#C0C7D1]">Thumbnail / Screenshot</label>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="text-[10px] text-[#C084FC] hover:underline flex items-center gap-1 font-mono font-bold"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
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
                      placeholder="Paste image URL or click 'Upload File' above"
                      className="w-full px-3 py-2 pr-12 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                    />
                    {formData.thumbnail && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg overflow-hidden border border-[#322659]">
                        <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400">
                    <span>Quick covers:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' })}
                      className="text-[#A855F7] hover:underline"
                    >Code</button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' })}
                      className="text-[#A855F7] hover:underline"
                    >SaaS</button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80' })}
                      className="text-[#A855F7] hover:underline"
                    >E-Com</button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80' })}
                      className="text-[#A855F7] hover:underline"
                    >Billing</button>
                  </div>
                </div>

                {/* Live Demo URL / Video Demo (Optional) */}
                <div>
                  <label className="block font-semibold text-[#C0C7D1] mb-1">
                    Live Demo / Video URL <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://... (Optional: Live site, YouTube, Loom, or Drive video)"
                    className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#A855F7]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    No live website? Leave empty or paste a 1-minute YouTube screen recording link.
                  </p>
                </div>
              </div>

              {/* Attach Source Code ZIP Archive & Automatic Live Preview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0A0713] to-[#140F28] border border-[#C084FC]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Zap className="w-4 h-4 text-[#C084FC]" />
                    <span>Project ZIP Archive & Automated Live Preview</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#C084FC] bg-[#C084FC]/10 px-2 py-0.5 rounded border border-[#C084FC]/30">
                    Auto-Build Sandbox
                  </span>
                </div>

                {editingProduct?.files && editingProduct.files.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 text-xs text-[#A855F7] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileArchive className="w-4 h-4 text-[#C084FC]" />
                      <span>
                        Currently Attached: <strong>{editingProduct.files[0].originalName}</strong> ({(editingProduct.files[0].fileSize / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#C084FC] bg-[#C084FC]/15 px-2 py-0.5 rounded border border-[#C084FC]/30">
                      Status: {editingProduct.previewStatus}
                    </span>
                  </div>
                )}

                <p className="text-[11px] text-[#C0C7D1] leading-relaxed">
                  Upload your project source code as a <code className="text-[#C084FC] font-mono">.zip</code> archive. CoderHarbor will automatically detect the architecture (Static HTML, React/Vite, or Fullstack), run an isolated build, and launch a working <strong>Live Preview</strong> for customers!
                </p>

                <input
                  ref={zipInputRef}
                  type="file"
                  accept=".zip,.tar,.gz,.7z"
                  onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => zipInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7]/20 to-[#C084FC]/20 border border-[#C084FC]/50 text-xs font-bold text-white hover:brightness-125 transition flex items-center gap-2 shadow-sm"
                  >
                    <Upload className="w-4 h-4 text-[#C084FC]" />
                    <span>{zipFile ? 'Change ZIP File' : 'Choose Project .ZIP from Computer'}</span>
                  </button>

                  {zipFile ? (
                    <span className="text-xs text-[#C084FC] font-mono flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C084FC]/10 border border-[#C084FC]/30">
                      <Check className="w-4 h-4 text-[#C084FC]" />
                      {zipFile.name} ({(zipFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      No ZIP selected. (Upload will trigger automatic validation and deployment).
                    </span>
                  )}
                </div>
              </div>

              {/* Technologies Checkboxes */}
              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1.5">Technologies Used</label>
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

              {submitting && zipFile && (
                <div className="p-3 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 text-xs text-[#A855F7] flex items-center gap-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-[#C084FC] shrink-0" />
                  <span>
                    Uploading project archive ({(zipFile.size / (1024 * 1024)).toFixed(1)} MB) & launching live preview analysis... Please wait.
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
                      ? zipFile
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
