import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  FolderCode,
  Layers,
  Sparkles,
  ChevronDown,
  Search,
  Zap,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-xs font-semibold uppercase tracking-wider transition-all duration-200 py-1.5 px-3.5 rounded-xl ${
      isActive
        ? 'text-white bg-[#9333EA]/25 border border-[#A855F7]/50 shadow-purple-glow'
        : 'text-[#C4B5FD] hover:text-white hover:bg-[#1E173E]/70'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0713]/95 backdrop-blur-2xl border-b border-[#322659]/80 shadow-2xl py-2.5'
          : 'bg-[#0A0713]/85 backdrop-blur-xl border-b border-[#322659]/50 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with aspect ratio maintained & glowing purple harbor halo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#C084FC] opacity-40 blur-md group-hover:opacity-85 transition duration-500" />
              <img
                src="/logo.png"
                alt="CoderHarbor Logo"
                className="relative h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation Pill Dock */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#140F28]/90 p-1.5 rounded-2xl border border-[#322659]/80 shadow-lg backdrop-blur-xl">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/projects" className={navLinkClass}>
              Explore
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              Categories
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Right Status Beacon & Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Harbor Beacon Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0713] border border-[#322659] text-[11px] font-mono text-[#C084FC]">
              <span className="w-2 h-2 rounded-full bg-[#9333EA] animate-pulse" />
              <span className="text-white font-bold tracking-wider">REGISTRY ONLINE</span>
            </div>

            {/* Quick Explore Link */}
            <Link
              to="/projects"
              className="p-2 rounded-xl text-[#C4B5FD] hover:text-white hover:bg-[#1E173E]/70 border border-transparent hover:border-[#322659] transition"
              title="Search Projects"
            >
              <Search className="w-4 h-4" />
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-[#322659] hover:border-[#A855F7]/60 transition bg-[#140F28] text-xs font-semibold text-white shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#9333EA] to-[#C084FC] text-white flex items-center justify-center font-black text-[11px] shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate text-white font-bold">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#C4B5FD]" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#140F28] shadow-2xl border border-[#322659] py-2 animate-fadeIn z-50 text-left text-xs"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-[#322659]/70">
                      <p className="text-[10px] text-[#C4B5FD] font-semibold uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#9333EA]/20 text-[#C084FC] border border-[#A855F7]/30">
                        {user?.role}
                      </span>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-[#1E173E] transition"
                      >
                        <ShieldAlert className="w-4 h-4 text-[#C084FC]" />
                        <span>Admin Console</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/customer/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-[#1E173E] transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#C084FC]" />
                          <span>Customer Dashboard</span>
                        </Link>
                        <Link
                          to="/customer/projects"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-[#1E173E] transition"
                        >
                          <FolderCode className="w-4 h-4 text-[#A855F7]" />
                          <span>My Projects</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-[#322659]/70 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-950/40 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#C4B5FD] hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#7C3AED] hover:brightness-110 shadow-purple-glow transition duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-200 hover:bg-[#1E173E] transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#322659]/70 bg-[#0A0713] px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col space-y-1.5 text-xs font-semibold">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-slate-200 hover:bg-[#1E173E] hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-slate-200 hover:bg-[#1E173E] hover:text-white"
            >
              Explore Projects
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-slate-200 hover:bg-[#1E173E] hover:text-white"
            >
              Categories
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-slate-200 hover:bg-[#1E173E] hover:text-white"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-slate-200 hover:bg-[#1E173E] hover:text-white"
            >
              Contact
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#322659]/70 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/customer/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#7C3AED] text-white font-bold text-center text-xs shadow-purple-glow"
                >
                  {isAdmin ? 'Admin Console' : 'Customer Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-rose-400 text-xs font-bold text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#322659] text-white text-center text-xs font-bold"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#7C3AED] text-white text-center text-xs font-bold shadow-purple-glow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
