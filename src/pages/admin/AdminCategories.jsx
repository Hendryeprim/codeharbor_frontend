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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#22D3EE] text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Zap className="w-3.5 h-3.5 text-[#00FFC6]" />
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
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0A84FF] hover:shadow-neon-glow text-white font-bold text-xs flex items-center gap-2 transition duration-200 shrink-0 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

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
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Slug Identifier</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Projects</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/40 text-[#E2E8F0]">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1E293B]/40 transition">
                    <td className="px-6 py-4 font-bold text-[#E2E8F0]">{c.name}</td>
                    <td className="px-6 py-4 font-mono text-[#22D3EE] text-[11px]">{c.slug}</td>
                    <td className="px-6 py-4 text-[#C0C7D1]/70 max-w-sm truncate">{c.description || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0EA5E9]/15 text-[#22D3EE] border border-[#0EA5E9]/30">
                        {c._count?.products ?? 0} projects
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0EA5E9] hover:bg-[#1E293B]"
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
          <div className="bg-gradient-to-b from-[#131B2E] to-[#0B0F1A] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#334155] relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60 mb-4">
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
                  className="w-full px-3 py-2 rounded-xl border border-[#334155]/80 bg-[#0F172A] text-[#E2E8F0] focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#C0C7D1] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of projects in this category..."
                  className="w-full px-3 py-2 rounded-xl border border-[#334155]/80 bg-[#0F172A] text-[#E2E8F0] focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#334155]/60">
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0A84FF] hover:shadow-neon-glow text-white font-semibold transition disabled:opacity-50"
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
