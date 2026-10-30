import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { customerAPI } from '../../services/api';
import { User, Mail, Phone, Building, Lock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export const CustomerProfile = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [company, setCompany] = useState(user?.company || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');

    try {
      const payload = { name, phone, company };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await customerAPI.updateProfile(payload);
      if (res.success) {
        setSuccess('Profile credentials updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#22D3EE] text-[11px] font-semibold tracking-wider uppercase mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Identity & Security Matrix
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
          Account Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
          Manage your verified developer credentials, workspace company details, and authentication keys.
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#131B2E] to-[#0F172A] rounded-2xl p-6 sm:p-8 border border-[#334155]/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />

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

        <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-[#C0C7D1] mb-1.5">
              Verified Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155]/60 bg-[#0B0F1A]/80 text-[#C0C7D1]/60 text-xs font-medium cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-[#C0C7D1]/50 mt-1.5">
              Email identifier is locked to enforce licensing authorization and access control.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#C0C7D1] mb-1.5">
              Developer / Organization Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155]/80 bg-[#0B0F1A]/90 text-[#E2E8F0] text-xs focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#C0C7D1] mb-1.5">
                Company / Studio
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. CyberWave Labs"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155]/80 bg-[#0B0F1A]/90 text-[#E2E8F0] placeholder-slate-500 text-xs focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C0C7D1] mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155]/80 bg-[#0B0F1A]/90 text-[#E2E8F0] placeholder-slate-500 text-xs focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition"
                />
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="pt-6 border-t border-[#334155]/60 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
                Update Password Key
              </h3>
              <p className="text-[11px] text-[#C0C7D1]/60 mt-0.5">
                Leave blank if you do not want to alter your master password.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#C0C7D1] mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155]/80 bg-[#0B0F1A]/90 text-[#E2E8F0] placeholder-slate-600 text-xs focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C0C7D1] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155]/80 bg-[#0B0F1A]/90 text-[#E2E8F0] placeholder-slate-600 text-xs focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0A84FF] hover:shadow-neon-glow text-white font-semibold text-xs transition duration-200 shadow-md disabled:opacity-50"
            >
              {submitting ? 'Encrypting & Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
