import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../services/api';
import { CheckSquare, Clock, CheckCircle2, AlertCircle, Filter } from 'lucide-react';

export const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await employeeAPI.getTasks();
      if (res.success) {
        setTasks(res.tasks || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await employeeAPI.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to update task status.');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-[#00FFC6]" />
            <span>My Tasks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and update milestone tasks assigned by project administrators.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          {['ALL', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === status
                  ? 'bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-black shadow-neon-glow'
                  : 'bg-[#0F172A] text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00FFC6]"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
          No tasks found matching current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-3xl bg-[#0F172A] border border-[#334155]/80 flex flex-col justify-between space-y-4 shadow-harbor-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {t.project?.title}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      t.priority === 'High'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white">{t.title}</h3>
                {t.description && <p className="text-xs text-slate-400">{t.description}</p>}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'None'}
                </span>
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  className="bg-[#131B2E] border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 font-bold focus:outline-none focus:border-[#00FFC6]"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
