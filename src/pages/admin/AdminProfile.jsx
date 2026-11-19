import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, ShieldAlert, Key, Mail, Calendar, Server, Lock } from 'lucide-react';

export const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-[#A855F7]" />
          <span>Platform Administrator Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Master administrative credentials, system authorization status, and RBAC enforcement.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#C084FC] flex items-center justify-center text-white font-black text-lg shadow-purple-glow">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{user?.name}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Super Administrator
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Role Authorization</span>
            <p className="font-mono font-bold text-white text-sm">{user?.role}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Account Status</span>
            <p className="font-mono font-bold text-emerald-400 text-sm">{user?.status || 'ACTIVE'}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Access Permissions</span>
            <p className="text-slate-300">Full RBAC root control, isolated sandbox runner, code review authority.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Sandbox Host Environment</span>
            <p className="text-slate-300">Clean process isolation • Zero DB exposure • 15s execution timeout.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
