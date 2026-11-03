import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Mail, Lock, LogIn, AlertCircle, Terminal, Bot } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
      <div className="max-w-md w-full space-y-6 bg-[#131B2E]/95 border border-[#334155] p-8 sm:p-10 rounded-3xl shadow-harbor-lg backdrop-blur-xl">
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <div className="relative inline-block">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] opacity-30 blur-sm" />
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
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22D3EE]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@coderharbor.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Master Password</label>
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
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs uppercase tracking-wider shadow-neon-glow hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-400 hover:text-[#00FFC6] transition">
            ← Return to Public Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};
