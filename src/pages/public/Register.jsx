import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Building, Phone, UserPlus, AlertCircle, Sparkles } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        phone: formData.phone,
      });
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#E2E8F0]">
      <div className="max-w-md w-full space-y-6 bg-[#131B2E]/90 p-8 sm:p-10 rounded-3xl border border-[#334155]/80 shadow-harbor-lg backdrop-blur-xl">
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <div className="relative inline-block">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] opacity-30 blur-sm" />
              <img src="/image.png" alt="CoderHarbor" className="relative h-12 w-auto mx-auto object-contain" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-white">
            Create Developer Account
          </h2>
          <p className="text-xs text-[#C0C7D1] mt-1">
            Join the harbor to access free developer kits and AI architecture tools.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Sarah Connor"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 chars"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Confirm</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Company (Optional)</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Tech Labs Ltd"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Phone (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 012"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 pt-1">
            By registering, you agree to our{' '}
            <Link to="/terms" className="text-[#00FFC6] hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#00FFC6] hover:underline">
              Privacy Policy
            </Link>.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] via-[#22D3EE] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs uppercase tracking-wider shadow-neon-glow transition hover:brightness-110 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#00FFC6] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
