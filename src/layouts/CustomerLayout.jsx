import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderCode,
  ShoppingBag,
  Download,
  LifeBuoy,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Bot,
  Sparkles,
} from 'lucide-react';

export const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] shadow-neon-glow font-bold'
        : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
    }`;

  const navItems = [
    { label: 'Overview', to: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'My Projects', to: '/customer/projects', icon: FolderCode },
    { label: 'My Orders', to: '/customer/orders', icon: ShoppingBag },
    { label: 'Download Center', to: '/customer/downloads', icon: Download },
    { label: 'Support Requests', to: '/customer/support', icon: LifeBuoy },
    { label: 'My Profile', to: '/customer/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E2E8F0] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0F172A] border-b border-[#334155] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <img src="/image.png" alt="CoderHarbor" className="h-8 w-auto" />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-slate-300 hover:bg-[#1E293B]"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#0F172A] border-r border-[#334155]/80 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-[#334155]/60 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/image.png" alt="CoderHarbor" className="h-9 w-auto" />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info snippet */}
          <div className="px-5 py-4 border-b border-[#334155]/60 bg-[#131B2E]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] flex items-center justify-center font-black text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-[#00FFC6] font-mono font-bold bg-[#00FFC6]/10 px-2 py-0.5 rounded border border-[#00FFC6]/30 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Customer Account</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={navItemClass}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer of Sidebar */}
        <div className="p-4 border-t border-[#334155]/60 space-y-2">
          <Link
            to="/projects"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#131B2E] border border-[#334155] hover:border-[#22D3EE] transition"
          >
            <span>Explore Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#00FFC6]" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
