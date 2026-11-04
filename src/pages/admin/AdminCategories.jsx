import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Layers, Plus, Edit2, Trash2, Loader2, X, Zap } from 'lucide-react';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCategories();
      if (res.categories) setCategories(res.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await adminAPI.updateCategory(editingId, { name, description });
      } else {
        await adminAPI.createCategory({ name, description });
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Error saving category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await adminAPI.deleteCategory(c.id);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Error deleting category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
            Software Classification Taxonomy
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
            Organize digital project categories and vertical hierarchies.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#0A84FF] hover:shadow-purple-glow text-white font-bold text-xs flex items-center gap-2 transition duration-200 shrink-0 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

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
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Slug Identifier</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Projects</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#322659]/40 text-[#E2E8F0]">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1C1636]/40 transition">
                    <td className="px-6 py-4 font-bold text-[#E2E8F0]">{c.name}</td>
                    <td className="px-6 py-4 font-mono text-[#A855F7] text-[11px]">{c.slug}</td>
                    <td className="px-6 py-4 text-[#C0C7D1]/70 max-w-sm truncate">{c.description || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/30">
                        {c._count?.products ?? 0} projects
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#A855F7] hover:bg-[#1C1636]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-gradient-to-b from-[#140F28] to-[#0A0713] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#322659] relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#322659]/60 mb-4">
              <h3 className="text-base font-bold text-[#E2E8F0]">
                {editingId ? 'Edit Category Taxonomy' : 'Create Category Taxonomy'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & ML"
                  className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of projects in this category..."
                  className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#322659]/60">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#322659] font-semibold text-slate-300 hover:bg-[#1C1636]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#0A84FF] hover:shadow-purple-glow text-white font-semibold transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
