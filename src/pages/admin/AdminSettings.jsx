import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Settings, Save, CheckCircle2, AlertCircle, Loader2, Zap } from 'lucide-react';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    site_title: '',
    site_tagline: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    purchasing_notice: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSettings();
      if (res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      for (const [key, value] of Object.entries(settings)) {
        await adminAPI.updateSetting(key, value);
      }
      setSuccess('Website settings saved successfully!');
    } catch (err) {
      setError(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#A855F7]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[11px] font-semibold tracking-wider uppercase mb-2">
          <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
          Platform Configuration & Metadata
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
          Platform Website Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
          Configure brand identifiers, support contacts, and public purchasing status notices.
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] rounded-2xl p-6 sm:p-8 border border-[#322659]/60 shadow-xl relative overflow-hidden">
        {success && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-[#C0C7D1] mb-1.5">Website Title</label>
            <input
              type="text"
              value={settings.site_title || ''}
              onChange={(e) => handleChange('site_title', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] focus:outline-none focus:border-[#A855F7]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#C0C7D1] mb-1.5">Brand Tagline</label>
            <input
              type="text"
              value={settings.site_tagline || ''}
              onChange={(e) => handleChange('site_tagline', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] focus:outline-none focus:border-[#A855F7]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#C0C7D1] mb-1.5">Support Contact Email</label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] focus:outline-none focus:border-[#A855F7]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#C0C7D1] mb-1.5">Official Contact Phone</label>
              <input
                type="text"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] focus:outline-none focus:border-[#A855F7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#C0C7D1] mb-1.5">Physical Address</label>
            <input
              type="text"
              value={settings.contact_address || ''}
              onChange={(e) => handleChange('contact_address', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] focus:outline-none focus:border-[#A855F7]"
            />
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <label className="block font-semibold text-amber-300 mb-1.5">Public Purchasing Notice</label>
            <textarea
              rows={2}
              value={settings.purchasing_notice || ''}
              onChange={(e) => handleChange('purchasing_notice', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-amber-500/40 bg-[#0A0713] text-[#E2E8F0] focus:outline-none focus:border-amber-400"
            />
            <p className="text-[11px] text-amber-300/80 mt-1">
              Displayed prominently to customers on product pages and checkout modals while payment processing is in Coming Soon status.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#0A84FF] hover:shadow-purple-glow text-white font-bold text-xs transition duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
