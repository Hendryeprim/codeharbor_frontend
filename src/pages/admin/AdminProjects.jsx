import React, { useState, useEffect } from 'react';
import { adminAPI, publicAPI } from '../../services/api';
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
  const [submitting, setSubmitting] = useState(false);

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
      isFeatured: p.isFeatured ?? false,
      status: p.status || 'PUBLISHED',
      licenseText: p.licenseText || '',
      supportInformation: p.supportInformation || '',
      installationRequirements: p.installationRequirements || '',
      deliverables: p.deliverables || '',
      downloadAllowed: p.downloadAllowed ?? false,
      technologyIds: p.technologies ? p.technologies.map((t) => t.technologyId || t.technology?.id) : [],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await adminAPI.updateProduct(editingId, formData);
      } else {
        await adminAPI.createProduct(formData);
      }
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#22D3EE] text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Zap className="w-3.5 h-3.5 text-[#00FFC6]" />
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
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0A84FF] hover:shadow-neon-glow text-white font-bold text-xs flex items-center gap-2 transition duration-200 shrink-0 shadow-lg"
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
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#334155]/80 bg-[#0F172A] text-[#E2E8F0] placeholder-slate-500 text-xs focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]"
        />
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0EA5E9]" />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#131B2E] to-[#0F172A] rounded-2xl border border-[#334155]/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F1A]/80 text-[#C0C7D1] uppercase tracking-wider font-semibold border-b border-[#334155]/60">
                <tr>
                  <th className="px-5 py-3.5">Project</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Pricing</th>
                  <th className="px-5 py-3.5">Featured</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/40 text-[#E2E8F0]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1E293B]/40 transition">
                    <td className="px-5 py-3.5 font-bold">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80'}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#334155]"
                        />
                        <div className="overflow-hidden">
                          <p className="truncate max-w-[220px] font-bold text-[#E2E8F0]">{p.title}</p>
                          <span className="text-[10px] text-[#C0C7D1]/50 font-mono">/{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#C0C7D1]">{p.category?.name || '—'}</td>
                    <td className="px-5 py-3.5 font-bold">
                      {p.isFree ? (
                        <span className="text-[#00FFC6] font-extrabold font-mono">FREE</span>
                      ) : (
                        <span className="font-mono text-[#E2E8F0]">${Number(p.price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                          p.isFeatured
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-[#1E293B] text-[#C0C7D1]/50 hover:text-[#C0C7D1]'
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
                        className="inline-block p-1.5 rounded-lg text-slate-400 hover:text-[#22D3EE] hover:bg-[#1E293B]"
                        title="Preview Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0EA5E9] hover:bg-[#1E293B]"
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
          <div className="bg-gradient-to-b from-[#131B2E] to-[#0B0F1A] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#334155] my-8 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60 mb-5">
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
                  className="w-full px-3 py-2 rounded-xl border border-[#334155]/80 bg-[#0F172A] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#C0C7D1] mb-1">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#334155]/80 text-xs focus:outline-none focus:border-[#0EA5E9] bg-[#0F172A] text-[#E2E8F0]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
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
                    className="w-full px-3 py-2 rounded-xl border border-[#334155]/80 text-xs focus:outline-none focus:border-[#0EA5E9] bg-[#0F172A] text-[#E2E8F0]"
                  >
                    <option value="FULL_APPLICATION">Full Application</option>
                    <option value="TEMPLATE">Template / Boilerplate</option>
                    <option value="RESOURCE">Resource / Toolkit</option>
                    <option value="PLUGIN">Plugin / Module</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-[#0B0F1A]/70 rounded-xl border border-[#334155]/60">
                <div>
                  <label className="block font-semibold text-[#C0C7D1] mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    disabled={formData.isFree}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#334155] bg-[#0F172A] text-[#E2E8F0] font-mono text-xs disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={formData.isFree}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isFree: e.target.checked,
                        price: e.target.checked ? 0 : formData.price,
                      })
                    }
                    className="rounded text-[#0EA5E9] w-4 h-4 bg-[#0F172A] border-[#334155]"
                  />
                  <label htmlFor="isFree" className="font-semibold text-[#E2E8F0]">
                    Is Free Project
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="downloadAllowed"
                    checked={formData.downloadAllowed}
                    onChange={(e) => setFormData({ ...formData, downloadAllowed: e.target.checked })}
                    className="rounded text-[#0EA5E9] w-4 h-4 bg-[#0F172A] border-[#334155]"
                  />
                  <label htmlFor="downloadAllowed" className="font-semibold text-[#E2E8F0]">
                    Enable Download
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
                  className="w-full px-3 py-2 rounded-xl border border-[#334155]/80 bg-[#0F172A] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#0EA5E9]"
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
                  className="w-full px-3 py-2 rounded-xl border border-[#334155]/80 bg-[#0F172A] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#C0C7D1] mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-[#334155]/80 bg-[#0F172A] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#C0C7D1] mb-1">Live Interactive Demo URL</label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://demo..."
                    className="w-full px-3 py-2 rounded-xl border border-[#334155]/80 bg-[#0F172A] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              {/* Technologies Checkboxes */}
              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1.5">Technologies Used</label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-[#0B0F1A]/70 rounded-xl border border-[#334155]/60 max-h-28 overflow-y-auto">
                  {technologies.map((t) => {
                    const isSelected = formData.technologyIds.includes(t.id);
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => toggleTech(t.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                          isSelected
                            ? 'bg-[#0EA5E9] text-white shadow-sm'
                            : 'bg-[#1E293B] border border-[#334155] text-slate-300 hover:text-white'
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#334155]/60">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#334155] font-semibold text-slate-300 hover:bg-[#1E293B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0A84FF] hover:shadow-neon-glow text-white font-semibold shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
