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

export const AdminSkillCurriculum = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
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

  // New Skill Modal State
  const [skillModalOpen, setSkillModalOpen] = useState(false);
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

  const openCreateModal = () => {
    setEditingTaskId(null);
    setSkillId(skills[0]?.id || '');
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
    setModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!skillId || !title || !description || !instructions) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        skillId,
        level,
        title,
        description,
        instructions,
        expectedOutput,
        difficulty,
        githubRepoUrl,
        githubBranch,
        initialCode,
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
      alert(err.message || 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await adminCurriculumAPI.deleteTask(id);
        setActionSuccess('Task deleted successfully.');
        fetchData();
      } catch (err) {
        alert(err.message || 'Failed to delete task.');
      }
    }
  };

  const handleCreateNewSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

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
      alert(err.message || 'Failed to create skill.');
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

        <div className="flex items-center gap-2 self-start sm:self-auto">
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
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-slate-400 hover:text-white">
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
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400"
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

      {/* Create / Edit Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-2xl my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-black text-white">
                {editingTaskId ? 'Edit Curriculum Task' : 'Create New Curriculum Task'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Skill *</label>
                  <select
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400"
                  >
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Learning Level *</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400 font-mono"
                  >
                    <option value="BASIC">Basic (Foundational)</option>
                    <option value="INTERMEDIATE">Intermediate (OOP / Logic)</option>
                    <option value="ADVANCED">Advanced (Full Project Deliverable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Python Calculator or String Reverser"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of what the task accomplishes..."
                  rows="2"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Instructions *</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Detailed step-by-step instructions for the employee..."
                  rows="3"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Expected Output (Optional)</label>
                  <textarea
                    value={expectedOutput}
                    onChange={(e) => setExpectedOutput(e.target.value)}
                    placeholder="Terminal output string expected..."
                    rows="2"
                    className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-emerald-400 focus:outline-none focus:border-purple-400 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">GitHub Repository URL (Optional)</label>
                  <input
                    type="text"
                    value={githubRepoUrl}
                    onChange={(e) => setGithubRepoUrl(e.target.value)}
                    placeholder="https://github.com/org/repo.git"
                    className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="ACTIVE">Active (Available to Employees)</option>
                    <option value="INACTIVE">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Initial Boilerplate Code (Optional)</label>
                <textarea
                  value={initialCode}
                  onChange={(e) => setInitialCode(e.target.value)}
                  placeholder="# Starting template code provided in the in-browser code editor..."
                  rows="4"
                  className="w-full p-2.5 rounded-xl bg-[#070A12] border border-slate-700 text-cyan-300 focus:outline-none focus:border-purple-400 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black shadow-purple-glow hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingTaskId ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
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
    </div>
  );
};
