import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Cpu, Plus, Trash2, Loader2, Zap, X } from 'lucide-react';

export const AdminTechnologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTechName, setNewTechName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotice = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  useEffect(() => {
    fetchTech();
  }, []);

  const fetchTech = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getTechnologies();
      if (res.technologies) setTechnologies(res.technologies);
    } catch (err) {
      console.error('Failed to load technologies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTechName.trim()) return;

    try {
      setSubmitting(true);
      await adminAPI.createTechnology({ name: newTechName });
      setNewTechName('');
      showNotice('Technology added successfully.', 'success');
      fetchTech();
    } catch (err) {
      showNotice(err.message || 'Error creating technology', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (t) => {
    setDeleteConfirm({ id: t.id, name: t.name });
  };

  const confirmDeleteNow = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await adminAPI.deleteTechnology(deleteConfirm.id);
      showNotice(`Technology "${deleteConfirm.name}" deleted successfully.`, 'success');
      setDeleteConfirm(null);
      fetchTech();
    } catch (err) {
      showNotice(err.message || 'Error deleting technology', 'error');
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-medium border animate-fadeIn ${
            notification.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[11px] font-semibold tracking-wider uppercase mb-2">
          <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
          Stack Tags & Ecosystem Registry
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
          Technology Management
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
          Define frameworks, databases, and programming languages for project tagging and marketplace filtering.
        </p>
      </div>

      {/* Add new inline form */}
      <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] p-5 rounded-2xl border border-[#322659]/60 shadow-xl">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="text"
            required
            value={newTechName}
            onChange={(e) => setNewTechName(e.target.value)}
            placeholder="Add technology (e.g. Next.js 15, Prisma, PyTorch)..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] placeholder-slate-500 text-xs focus:outline-none focus:border-[#A855F7]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#0A84FF] hover:shadow-purple-glow text-white font-bold text-xs transition duration-200 flex items-center justify-center gap-1.5 shrink-0 shadow-lg disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Technology</span>
          </button>
        </form>
      </div>

      {/* Tech Grid */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#A855F7]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {technologies.map((t) => (
            <div
              key={t.id}
              className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] p-4 rounded-xl border border-[#322659]/60 shadow-lg flex items-center justify-between gap-2 hover:border-[#A855F7]/50 transition"
            >
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-[#E2E8F0] truncate">{t.name}</p>
                <p className="text-[10px] text-[#A855F7] font-mono">/{t.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(t)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded transition hover:bg-rose-500/10 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* In-Page Confirmation Modal for Deletion (No native browser popups) */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0E0A1C] border border-[#322659] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Delete Technology Tag</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete <span className="font-bold text-white font-mono bg-[#140F28] px-2 py-0.5 rounded border border-[#322659]">"{deleteConfirm.name}"</span>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-[#140F28] hover:bg-[#1C1636] border border-[#322659] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteNow}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition flex items-center gap-1.5 shadow-lg shadow-rose-950/40 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Tag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
