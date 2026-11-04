import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Search, ShieldCheck, ShieldAlert, Loader2, Zap } from 'lucide-react';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCustomers({ search });
      if (res.customers) setCustomers(res.customers);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (c) => {
    const nextStatus = c.status === 'ACTIVE' ? 'RESTRICTED' : 'ACTIVE';
    try {
      await adminAPI.toggleCustomerStatus(c.id, nextStatus);
      fetchCustomers();
    } catch (err) {
      alert(err.message || 'Error updating customer status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
            Developer Identity & Access Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
            Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
            Registered marketplace developers and accounts. Passwords and keys are cryptographically hashed.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] placeholder-slate-500 text-xs focus:outline-none focus:border-[#A855F7]"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#A855F7]" />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] rounded-2xl border border-[#322659]/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A0713]/80 text-[#C0C7D1] uppercase tracking-wider font-semibold border-b border-[#322659]/60">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Downloads</th>
                  <th className="px-6 py-4">Tickets</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#322659]/40 text-[#E2E8F0]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1C1636]/40 transition">
                    <td className="px-6 py-4 font-bold text-[#E2E8F0]">
                      <div>
                        <p>{c.name}</p>
                        <p className="text-[11px] text-[#A855F7] font-normal font-mono">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#C0C7D1]">{c.company || '—'}</td>
                    <td className="px-6 py-4 text-[#C0C7D1] font-mono text-[11px]">{c.phone || '—'}</td>
                    <td className="px-6 py-4 font-bold font-mono text-[#C084FC]">{c._count?.downloads ?? 0}</td>
                    <td className="px-6 py-4 font-bold font-mono text-amber-400">{c._count?.supportTickets ?? 0}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          c.status === 'ACTIVE'
                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                        }`}
                      >
                        {c.status === 'ACTIVE' ? 'Restrict Account' : 'Activate Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
