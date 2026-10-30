import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Cpu,
  Users,
  ShoppingBag,
  FolderArchive,
  LifeBuoy,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  Bot,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-extrabold shadow-neon-glow'
        : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
    }`;

  const adminNavItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects', to: '/admin/projects', icon: Package },
    { label: 'Categories', to: '/admin/categories', icon: Layers },
    { label: 'Technologies', to: '/admin/technologies', icon: Cpu },
    { label: 'Customers', to: '/admin/customers', icon: Users },
    { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
    { label: 'File Manager', to: '/admin/files', icon: FolderArchive },
    { label: 'Support Desk', to: '/admin/support', icon: LifeBuoy },
    { label: 'Website Settings', to: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E2E8F0] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0F172A] border-b border-[#334155] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src="/image.png" alt="CoderHarbor" className="h-8 w-auto brightness-125" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-slate-300 hover:bg-[#1E293B]"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#0F172A] border-r border-[#334155]/80 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Logo & Admin Badge */}
          <div className="p-5 border-b border-[#334155]/60 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <img src="/image.png" alt="CoderHarbor" className="h-9 w-auto brightness-110" />
            </Link>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Super Admin
            </span>
          </div>

          {/* Admin User Info */}
          <div className="px-5 py-3 border-b border-[#334155]/60 bg-[#131B2E]/60">
            <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Logged in as Administrator</p>
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>

          {/* Nav */}
          <nav className="p-3 space-y-1">
            {adminNavItems.map((item) => {
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

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#334155]/60 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#131B2E] border border-[#334155] hover:border-[#00FFC6] transition"
          >
            <span>Live Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#00FFC6]" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
