import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminPortalAPI } from '../../services/api';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Edit,
  FolderPlus,
  AlertCircle,
  Code2,
  FolderGit2,
  FileCheck2,
  Lock,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

export const AdminEmployees = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'directory';
  const [activeTab, setActiveTab] = useState(initialTab); // 'directory' | 'add' | 'projects'

  const [employees, setEmployees] = useState([]);
  const [managedProjects, setManagedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Add Employee Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Development',
    designation: '',
    primarySkill: 'Python',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  });
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState('');
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showAddConfirmPassword, setShowAddConfirmPassword] = useState(false);

  // Edit Modal State
  const [editingEmp, setEditingEmp] = useState(null);
  const [editDepartment, setEditDepartment] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editPrimarySkill, setEditPrimarySkill] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const primarySkillsList = [
    'Python',
    'Java',
    'SQL',
    'Database',
    'Data Analyst',
    'Django',
    'Flask',
    'FastAPI',
    'React',
    'Node.js',
    'Full Stack',
    'Machine Learning',
    'Other',
  ];

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (selectedSkill) params.skill = selectedSkill;
      if (statusFilter) params.status = statusFilter;

      const res = await adminPortalAPI.getEmployees(params);
      if (res.success) {
        setEmployees(res.employees || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagedProjects = async () => {
    try {
      const res = await adminPortalAPI.getProjects();
      if (res.success) {
        setManagedProjects(res.projects || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchEmployees();
    fetchManagedProjects();
  }, [selectedSkill, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await adminPortalAPI.toggleEmployeeStatus(id);
      if (res.success) {
        setActionSuccess(`Employee status updated to ${res.status}.`);
        fetchEmployees();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setEditDepartment(emp.department);
    setEditDesignation(emp.designation);
    setEditPrimarySkill(emp.primarySkill);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingEmp) return;
    try {
      setSavingEdit(true);
      const res = await adminPortalAPI.updateEmployee(editingEmp.id, {
        department: editDepartment,
        designation: editDesignation,
        primarySkill: editPrimarySkill,
      });
      if (res.success) {
        setActionSuccess('Employee updated successfully!');
        setEditingEmp(null);
        fetchEmployees();
      }
    } catch (err) {
      alert(err.message || 'Failed to update employee.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    setAddError('');

    if (formData.password !== formData.confirmPassword) {
      setAddError('Password and Confirm Password do not match.');
      return;
    }

    try {
      setSubmittingAdd(true);
      const res = await adminPortalAPI.createEmployee(formData);
      if (res.success) {
        setActionSuccess(`Employee ${formData.name} (${formData.employeeId}) created successfully!`);
        // Reset form
        setFormData({
          employeeId: '',
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          department: 'Development',
          designation: '',
          primarySkill: 'Python',
          joiningDate: new Date().toISOString().split('T')[0],
          status: 'ACTIVE',
        });
        setActiveTab('directory');
        fetchEmployees();
      }
    } catch (err) {
      setAddError(err.message || 'Failed to create employee.');
    } finally {
      setSubmittingAdd(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-cyan-400" />
            <span>Employee Management Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete technical staff details, skill assignments, new onboarding, and internal deliverables in one place.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1 bg-[#0F172A] border border-[#334155] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'directory'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Employees ({employees.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white shadow-purple-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Employee</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-neon-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Assigned Projects ({managedProjects.length})</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-400 font-bold">&times;</button>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: ALL EMPLOYEES DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] flex flex-col md:flex-row gap-3 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Employee ID, Name, Department, or Email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0F1A] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </form>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="p-2 rounded-xl bg-[#0B0F1A] border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Primary Skills</option>
                {primarySkillsList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 rounded-xl bg-[#0B0F1A] border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="DISABLED">DISABLED</option>
              </select>
            </div>
          </div>

          {/* Employees Table */}
          <div className="rounded-3xl bg-[#0F172A] border border-[#334155] overflow-hidden shadow-harbor-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-3 px-4 font-bold">Employee ID</th>
                    <th className="py-3 px-4 font-bold">Name & Email</th>
                    <th className="py-3 px-4 font-bold">Primary Skill</th>
                    <th className="py-3 px-4 font-bold">Department</th>
                    <th className="py-3 px-4 font-bold">Designation</th>
                    <th className="py-3 px-4 font-bold text-center">Projects</th>
                    <th className="py-3 px-4 font-bold text-center">Avg Score</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Joined Date</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-400"></div>
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-slate-500">
                        No employees matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-[#131B2E]/60 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{emp.employeeId}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-white">{emp.name}</p>
                          <p className="text-[11px] text-slate-400">{emp.email}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-cyan-950/60 text-[#00FFC6] border border-cyan-500/30">
                            {emp.primarySkill}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-semibold">{emp.department}</td>
                        <td className="py-3.5 px-4 text-slate-300">{emp.designation}</td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className="text-white font-bold">{emp.assignedProjects}</span>
                          <span className="text-slate-500 text-[10px] ml-1">({emp.completedProjects} done)</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-[#00FFC6]">
                          {emp.averageScore != null ? `${emp.averageScore}%` : '-'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                              emp.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(emp.joiningDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Profile */}
                            <Link
                              to={`/admin/employees/${emp.id}`}
                              title="View Profile"
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>

                            {/* Edit */}
                            <button
                              onClick={() => openEditModal(emp)}
                              title="Edit Details"
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Assign Project */}
                            <Link
                              to={`/admin/managed-projects/create?employeeId=${emp.id}`}
                              title="Assign Project"
                              className="p-1.5 rounded-lg bg-cyan-950/60 text-[#00FFC6] border border-cyan-500/30 hover:bg-cyan-900/60"
                            >
                              <FolderPlus className="w-3.5 h-3.5" />
                            </Link>

                            {/* Enable/Disable */}
                            <button
                              onClick={() => handleToggleStatus(emp.id, emp.status)}
                              title={emp.status === 'ACTIVE' ? 'Disable Account' : 'Enable Account'}
                              className={`p-1.5 rounded-lg text-xs font-bold ${
                                emp.status === 'ACTIVE'
                                  ? 'text-rose-400 hover:bg-rose-950/40'
                                  : 'text-emerald-400 hover:bg-emerald-950/40'
                              }`}
                            >
                              {emp.status === 'ACTIVE' ? (
                                <XCircle className="w-3.5 h-3.5" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                            </button>
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

      {/* TAB 2: INLINE ADD EMPLOYEE FORM */}
      {activeTab === 'add' && (
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] max-w-3xl animate-fadeIn space-y-6">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#A855F7]" />
              <span>Register New Employee Account</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Admin must assign the employee's Primary Skill. The employee will not be able to edit this skill.
            </p>
          </div>

          {addError && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{addError}</span>
            </div>
          )}

          <form onSubmit={handleAddEmployeeSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Employee ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EMP003"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Corporate Email Address *</label>
              <input
                type="email"
                required
                placeholder="developer@coderharbor.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Temporary Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Development, AI Research"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Python Engineer"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Primary Skill (Admin Assigned) *
                </label>
                <select
                  value={formData.primarySkill}
                  onChange={(e) => setFormData({ ...formData, primarySkill: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                >
                  {primarySkillsList.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Joining Date</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-purple-950/20 border border-purple-800/30 rounded-xl text-[11px] text-purple-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 shrink-0 text-[#C084FC]" />
              <span>
                Employee profile will be locked to Primary Skill: <strong>{formData.primarySkill}</strong>. When assigning projects, this skill is loaded automatically.
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('directory')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingAdd}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-extrabold shadow-purple-glow hover:brightness-110 transition"
              >
                {submittingAdd ? 'Creating Account...' : 'Create Employee Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ASSIGNED PROJECTS & REVIEWS */}
      {activeTab === 'projects' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-emerald-400" />
                <span>Internal Projects Assigned to Employees</span>
              </h2>
              <p className="text-xs text-slate-400">Review deliverables submitted by employees and run automated test suites.</p>
            </div>
            <Link
              to="/admin/managed-projects/create"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-bold text-xs hover:brightness-110 shadow-purple-glow flex items-center gap-1.5"
            >
              <span>+ Create Project Assignment</span>
            </Link>
          </div>

          <div className="rounded-3xl bg-[#0F172A] border border-[#334155] overflow-hidden shadow-harbor-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-3 px-4 font-bold">Project Name</th>
                    <th className="py-3 px-4 font-bold">Assigned Employee</th>
                    <th className="py-3 px-4 font-bold">Tech Stack</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Due Date</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {managedProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No internal projects created yet.
                      </td>
                    </tr>
                  ) : (
                    managedProjects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-[#131B2E]/60 transition">
                        <td className="py-3.5 px-4 font-bold text-white">{proj.name}</td>
                        <td className="py-3.5 px-4">
                          {proj.employee ? (
                            <span className="text-slate-200">
                              {proj.employee.name}{' '}
                              <span className="text-slate-500 font-mono text-[10px]">({proj.employee.employeeId})</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {proj.primaryTechnology || 'Multi-stack'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                              proj.status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : proj.status === 'REVISION_REQUIRED'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-purple-500/20 text-purple-400'
                            }`}
                          >
                            {proj.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {proj.dueDate ? new Date(proj.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to="/admin/project-reviews"
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-bold text-[11px] hover:brightness-110"
                          >
                            Reviews
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

      {/* Quick Edit Employee Modal */}
      {editingEmp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#140F28] border border-[#322659] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-harbor-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Edit Employee Information</h3>
                <p className="text-[11px] text-slate-400">{editingEmp.name} ({editingEmp.employeeId})</p>
              </div>
              <button onClick={() => setEditingEmp(null)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Primary Skill (Admin-Controlled)
                </label>
                <select
                  value={editPrimarySkill}
                  onChange={(e) => setEditPrimarySkill(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-cyan-400"
                >
                  {primarySkillsList.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  Note: Employee cannot change their primary skill; only Admin can assign it.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:brightness-110 shadow-neon-glow"
                >
                  {savingEdit ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
