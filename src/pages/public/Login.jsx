import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

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
        navigate('/projects', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#E2E8F0]">
      <div className="max-w-md w-full space-y-7 bg-[#140F28]/90 p-8 sm:p-10 rounded-3xl border border-[#322659]/80 shadow-harbor-lg backdrop-blur-xl">
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <div className="relative inline-block">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#C084FC] opacity-30 blur-sm" />
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
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A855F7]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#322659] bg-[#0A0713] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-300">Password</label>
              <Link to="/contact" className="text-xs text-[#A855F7] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A855F7]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#322659] bg-[#0A0713] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#7C3AED] text-white font-extrabold text-xs uppercase tracking-wider shadow-purple-glow transition hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials Helper */}
        <div className="p-3 rounded-2xl bg-[#0E0A1C] border border-[#322659]/80 text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[#C084FC] font-bold">Admin Credentials:</span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@coderharbor.com');
                setPassword('Admin@12345');
              }}
              className="text-[#A855F7] hover:underline cursor-pointer font-bold"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-slate-400">admin@coderharbor.com / Admin@12345</div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#C084FC] hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
