import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminPortalAPI, adminAPI } from '../../services/api';
import { LivePreviewModal } from '../../components/common/LivePreviewModal';
import {
  Users,
  UserCheck,
  FolderGit2,
  Clock,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart,
  Code2,
  Play,
  Calendar,
  Layers,
  ShoppingBag,
  LifeBuoy,
  Package,
  Store,
  ExternalLink,
  ShieldCheck,
  Tag,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees'); // 'employees' | 'customers'
  const [employeeData, setEmployeeData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Live Output Screen Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const openPreview = (url, title) => {
    if (!url) return;
    setActivePreviewUrl(url);
    setPreviewTitle(title || 'Live Project Output');
    setPreviewModalOpen(true);
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const [empRes, custRes] = await Promise.allSettled([
        adminPortalAPI.getDashboard(),
        adminAPI.getMarketplaceDashboard(),
      ]);

      if (empRes.status === 'fulfilled' && empRes.value.success) {
        setEmployeeData(empRes.value);
      }
      if (custRes.status === 'fulfilled' && custRes.value.success) {
        setCustomerData(custRes.value);
      }
    } catch (err) {
      setError(err.message || 'Failed to load executive dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#A855F7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  // Employee Platform data
  const empCards = employeeData?.cards || {};
  const recentProjects = employeeData?.recentProjects || [];
  const recentSubmissions = employeeData?.recentSubmissions || [];
  const charts = employeeData?.charts || {};

  const employeeStatCards = [
    { label: 'Total Employees', value: empCards.totalEmployees || 0, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Active Employees', value: empCards.activeEmployees || 0, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Total Projects', value: empCards.totalProjects || 0, icon: FolderGit2, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Assigned Projects', value: empCards.assignedProjects || 0, icon: Layers, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Projects In Progress', value: empCards.projectsInProgress || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Pending Reviews', value: empCards.pendingReviews || 0, icon: FileCheck2, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Revision Required', value: empCards.revisionRequired || 0, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { label: 'Approved Projects', value: empCards.approvedProjects || 0, icon: CheckCircle2, color: 'text-[#00FFC6]', bg: 'bg-[#00FFC6]/10 border-[#00FFC6]/20' },
    { label: 'Failed Executions', value: empCards.failedExecutions || 0, icon: Terminal, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Overdue Projects', value: empCards.overdueProjects || 0, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  // Customer Operations data
  const custStats = customerData?.stats || {};
  const recentCustomers = customerData?.recentCustomers || [];
  const recentTickets = customerData?.recentTickets || [];
  const marketplaceProjects = customerData?.recentProjects || [];

  const customerStatCards = [
    { label: 'Registered Customers', value: custStats.totalCustomers || recentCustomers.length || 0, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Marketplace Projects', value: custStats.totalProjects || 0, icon: Package, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Published & Live', value: custStats.totalPublished || 0, icon: CheckCircle2, color: 'text-[#00FFC6]', bg: 'bg-[#00FFC6]/10 border-[#00FFC6]/20' },
    { label: 'Catalog Categories', value: custStats.totalCategories || 0, icon: Tag, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Tech Stack Stacks', value: custStats.totalTechnologies || 0, icon: Code2, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Support Inquiries', value: recentTickets.length || 0, icon: LifeBuoy, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-[#A855F7]" />
            <span>Platform Executive Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated segregation: Internal Employee Workspaces and Client-facing Customer Operations.
          </p>
        </div>

        {/* Dynamic Header Actions depending on active tab */}
        {activeTab === 'employees' ? (
          <div className="flex items-center gap-2">
            <Link
              to="/admin/employees/add"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <span>+ Add Employee</span>
            </Link>
            <Link
              to="/admin/managed-projects/create"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-purple-glow flex items-center gap-1.5 transition"
            >
              <span>+ Create Project</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/admin/customers"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <span>Manage Customers</span>
            </Link>
            <Link
              to="/admin/projects"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-neon-glow flex items-center gap-1.5 transition"
            >
              <span>+ Store Catalog</span>
            </Link>
          </div>
        )}
      </div>

      {/* DUAL WORKSPACE TABS SELECTOR */}
      <div className="flex items-center p-1.5 bg-[#0F172A] border border-[#334155] rounded-2xl max-w-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('employees')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'employees'
              ? 'bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white shadow-purple-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Briefcase className="w-4 h-4 text-cyan-300" />
          <span>Employee Platform</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/25 text-white/90">
            Internal
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customers')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'customers'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-neon-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-300" />
          <span>Customer & Marketplace</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/25 text-white/90">
            Client Facing
          </span>
        </button>
      </div>

      {/* TAB 1: EMPLOYEE OPERATIONS & DELIVERABLES */}
      {activeTab === 'employees' && (
        <div className="space-y-8 animate-fadeIn">
          {/* 10 Dashboard Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {employeeStatCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border ${c.bg} backdrop-blur-sm flex flex-col justify-between transition hover:translate-y-[-2px]`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-300">{c.label}</span>
                    <Icon className={`w-4 h-4 ${c.color}`} />
                  </div>
                  <p className="text-2xl font-black text-white">{c.value}</p>
                </div>
              );
            })}
          </div>

          {/* Project Statistics Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Technology Distribution */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Technology Distribution</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Projects</span>
              </div>

              <div className="space-y-3">
                {charts.techDistribution && charts.techDistribution.length > 0 ? (
                  charts.techDistribution.map((t, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold">{t.technology}</span>
                        <span className="font-mono text-cyan-400 font-bold">{t.count}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-[#00FFC6] h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, t.count * 25)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No technology data yet.</p>
                )}
              </div>
            </div>

            {/* Employee Performance Matrix */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#A855F7]" />
                  <span>Employee Performance</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Avg Score</span>
              </div>

              <div className="space-y-3">
                {charts.employeePerformance && charts.employeePerformance.length > 0 ? (
                  charts.employeePerformance.map((emp, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#131B2E] border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Completed: {emp.completed} / {emp.assigned}
                        </p>
                      </div>
                      <span className="font-mono font-black text-[#00FFC6] text-sm">
                        {emp.avgScore > 0 ? `${emp.avgScore}%` : 'N/A'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No performance records yet.</p>
                )}
              </div>
            </div>

            {/* Approval Rate & Pipeline Health */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00FFC6]" />
                    <span>Approval Rate</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">QA Gate</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#00FFC6] font-mono">{charts.approvalRate || 100}%</span>
                  <span className="text-xs text-slate-400">First-pass & revised approval</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-cyan-400 to-[#00FFC6] h-2 rounded-full"
                    style={{ width: `${charts.approvalRate || 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white">Automated Sandbox Security</p>
                <p className="text-[11px] text-slate-400">
                  Untrusted employee code runs strictly in isolated sub-processes with zero host or database credentials exposed.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Managed Projects Table Section */}
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-purple-400" />
                  <span>Recent Internal Projects Assigned to Employees</span>
                </h2>
                <p className="text-xs text-slate-400">Live operational status and assigned engineering resources.</p>
              </div>
              <Link to="/admin/managed-projects" className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1">
                <span>View All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 font-bold">Project</th>
                    <th className="pb-3 font-bold">Assigned Employee</th>
                    <th className="pb-3 font-bold">Technology</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold">Due Date</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No internal projects created yet.
                      </td>
                    </tr>
                  ) : (
                    recentProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-[#131B2E]/60 transition">
                        <td className="py-3.5 font-bold text-white">{p.name}</td>
                        <td className="py-3.5">
                          {p.employee ? (
                            <span className="text-slate-200">
                              {p.employee.name}{' '}
                              <span className="text-slate-500 font-mono text-[10px]">({p.employee.employeeId})</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {p.primaryTechnology || 'Multi-stack'}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                              p.status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : p.status === 'REVISION_REQUIRED'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {p.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                          {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to={`/admin/managed-projects`}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px]"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Submissions Section */}
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-[#00FFC6]" />
                  <span>Recent Employee Submissions Awaiting / Completed Review</span>
                </h2>
                <p className="text-xs text-slate-400">Deliverable packages uploaded by engineering employees.</p>
              </div>
              <Link to="/admin/project-reviews" className="text-xs font-bold text-[#00FFC6] hover:underline flex items-center gap-1">
                <span>View All Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 font-bold">Employee</th>
                    <th className="pb-3 font-bold">Project</th>
                    <th className="pb-3 font-bold">Version</th>
                    <th className="pb-3 font-bold">Submitted Date</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No submissions uploaded yet.
                      </td>
                    </tr>
                  ) : (
                    recentSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#131B2E]/60 transition">
                        <td className="py-3.5">
                          <span className="font-bold text-white">{sub.employee}</span>
                          {sub.employeeId && (
                            <span className="ml-1.5 text-[10px] font-mono text-slate-400">({sub.employeeId})</span>
                          )}
                        </td>
                        <td className="py-3.5 font-semibold text-slate-200 max-w-[200px] truncate">{sub.project}</td>
                        <td className="py-3.5 font-mono font-bold text-cyan-400">{sub.version}</td>
                        <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                          {new Date(sub.submittedDate).toLocaleString()}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                              sub.status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : sub.status === 'REVISION_REQUIRED'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-purple-500/20 text-purple-400'
                            }`}
                          >
                            {sub.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {sub.liveDemoUrl && (
                              <button
                                type="button"
                                onClick={() => openPreview(sub.liveDemoUrl, `${sub.project} (${sub.version})`)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[#00FFC6] font-bold text-[11px] hover:bg-emerald-500 hover:text-black transition flex items-center gap-1"
                                title="View Live Output Screen"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Output</span>
                              </button>
                            )}
                            <Link
                              to={`/admin/project-reviews/${sub.id}`}
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-bold text-[11px] hover:brightness-110"
                            >
                              Review
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER OPERATIONS & MARKETPLACE PROCESSES */}
      {activeTab === 'customers' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Customer Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {customerStatCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border ${c.bg} backdrop-blur-sm flex flex-col justify-between transition hover:translate-y-[-2px]`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-300">{c.label}</span>
                    <Icon className={`w-4 h-4 ${c.color}`} />
                  </div>
                  <p className="text-2xl font-black text-white">{c.value}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Shortcuts to Customer Operations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/admin/customers"
              className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] hover:border-emerald-500/50 transition flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Customer Accounts</p>
                <p className="text-[10px] text-slate-400">Profiles & access status</p>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] hover:border-emerald-500/50 transition flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 group-hover:scale-110 transition">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Customer Orders</p>
                <p className="text-[10px] text-slate-400">Purchases & licenses</p>
              </div>
            </Link>

            <Link
              to="/admin/projects"
              className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] hover:border-emerald-500/50 transition flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Marketplace Store</p>
                <p className="text-[10px] text-slate-400">Live preview & catalog</p>
              </div>
            </Link>

            <Link
              to="/admin/support"
              className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] hover:border-emerald-500/50 transition flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Customer Helpdesk</p>
                <p className="text-[10px] text-slate-400">Tickets & support replies</p>
              </div>
            </Link>
          </div>

          {/* Registered Customers Table */}
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span>Registered Customers</span>
                </h2>
                <p className="text-xs text-slate-400">Customer portal accounts with access to downloads and orders.</p>
              </div>
              <Link to="/admin/customers" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                <span>View All Customers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 font-bold">Customer Name</th>
                    <th className="pb-3 font-bold">Email</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold">Registered Date</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500">
                        No registered customers found.
                      </td>
                    </tr>
                  ) : (
                    recentCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#131B2E]/60 transition">
                        <td className="py-3.5 font-bold text-white">{cust.name}</td>
                        <td className="py-3.5 text-slate-300 font-mono">{cust.email}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                              cust.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {cust.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                          {new Date(cust.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to="/admin/customers"
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px]"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Support Inquiries Table */}
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-amber-400" />
                  <span>Customer Support Inquiries & Helpdesk</span>
                </h2>
                <p className="text-xs text-slate-400">Direct technical and purchase support requests submitted by clients.</p>
              </div>
              <Link to="/admin/support" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                <span>Open Support Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 font-bold">Ticket #</th>
                    <th className="pb-3 font-bold">Customer</th>
                    <th className="pb-3 font-bold">Subject</th>
                    <th className="pb-3 font-bold">Priority</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No customer support tickets submitted.
                      </td>
                    </tr>
                  ) : (
                    recentTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-[#131B2E]/60 transition">
                        <td className="py-3.5 font-mono font-bold text-cyan-400">{ticket.ticketNumber}</td>
                        <td className="py-3.5 font-semibold text-white">{ticket.user?.name || 'Customer'}</td>
                        <td className="py-3.5 text-slate-200 max-w-[280px] truncate">{ticket.subject}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                              ticket.priority === 'HIGH' || ticket.priority === 'URGENT'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-slate-700/50 text-slate-300'
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                              ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to="/admin/support"
                            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] transition"
                          >
                            Reply
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketplace Store Catalog Snapshot */}
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-teal-400" />
                  <span>Marketplace Store Catalog</span>
                </h2>
                <p className="text-xs text-slate-400">Digital products published for client purchase and live interactive demo.</p>
              </div>
              <Link to="/admin/projects" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
                <span>Manage Store Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 font-bold">Product Title</th>
                    <th className="pb-3 font-bold">Category</th>
                    <th className="pb-3 font-bold">Price</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {marketplaceProjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500">
                        No marketplace products published.
                      </td>
                    </tr>
                  ) : (
                    marketplaceProjects.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#131B2E]/60 transition">
                        <td className="py-3.5 font-bold text-white max-w-[280px] truncate">{prod.title}</td>
                        <td className="py-3.5 text-slate-300">{prod.category?.name || 'General'}</td>
                        <td className="py-3.5 font-mono font-bold text-[#00FFC6]">
                          {prod.isFree ? 'FREE' : `$${prod.price}`}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                              prod.status === 'PUBLISHED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-700/50 text-slate-400'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to="/admin/projects"
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px]"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Live Output Screen Modal */}
      <LivePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        previewUrl={activePreviewUrl}
        projectTitle={previewTitle}
      />
    </div>
  );
};
