import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  UploadCloud,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Code2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const EmployeeLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await employeeAPI.getNotifications();
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
    navigate('/employee/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black shadow-neon-glow'
        : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
    }`;

  const subNavItemClass = ({ isActive }) =>
    `flex items-center gap-2 pl-9 pr-3.5 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
      isActive
        ? 'text-[#00FFC6] font-bold bg-[#00FFC6]/10'
        : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/60'
    }`;

  return (
    <div className="min-h-screen bg-[#070A12] text-[#E2E8F0] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0F172A] border-b border-[#334155] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link to="/employee/dashboard" className="flex items-center gap-2">
          <img src="/image.png" alt="CoderHarbor" className="h-8 w-auto brightness-125" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00FFC6] bg-[#00FFC6]/10 px-2 py-0.5 rounded border border-[#00FFC6]/30">
            Employee Portal
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/employee/notifications" className="relative p-2 rounded-xl text-slate-300 hover:bg-[#1E293B]">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
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

      {/* Employee Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#0F172A] border-r border-[#334155]/80 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Logo & Portal Badge */}
          <div className="p-5 border-b border-[#334155]/60 flex items-center justify-between">
            <Link to="/employee/dashboard" className="flex items-center gap-2.5">
              <img src="/image.png" alt="CoderHarbor" className="h-9 w-auto brightness-110" />
            </Link>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#0EA5E9]/15 text-[#00FFC6] border border-[#00FFC6]/30 px-2.5 py-0.5 rounded-full">
              Engineer
            </span>
          </div>

          {/* Employee Profile Preview (Read Only Primary Skill) */}
          <div className="px-5 py-3 border-b border-[#334155]/60 bg-[#131B2E]/60">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400">
                {user?.employeeProfile?.employeeId || 'EMP'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                {user?.employeeProfile?.primarySkill || 'Developer'}
              </span>
            </div>
            <p className="text-xs font-bold text-white mt-1 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.employeeProfile?.designation || 'Software Engineer'}</p>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {/* Dashboard */}
            <NavLink
              to="/employee/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </NavLink>

            {/* My Projects */}
            <NavLink
              to="/employee/projects"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <FolderGit2 className="w-4 h-4 shrink-0 text-[#00FFC6]" />
              <span>My Projects</span>
            </NavLink>

            {/* My Submissions & Output Screens */}
            <NavLink
              to="/employee/submissions"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <UploadCloud className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>My Submissions & Outputs</span>
            </NavLink>

            {/* Notifications */}
            <NavLink
              to="/employee/notifications"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <div className="relative flex items-center gap-3 w-full">
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-400 text-black">
                    {unreadCount}
                  </span>
                )}
              </div>
            </NavLink>

            {/* My Profile */}
            <NavLink
              to="/employee/profile"
              onClick={() => setSidebarOpen(false)}
              className={navItemClass}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>My Profile</span>
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#334155]/60 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Workspace</span>
          </button>
        </div>
      </aside>

      {/* Main Employee Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
