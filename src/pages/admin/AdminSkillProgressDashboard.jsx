import React, { useState, useEffect } from 'react';
import { adminCurriculumAPI, adminPortalAPI } from '../../services/api';
import {
  BarChart3,
  Users,
  Code2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  Lock,
  Unlock,
  PlusCircle,
  Filter,
  X,
  Sparkles,
} from 'lucide-react';

export const AdminSkillProgressDashboard = () => {
  const [stats, setStats] = useState(null);
  const [matrix, setMatrix] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Assign Skills Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [savingSkills, setSavingSkills] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, matrixRes, skillsRes] = await Promise.all([
        adminCurriculumAPI.getStats(),
        adminCurriculumAPI.getProgressMatrix(),
        adminCurriculumAPI.getSkills(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (matrixRes.success) setMatrix(matrixRes.progressMatrix || []);
      if (skillsRes.success) setAllSkills(skillsRes.skills || []);
    } catch (err) {
      setError(err.message || 'Failed to load progress data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAssignModal = (emp) => {
    setSelectedEmployee(emp);
    const currentIds = (emp.skills || []).map((s) => s.skillId);
    setSelectedSkillIds(currentIds);
    setAssignModalOpen(true);
  };

  const handleToggleSkill = (skillId) => {
    if (selectedSkillIds.includes(skillId)) {
      setSelectedSkillIds(selectedSkillIds.filter((id) => id !== skillId));
    } else {
      setSelectedSkillIds([...selectedSkillIds, skillId]);
    }
  };

  const handleSaveAssignedSkills = async () => {
    if (!selectedEmployee) return;
    try {
      setSavingSkills(true);
      const res = await adminCurriculumAPI.assignSkills(selectedEmployee.id, selectedSkillIds);
      if (res.success) {
        setActionSuccess(`Skills updated for ${selectedEmployee.name}.`);
        setAssignModalOpen(false);
        fetchData();
      }
    } catch (err) {
      alert(err.message || 'Failed to update skills.');
    } finally {
      setSavingSkills(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#A855F7]"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Employees', value: stats?.totalEmployees || 0, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Curriculum Skills', value: stats?.totalSkills || 0, icon: Code2, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Active Tasks', value: stats?.totalTasks || 0, icon: Layers, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Pending Reviews', value: stats?.pendingReviews || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Approved Submissions', value: stats?.approvedSubmissions || 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Rejected / Revisions', value: stats?.rejectedSubmissions || 0, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Completed Levels', value: stats?.completedLevels || 0, icon: Sparkles, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Active Advanced', value: stats?.activeAdvancedProjects || 0, icon: BarChart3, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-[#C084FC]" />
            <span>Employee Skill Progress Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time progress across all assigned technical skills and 3-level unlock stages.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-600/60 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 8 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-3xl border bg-[#0F172A] ${card.bg} space-y-2 shadow-harbor-sm`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider truncate">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-2xl font-black text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Progress Matrix by Employee */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <span>Employee Skill Matrix</span>
          <span className="text-xs font-mono text-slate-400 font-normal">
            ({matrix.length} Employees)
          </span>
        </h2>

        {matrix.length === 0 ? (
          <div className="p-8 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
            No employees registered yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {matrix.map((emp) => (
              <div
                key={emp.id}
                className="p-5 rounded-3xl bg-[#0F172A] border border-[#334155]/80 space-y-4 shadow-harbor-sm"
              >
                {/* Employee Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center text-sm font-black text-white">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white">{emp.name}</h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                          {emp.employeeId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {emp.designation} • {emp.department} • {emp.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => openAssignModal(emp)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition border border-slate-700"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Manage Assigned Skills</span>
                  </button>
                </div>

                {/* Assigned Skills Cards */}
                {emp.skills.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No technical skills assigned to this employee. Click "Manage Assigned Skills" above to assign skills.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {emp.skills.map((s) => (
                      <div
                        key={s.skillId}
                        className="p-4 rounded-2xl bg-[#070A12] border border-slate-800/80 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white">{s.name}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {s.completedPercent}% Done
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-400 to-[#00FFC6] h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${s.completedPercent}%` }}
                          />
                        </div>

                        {/* Level Unlock Indicators */}
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono font-bold">
                          <div
                            className={`p-1.5 rounded-lg border ${
                              s.basicCompleted
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                            }`}
                          >
                            Basic {s.basicCompleted ? '✓' : ''}
                          </div>
                          <div
                            className={`p-1.5 rounded-lg border ${
                              s.intermediateCompleted
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : s.unlockedLevel === 'INTERMEDIATE' || s.unlockedLevel === 'ADVANCED'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                : 'bg-slate-900 border-slate-800 text-slate-600'
                            }`}
                          >
                            Inter {s.intermediateCompleted ? '✓' : s.unlockedLevel === 'BASIC' ? '🔒' : ''}
                          </div>
                          <div
                            className={`p-1.5 rounded-lg border ${
                              s.advancedCompleted
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : s.unlockedLevel === 'ADVANCED'
                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                                : 'bg-slate-900 border-slate-800 text-slate-600'
                            }`}
                          >
                            Adv {s.advancedCompleted ? '✓' : s.unlockedLevel !== 'ADVANCED' ? '🔒' : ''}
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-500 text-right">
                          {s.approvedTasks} of {s.totalTasks} tasks approved
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Skills Modal */}
      {assignModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-black text-white">Assign Technical Skills</h2>
                <p className="text-xs text-slate-400">
                  {selectedEmployee.name} ({selectedEmployee.employeeId})
                </p>
              </div>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select one or multiple skills to assign. The employee will only see tasks for checked skills:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allSkills.map((s) => {
                const isChecked = selectedSkillIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => handleToggleSkill(s.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      isChecked
                        ? 'bg-purple-950/40 border-purple-500 text-white'
                        : 'bg-[#070A12] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div
                        className="rounded accent-purple-500"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{s.name}</p>
                        <p className="text-[10px] text-slate-500">{s.totalTasks || 0} curriculum tasks</p>
                      </div>
                    </div>
                    {isChecked && <span className="text-[10px] font-mono text-purple-400 font-bold">Assigned</span>}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignedSkills}
                disabled={savingSkills}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black text-xs shadow-purple-glow hover:brightness-110 disabled:opacity-50"
              >
                {savingSkills ? 'Saving...' : 'Save Skill Assignments'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
