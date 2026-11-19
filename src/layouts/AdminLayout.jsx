import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminPortalAPI } from '../services/api';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  FileCheck2,
  CheckSquare,
  Terminal,
  Bell,
  BarChart3,
  Settings,
  UserCheck,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  UserPlus,
  Cpu,
  PlusCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  ShoppingBag,
  LifeBuoy,
  Layers,
  FolderArchive,
  Store,
  Tag,
  Briefcase,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeesMenuOpen, setEmployeesMenuOpen] = useState(true);
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(true);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await adminPortalAPI.getNotifications();
        if (res.success && res.notifications) {
          const unread = res.notifications.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (e) {}
    };
    fetchNotifs();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-extrabold shadow-purple-glow'
        : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
    }`;

  const subNavItemClass = ({ isActive }) =>
    `flex items-center gap-2 pl-9 pr-3.5 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
      isActive
        ? 'text-[#C084FC] font-bold bg-[#A855F7]/15'
        : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/60'
    }`;

  return (
    <div className="min-h-screen bg-[#070A12] text-[#E2E8F0] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0F172A] border-b border-[#334155] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src="/image.png" alt="CoderHarbor" className="h-8 w-auto brightness-125" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            Admin Console
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/admin/notifications" className="relative p-2 rounded-xl text-slate-300 hover:bg-[#1E293B]">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-300 hover:bg-[#1E293B]"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#0F172A] border-r border-[#334155]/80 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Logo & Super Admin Badge */}
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
            <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Admin Workspace</p>
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>

          {/* Simplified Core Navigation */}
          <nav className="p-3 space-y-1.5">
            {/* 1. Dashboard */}
            <NavLink
              to="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Dashboard</span>
            </NavLink>

            {/* 2. Employee Workspace (Employee details all in one place) */}
            <NavLink
              to="/admin/employees"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <Users className="w-4 h-4 shrink-0 text-cyan-400" />
              <div className="flex items-center justify-between flex-1">
                <span>Employee Hub</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Staff
                </span>
              </div>
            </NavLink>

            {/* 3. Employee Submissions & Output Screen Reviews */}
            <NavLink
              to="/admin/project-reviews"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <FileCheck2 className="w-4 h-4 shrink-0 text-[#00FFC6]" />
              <div className="flex items-center justify-between flex-1">
                <span>Employee Submissions</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#00FFC6]/15 text-[#00FFC6] border border-[#00FFC6]/30">
                  Output
                </span>
              </div>
            </NavLink>

            {/* 4. Customer Projects & Upload (All customer project upload work in one place) */}
            <NavLink
              to="/admin/projects"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <Package className="w-4 h-4 shrink-0 text-emerald-400" />
              <div className="flex items-center justify-between flex-1">
                <span>Customer Projects & Upload</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Upload
                </span>
              </div>
            </NavLink>

            {/* 5. Customer Orders & Support */}
            <NavLink
              to="/admin/orders"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <ShoppingBag className="w-4 h-4 shrink-0 text-amber-400" />
              <div className="flex items-center justify-between flex-1">
                <span>Customer Orders & Support</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Clients
                </span>
              </div>
            </NavLink>

            {/* 6. System Settings & Profile */}
            <NavLink
              to="/admin/settings"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <Settings className="w-4 h-4 shrink-0 text-slate-400" />
              <div className="flex items-center justify-between flex-1">
                <span>Settings & Profile</span>
                {unreadCount > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-400 text-black">
                    {unreadCount}
                  </span>
                )}
              </div>
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#334155]/60 space-y-2">
          <Link
            to="/projects"
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
