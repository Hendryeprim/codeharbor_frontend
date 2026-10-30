import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck, UserCheck, KeyRound, Sparkles } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (data.user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const autofill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#E2E8F0]">
      <div className="max-w-md w-full space-y-7 bg-[#131B2E]/90 p-8 sm:p-10 rounded-3xl border border-[#334155]/80 shadow-harbor-lg backdrop-blur-xl">
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <div className="relative inline-block">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] opacity-30 blur-sm" />
              <img src="/image.png" alt="CoderHarbor" className="relative h-12 w-auto mx-auto object-contain" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-white">
            Welcome Back to CoderHarbor
          </h2>
          <p className="text-xs text-[#C0C7D1] mt-1">
            Access your authorized codebases, AI blueprints, and workspace.
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
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-300">Password</label>
              <Link to="/contact" className="text-xs text-[#22D3EE] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] via-[#22D3EE] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs uppercase tracking-wider shadow-neon-glow transition hover:brightness-110 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Autofill Box */}
        <div className="pt-4 border-t border-[#334155]/60 space-y-2">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick 1-Click Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => autofill('alex@example.com', 'Customer@12345')}
              className="px-3 py-2 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-[#00FFC6] text-[11px] font-bold text-[#00FFC6] text-center transition flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => autofill('admin@coderharbor.com', 'Admin@12345')}
              className="px-3 py-2 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-amber-400 text-[11px] font-bold text-amber-400 text-center transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#00FFC6] hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
