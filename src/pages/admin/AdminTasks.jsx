import React, { useState, useEffect } from 'react';
import { adminPortalAPI } from '../../services/api';
import {
  CheckSquare,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  User,
  FolderGit2,
  X,
} from 'lucide-react';

export const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Create Task Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [employeeProfileId, setEmployeeProfileId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [tRes, eRes, pRes] = await Promise.all([
        adminPortalAPI.getTasks(),
        adminPortalAPI.getEmployees({ status: 'ACTIVE' }),
        adminPortalAPI.getProjects(),
      ]);

      if (tRes.success) setTasks(tRes.tasks || []);
      if (eRes.success) {
        setEmployees(eRes.employees || []);
        if (eRes.employees.length > 0 && !employeeProfileId) {
          setEmployeeProfileId(eRes.employees[0].id);
        }
      }
      if (pRes.success) {
        setProjects(pRes.projects || []);
        if (pRes.projects.length > 0 && !projectId) {
          setProjectId(pRes.projects[0].id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load tasks data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!title || !projectId || !employeeProfileId) {
      setModalError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminPortalAPI.createTask({
        title,
        description,
        projectId,
        employeeProfileId,
        priority,
        dueDate: dueDate || null,
      });

      if (res.success) {
        setActionSuccess('Task created and assigned to employee successfully!');
        setModalOpen(false);
        setTitle('');
        setDescription('');
        fetchData();
      }
    } catch (err) {
      setModalError(err.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setDeleting(true);
      setActionError('');
      const res = await adminPortalAPI.deleteTask(taskToDelete.id);
      if (res.success) {
        setActionSuccess(`Task "${taskToDelete.title}" deleted.`);
        setTaskToDelete(null);
        fetchData();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to delete task.');
      setTaskToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminPortalAPI.updateTask(id, { status });
      fetchData();
    } catch (err) {
      setActionError(err.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-purple-400" />
            <span>Task Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create milestone deliverables and assign granular tasks directly to developers.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-purple-glow flex items-center gap-2 self-start sm:self-auto transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-400 font-bold">&times;</button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-rose-400 font-bold">&times;</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tasks Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-[#334155] overflow-hidden shadow-harbor-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4 font-bold">Task Name</th>
                <th className="py-3 px-4 font-bold">Project</th>
                <th className="py-3 px-4 font-bold">Assigned Employee</th>
                <th className="py-3 px-4 font-bold">Priority</th>
                <th className="py-3 px-4 font-bold">Due Date</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-400"></div>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No tasks created yet. Click "Create Task" to assign work items.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-[#131B2E]/60 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{t.title}</p>
                      {t.description && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{t.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{t.project?.title}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white">{t.employee?.name}</span>
                      <span className="ml-1 text-[10px] font-mono text-cyan-400">({t.employee?.employeeId})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                          t.priority === 'High'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'None'}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        className="bg-[#0B0F1A] border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 font-bold focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setTaskToDelete(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#140F28] border border-[#322659] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-harbor-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">Create New Project Task</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Task Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Login Module & Test Auth Flow"
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Task Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details regarding expected outcomes and technical guidelines..."
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Assigned Employee</label>
                  <select
                    value={employeeProfileId}
                    onChange={(e) => setEmployeeProfileId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-bold hover:brightness-110 shadow-purple-glow"
                >
                  {submitting ? 'Creating Task...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom In-App Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0F172A] border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Delete Task?</h3>
                <p className="text-xs text-slate-400 truncate max-w-[200px]">{taskToDelete.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this task? This action cannot be undone.
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
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:brightness-110 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
