import React, { useState, useEffect } from 'react';
import { adminCurriculumAPI } from '../../services/api';
import {
  Code2,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderGit2,
  Layers,
  Terminal,
  X,
  ExternalLink,
  Filter,
} from 'lucide-react';

const DEFAULT_SKILLS = [
  { id: 'python', name: 'Python', slug: 'python' },
  { id: 'java', name: 'Java', slug: 'java' },
  { id: 'sql', name: 'SQL', slug: 'sql' },
  { id: 'data-analysis', name: 'Data Analysis', slug: 'data-analysis' },
  { id: 'software-testing', name: 'Software Testing', slug: 'software-testing' },
];

export const AdminSkillCurriculum = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Delete Confirmation Modal State
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [skillId, setSkillId] = useState('');
  const [level, setLevel] = useState('BASIC');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [githubBranch, setGithubBranch] = useState('main');
  const [initialCode, setInitialCode] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [submitting, setSubmitting] = useState(false);

  // Clear All Tasks Modal State
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  // New Skill Modal State
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillModalError, setSkillModalError] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [sRes, tRes] = await Promise.all([
        adminCurriculumAPI.getSkills(),
        adminCurriculumAPI.getTasks({
          skillId: selectedSkillId !== 'ALL' ? selectedSkillId : undefined,
          level: selectedLevel !== 'ALL' ? selectedLevel : undefined,
        }),
      ]);

      if (sRes.success) setSkills(sRes.skills || []);
      if (tRes.success) setTasks(tRes.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load curriculum data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSkillId, selectedLevel]);

  const effectiveSkills = skills && skills.length > 0 ? skills : DEFAULT_SKILLS;

  const openCreateModal = () => {
    setEditingTaskId(null);
    const defaultSkill = (skills && skills.length > 0) ? skills[0] : DEFAULT_SKILLS[0];
    setSkillId(defaultSkill.id);
    setLevel('BASIC');
    setTitle('');
    setDescription('');
    setInstructions('');
    setExpectedOutput('');
    setDifficulty('EASY');
    setGithubRepoUrl('');
    setGithubBranch('main');
    setInitialCode('');
    setStatus('ACTIVE');
    setShowAdvancedOptions(false);
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTaskId(task.id);
    setSkillId(task.skillId);
    setLevel(task.level);
    setTitle(task.title);
    setDescription(task.description);
    setInstructions(task.instructions);
    setExpectedOutput(task.expectedOutput || '');
    setDifficulty(task.difficulty);
    setGithubRepoUrl(task.githubRepoUrl || '');
    setGithubBranch(task.githubBranch || 'main');
    setInitialCode(task.initialCode || '');
    setStatus(task.status);
    setShowAdvancedOptions(Boolean(task.initialCode || task.expectedOutput));
    setModalError('');
    setModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setModalError('');
    const finalInstr = (instructions || description || '').trim();
    const finalDesc = (description || instructions || finalInstr).trim();

    if (!skillId || !title.trim() || !finalInstr) {
      setModalError('Please fill out Target Skill, Task Title, and Instructions (*).');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        skillId,
        level,
        title: title.trim(),
        description: finalDesc,
        instructions: finalInstr,
        expectedOutput: expectedOutput.trim() || null,
        difficulty,
        githubRepoUrl: githubRepoUrl.trim() || null,
        githubBranch: githubBranch.trim() || 'main',
        initialCode: initialCode.trim() || null,
        status,
      };

      if (editingTaskId) {
        await adminCurriculumAPI.updateTask(editingTaskId, payload);
        setActionSuccess('Task updated successfully.');
      } else {
        await adminCurriculumAPI.createTask(payload);
        setActionSuccess('Task created successfully.');
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      setModalError(err.message || 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearAllTasks = async () => {
    try {
      setClearing(true);
      setActionError('');
      const res = await adminCurriculumAPI.clearAllTasks();
      if (res.success) {
        setActionSuccess(res.message || 'All sample tasks cleared. Skills are now empty.');
        setClearModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to clear sample tasks.');
      setClearModalOpen(false);
    } finally {
      setClearing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setDeleting(true);
      setActionError('');
      await adminCurriculumAPI.deleteTask(taskToDelete.id);
      setActionSuccess(`Task "${taskToDelete.title}" deleted successfully.`);
      setTaskToDelete(null);
      fetchData();
    } catch (err) {
      setActionError(err.message || 'Failed to delete task.');
      setTaskToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateNewSkill = async (e) => {
    e.preventDefault();
    setSkillModalError('');
    if (!newSkillName.trim()) {
      setSkillModalError('Please enter a skill name.');
      return;
    }

    try {
      await adminCurriculumAPI.createSkill({
        name: newSkillName.trim(),
        description: newSkillDesc.trim(),
      });
      setSkillModalOpen(false);
      setNewSkillName('');
      setNewSkillDesc('');
      setActionSuccess('New Skill added to curriculum catalog.');
      fetchData();
    } catch (err) {
      setSkillModalError(err.message || 'Failed to create skill.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#A855F7]" />
            <span>Skill Curriculum & Tasks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage 3-level progressive tasks and GitHub repository mappings for Python, Java, SQL, Data Analysis, and Software Testing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {tasks.length > 0 && (
            <button
              onClick={() => setClearModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:text-white font-bold text-xs flex items-center gap-1.5 transition"
              title="Remove sample seeded tasks and start fresh"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear Sample Tasks</span>
            </button>
          )}
          <button
            onClick={() => setSkillModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Add Skill</span>
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black text-xs flex items-center gap-1.5 shadow-purple-glow hover:brightness-110 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-600/60 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-950/40 border border-rose-600/60 rounded-2xl text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="p-4 rounded-3xl bg-[#0F172A] border border-[#334155]/80 space-y-3">
        {/* Skill Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedSkillId('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedSkillId === 'ALL'
                ? 'bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white shadow-purple-glow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Skills
          </button>
          {skills.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSkillId(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedSkillId === s.id
                  ? 'bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white shadow-purple-glow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{s.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40">
                {s.totalTasks}
              </span>
            </button>
          ))}
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1">Level:</span>
          {['ALL', 'BASIC', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedLevel === lvl
                  ? 'bg-cyan-500/20 text-[#00FFC6] border border-[#00FFC6]/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {lvl === 'ALL' ? 'All Levels' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A855F7]"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-12 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
          No tasks found matching current filters. Click "Create Task" to add tasks.
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0F172A] border border-[#334155]/80 overflow-hidden shadow-harbor-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#334155] bg-[#131B2E] text-slate-400 font-mono uppercase text-[10px]">
                  <th className="p-4">Skill & Level</th>
                  <th className="p-4">Task Title</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">GitHub Repository</th>
                  <th className="p-4">Submissions</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-[#131B2E]/60 transition">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-xs">{task.skill?.name}</span>
                        <span
                          className={`text-[10px] font-mono font-bold mt-0.5 ${
                            task.level === 'BASIC'
                              ? 'text-cyan-400'
                              : task.level === 'INTERMEDIATE'
                              ? 'text-amber-400'
                              : 'text-purple-400'
                          }`}
                        >
                          {task.level}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="font-bold text-white text-xs truncate">{task.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{task.description}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          task.difficulty === 'EASY'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : task.difficulty === 'MEDIUM'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {task.difficulty}
                      </span>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      {task.githubRepoUrl ? (
                        <a
                          href={task.githubRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-cyan-400 hover:underline truncate"
                        >
                          <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{task.githubRepoUrl}</span>
                        </a>
                      ) : (
                        <span className="text-slate-500 text-[11px]">In-browser</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-300 font-bold">{task.submissionCount}</span>
                        {task.pendingCount > 0 && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 animate-pulse">
                            {task.pendingCount} Pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          task.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit Task"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setTaskToDelete(task)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Task Modal - Pinned Header & Pinned Footer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
          <div className="w-full max-w-lg bg-[#0F172A] border border-[#334155] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Pinned Modal Header (Never cut off at top) */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0F172A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white leading-tight">
                    {editingTaskId ? 'Edit Curriculum Task' : 'Create Curriculum Task'}
                  </h2>
                  <p className="text-[11px] text-slate-400">Add or edit skill curriculum deliverable</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mx-4 sm:mx-5 mt-3 p-3 bg-rose-950/50 border border-rose-600/60 rounded-xl text-rose-300 text-xs flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Scrollable Form Body */}
            <form
              id="curriculum-task-form"
              onSubmit={handleSaveTask}
              className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto flex-1 overscroll-contain"
            >
              {/* Skill Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Target Skill <span className="text-rose-400">*</span>
                </label>
                <select
                  value={skillId || effectiveSkills[0]?.id || ''}
                  onChange={(e) => setSkillId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400 text-xs font-bold cursor-pointer"
                >
                  {effectiveSkills.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0F172A] text-white py-1">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning Level (3 Pills) */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Learning Level <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'BASIC', label: 'Basic' },
                    { id: 'INTERMEDIATE', label: 'Intermediate' },
                    { id: 'ADVANCED', label: 'Advanced' },
                  ].map((lvl) => (
                    <button
                      type="button"
                      key={lvl.id}
                      onClick={() => setLevel(lvl.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center ${
                        level === lvl.id
                          ? lvl.id === 'BASIC'
                            ? 'bg-cyan-500/20 text-[#00FFC6] border border-[#00FFC6]/60 shadow-sm'
                            : lvl.id === 'INTERMEDIATE'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/60 shadow-sm'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/60 shadow-sm'
                          : 'bg-[#070A12] border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task Title */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Task Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Python Calculator or String Reverser"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400 text-xs"
                />
              </div>

              {/* Task Instructions / Requirements */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Task Instructions / Requirements <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => {
                    setInstructions(e.target.value);
                    setDescription(e.target.value);
                  }}
                  placeholder="Explain what the employee should build, write, or calculate..."
                  rows="3"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400 leading-relaxed text-xs"
                />
              </div>

              {/* GitHub Repository URL */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>GitHub Repository URL (Optional)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">For cloning or project code</span>
                </label>
                <input
                  type="text"
                  value={githubRepoUrl}
                  onChange={(e) => setGithubRepoUrl(e.target.value)}
                  placeholder="https://github.com/organization/repo.git"
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400 font-mono text-xs"
                />
              </div>

              {/* Difficulty & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Difficulty</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['EASY', 'MEDIUM', 'HARD'].map((diff) => (
                      <button
                        type="button"
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition text-center ${
                          difficulty === diff
                            ? diff === 'EASY'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                              : diff === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                            : 'bg-[#070A12] border border-slate-800 text-slate-500 hover:text-white'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'ACTIVE', label: 'Active' },
                      { id: 'INACTIVE', label: 'Inactive' },
                    ].map((st) => (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => setStatus(st.id)}
                        className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition text-center ${
                          status === st.id
                            ? st.id === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                              : 'bg-slate-700 text-slate-200 border border-slate-600'
                            : 'bg-[#070A12] border border-slate-800 text-slate-500 hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Collapsible Advanced Section */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="text-slate-400 hover:text-cyan-400 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>{showAdvancedOptions ? '− Hide' : '+ Optional'} Starter Code & Expected Output</span>
                </button>

                {showAdvancedOptions && (
                  <div className="mt-3 space-y-3 p-3 rounded-2xl bg-[#070A12] border border-slate-800 animate-in fade-in">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 text-[11px]">Expected Terminal Output (Optional)</label>
                      <textarea
                        value={expectedOutput}
                        onChange={(e) => setExpectedOutput(e.target.value)}
                        placeholder="Terminal output expected from code..."
                        rows="2"
                        className="w-full p-2 rounded-xl bg-[#0B0F1A] border border-slate-800 text-emerald-400 font-mono text-[11px] focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1 text-[11px]">Starter Template Code (Optional)</label>
                      <textarea
                        value={initialCode}
                        onChange={(e) => setInitialCode(e.target.value)}
                        placeholder="# Starting boilerplate code in editor..."
                        rows="3"
                        className="w-full p-2 rounded-xl bg-[#0B0F1A] border border-slate-800 text-cyan-300 font-mono text-[11px] focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Pinned Modal Footer (Never cut off at bottom) */}
            <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0 bg-[#0F172A]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="curriculum-task-form"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black text-xs shadow-purple-glow hover:brightness-110 disabled:opacity-50 transition"
              >
                {submitting ? 'Saving...' : editingTaskId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-black text-white">Add New Technical Skill</h2>
              <button onClick={() => setSkillModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {skillModalError && (
              <div className="p-3 bg-rose-950/40 border border-rose-600/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{skillModalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateNewSkill} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Skill Name *</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. C++ or DevOps or Cloud Architecture"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description (Optional)</label>
                <textarea
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                  placeholder="Overview of this technical skill track..."
                  rows="3"
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom In-App Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0F172A] border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Delete Curriculum Task</h3>
                <p className="text-xs text-slate-400">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#070A12] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400">Skill / Level:</span>
                <span className="font-mono text-purple-400 font-bold">
                  {taskToDelete.skill?.name || 'Skill'} • {taskToDelete.level}
                </span>
              </div>
              <p className="text-xs font-bold text-white line-clamp-2">{taskToDelete.title}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2">{taskToDelete.description}</p>
            </div>

            <p className="text-xs text-rose-300/90 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
              Warning: Deleting this task will also remove all associated employee progress and submission records.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:brightness-110 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-900/40 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Task</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom In-App Clear All Sample Tasks Confirmation Modal */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0F172A] border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Clear All Sample Tasks?</h3>
                <p className="text-xs text-slate-400">Reset skills to 0 tasks and clean slate</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently remove all pre-seeded sample tasks and employee submissions. All supported skills (Python, Java, SQL, Data Analysis, Software Testing) will remain completely empty with <strong>0 tasks</strong>, ready for you to create your own tasks.
            </p>

            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs">
              Are you sure? Only the tasks you manually create after this will appear inside the platform.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={clearing}
                onClick={() => setClearModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={clearing}
                onClick={handleClearAllTasks}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:brightness-110 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-900/40 disabled:opacity-50"
              >
                {clearing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Tasks</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
