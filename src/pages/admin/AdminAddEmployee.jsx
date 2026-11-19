import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminPortalAPI } from '../../services/api';
import { UserPlus, ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, Lock, Code2, Eye, EyeOff } from 'lucide-react';

export const AdminAddEmployee = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Development',
    designation: '',
    primarySkill: 'Python',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const primarySkillsList = [
    'Python',
    'Java',
    'SQL',
    'Database',
    'Data Analyst',
    'Django',
    'Flask',
    'FastAPI',
    'React',
    'Node.js',
    'Full Stack',
    'Machine Learning',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminPortalAPI.createEmployee(formData);
      if (res.success) {
        setSuccess(res.message || 'Employee created successfully!');
        setTimeout(() => {
          navigate('/admin/employees');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to create employee account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/employees"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-[#A855F7]" />
            <span>Add New Technical Employee</span>
          </h1>
          <p className="text-xs text-slate-400">
            Create employee credentials and lock their technical Primary Skill into their corporate profile.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Creation Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A] border border-[#334155] shadow-harbor-sm">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300 text-[11px]">
            <Lock className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold">Administrative Skill Control Policy</p>
              <p className="text-amber-300/80 mt-0.5">
                The Primary Skill assigned here is stored in the Employee Profile and is permanently read-only for the employee. It auto-loads when assigning projects.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Employee ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="e.g. EMP001"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7] font-mono"
              />
            </div>

            {/* Employee Name */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Corporate Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@coderharbor.com"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            {/* Primary Skill */}
            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Primary Skill (Admin Assigned) <span className="text-rose-400">*</span></span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">Admin-Only</span>
              </label>
              <select
                name="primarySkill"
                value={formData.primarySkill}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-cyan-500/50 bg-[#0B0F1A] text-[#00FFC6] font-bold focus:outline-none focus:border-[#A855F7]"
              >
                {primarySkillsList.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Department <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Development, Engineering, AI Labs"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Designation <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Python Developer, Fullstack Engineer"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Account Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-10 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-10 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Joining Date */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Account Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="DISABLED">DISABLED</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Link
              to="/admin/employees"
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black uppercase tracking-wider hover:brightness-110 transition shadow-purple-glow flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submitting ? 'Creating Employee Account...' : 'Create Employee Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
