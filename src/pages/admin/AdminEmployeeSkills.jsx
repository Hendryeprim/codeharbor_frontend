import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminPortalAPI } from '../../services/api';
import { Cpu, Users, Code2, ArrowLeft, AlertCircle, PlusCircle } from 'lucide-react';

export const AdminEmployeeSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const res = await adminPortalAPI.getEmployeeSkills();
        if (res.success) {
          setSkills(res.skills || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load employee skills.');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/employees"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span>Technical Skills Inventory</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution of technical specializations across the engineering organization.
            </p>
          </div>
        </div>

        <Link
          to="/admin/employees/add"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-purple-glow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Employee with Skill</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[#0F172A] border border-[#334155] hover:border-cyan-500/40 transition space-y-4 shadow-harbor-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-[#00FFC6]">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{s.skill}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Specialization</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                  {s.employeeCount} {s.employeeCount === 1 ? 'Engineer' : 'Engineers'}
                </span>
              </div>

              <div className="space-y-2 border-t border-slate-800/80 pt-3">
                <p className="text-[10px] uppercase font-mono text-slate-500 font-bold">Assigned Staff</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.employees.map((emp, eIdx) => (
                    <span
                      key={eIdx}
                      className="px-2.5 py-1 rounded-lg bg-[#131B2E] border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span className="text-white">{emp.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400">({emp.employeeId})</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/admin/employees?skill=${encodeURIComponent(s.skill)}`}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Filter Directory</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
