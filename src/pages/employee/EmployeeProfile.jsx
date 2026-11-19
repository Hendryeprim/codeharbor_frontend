import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../services/api';
import { User, ShieldAlert, Code2, Mail, Building2, Briefcase, Calendar, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

export const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editable fields
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await employeeAPI.getProfile();
      if (res.success && res.profile) {
        setProfile(res.profile);
        setPhone(res.profile.phone || '');
        setCompany(res.profile.company || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      setSaving(true);
      const res = await employeeAPI.updateProfile({ phone, company });
      if (res.success) {
        setSuccess('Profile details updated successfully.');
        fetchProfile();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00FFC6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <User className="w-6 h-6 text-[#00FFC6]" />
          <span>Employee Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Corporate credentials, technical specialization, and contact preferences.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Corporate Identity & Admin Controlled Fields (Read-Only) */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Corporate Identity (Admin-Controlled & Read-Only)</span>
          </h2>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Managed By Admin
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Employee ID</p>
            <p className="text-base font-black text-white mt-0.5">{profile?.employeeId}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Primary Skill (Read-Only)</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Code2 className="w-4 h-4 text-[#00FFC6]" />
              <span className="font-black text-[#00FFC6] text-base">{profile?.primarySkill}</span>
            </div>
            <p className="text-[9px] text-slate-500 mt-1 italic">
              Assigned by Admin • Employee cannot modify
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Department</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-white text-sm">{profile?.department}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Designation</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-white text-sm">{profile?.designation}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Corporate Email</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-200 truncate">{profile?.email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Joining Date</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-200">
                {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Contact Information */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
        <h2 className="text-base font-black text-white">Contact & Personal Details</h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#00FFC6]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Work Unit / Office</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="CoderHarbor Labs"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#00FFC6]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black hover:brightness-110 shadow-neon-glow"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
