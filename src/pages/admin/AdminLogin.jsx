import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@coderharbor.com');
  const [password, setPassword] = useState('CoderHarbor@2026#Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (e, pwd = 'CoderHarbor@2026#Admin') => {
    e.preventDefault();
    setEmail('admin@coderharbor.com');
    setPassword(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await login(email, password);
      if (data.user?.role !== 'ADMIN') {
        setError('Access denied. Administrator privileges are required.');
        return;
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#E2E8F0]">
      <div className="max-w-md w-full space-y-6 bg-[#140F28]/95 border border-[#322659] p-8 sm:p-10 rounded-3xl shadow-harbor-lg backdrop-blur-xl">
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <div className="relative inline-block">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#A855F7] to-[#C084FC] opacity-30 blur-sm" />
              <img src="/image.png" alt="CoderHarbor" className="relative h-12 w-auto mx-auto object-contain" />
            </div>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Staff Administration Console</span>
          </div>
          <h2 className="text-2xl font-black text-white">Admin Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted access portal for CoderHarbor platform operators.
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
            <label className="block font-bold text-slate-300 mb-1">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A855F7]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@coderharbor.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#322659] bg-[#0A0713] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Master Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A855F7]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#322659] bg-[#0A0713] text-white focus:outline-none focus:border-[#A855F7]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Helper */}
          <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-300 flex items-center gap-1">
                <KeyRound className="w-3 h-3" /> Default Credentials:
              </span>
              <button
                type="button"
                onClick={(e) => handleQuickFill(e, 'CoderHarbor@2026#Admin')}
                className="text-[10px] text-[#C084FC] hover:underline font-bold"
              >
                Auto-Fill
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Email: <span className="text-slate-200">admin@coderharbor.com</span>
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Password: <span className="text-slate-200">CoderHarbor@2026#Admin</span> or <span className="text-slate-200">Admin@123</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-extrabold text-xs uppercase tracking-wider shadow-purple-glow hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-400 hover:text-[#C084FC] transition">
            ← Return to Public Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};
