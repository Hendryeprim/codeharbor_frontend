import React, { useState, useEffect } from 'react';
import { adminAPI, supportAPI } from '../../services/api';
import {
  ShoppingBag,
  Clock,
  AlertCircle,
  Zap,
  Users,
  LifeBuoy,
  CheckCircle2,
  XCircle,
  Send,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'customers' | 'support'

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Support reply state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 5000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordRes, custRes, tktRes] = await Promise.allSettled([
        adminAPI.getOrders(),
        adminAPI.getCustomers(),
        supportAPI.getTickets(),
      ]);

      if (ordRes.status === 'fulfilled' && ordRes.value.orders) setOrders(ordRes.value.orders);
      if (custRes.status === 'fulfilled' && custRes.value.customers) setCustomers(custRes.value.customers);
      if (tktRes.status === 'fulfilled' && tktRes.value.tickets) setTickets(tktRes.value.tickets);
    } catch (err) {
      console.error('Error fetching admin commerce data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleCustomer = async (id) => {
    try {
      const res = await adminAPI.toggleCustomerStatus(id);
      if (res.success) {
        showNotice(`Customer status updated to ${res.status}.`);
        fetchData();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    try {
      setSendingReply(true);
      await supportAPI.addMessage(selectedTicket.id, replyText.trim());
      showNotice('Reply sent to customer successfully.');
      setReplyText('');
      setSelectedTicket(null);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to send reply.');
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Client Commerce & Relations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
            Customer Orders & Relations
          </h1>
          <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
            Review incoming customer license purchases, client accounts, and direct support tickets.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1 bg-[#0F172A] border border-[#334155] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-neon-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'customers'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-neon-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customers ({customers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'support'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Support Tickets ({tickets.length})</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice('')} className="text-emerald-400 font-bold">&times;</button>
        </div>
      )}

      {/* TAB 1: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Explanatory Policy Callout */}
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Live Commercial Transactions & Licensing Records</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When customers purchase digital software deliverables or digital licenses from the marketplace, the transactions and fulfillment statuses will register here.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#0F172A] rounded-2xl p-12 text-center border border-[#334155] max-w-md mx-auto">
              <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Orders Generated Yet</h3>
              <p className="text-xs text-slate-400">
                Customer purchases will appear here as soon as orders are submitted.
              </p>
            </div>
          ) : (
            <div className="bg-[#0F172A] rounded-2xl border border-[#334155] overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#131B2E] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Order #</th>
                    <th className="px-5 py-3.5 font-bold">Customer</th>
                    <th className="px-5 py-3.5 font-bold">Items</th>
                    <th className="px-5 py-3.5 font-bold">Total Amount</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-white">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#131B2E]/60 transition">
                      <td className="px-5 py-3.5 font-mono font-bold text-[#A855F7]">{o.orderNumber}</td>
                      <td className="px-5 py-3.5 font-bold">{o.user?.name}</td>
                      <td className="px-5 py-3.5 text-slate-300">{o.items?.length || 1} item(s)</td>
                      <td className="px-5 py-3.5 font-bold font-mono text-cyan-400">₹{Number(o.totalAmount).toFixed(2)}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REGISTERED CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Registered Customer Accounts</span>
              </h2>
              <p className="text-xs text-slate-400">Manage client accounts with access to digital licenses and downloads.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {customers.length} Client{customers.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="bg-[#0F172A] rounded-2xl border border-[#334155] overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131B2E] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Customer Name</th>
                  <th className="px-5 py-3.5 font-bold">Email</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold">Registered Date</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-white">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No registered customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#131B2E]/60 transition">
                      <td className="px-5 py-3.5 font-bold">{c.name}</td>
                      <td className="px-5 py-3.5 text-slate-300 font-mono">{c.email}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                            c.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleToggleCustomer(c.id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                            c.status === 'ACTIVE'
                              ? 'bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:bg-rose-900/50'
                              : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50'
                          }`}
                        >
                          {c.status === 'ACTIVE' ? 'Restrict' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER SUPPORT HELPDESK */}
      {activeTab === 'support' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-purple-400" />
                <span>Customer Support Tickets & Helpdesk</span>
              </h2>
              <p className="text-xs text-slate-400">Direct technical inquiries and project installation questions submitted by clients.</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              {tickets.length} Ticket{tickets.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="bg-[#0F172A] rounded-2xl border border-[#334155] overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131B2E] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Ticket #</th>
                  <th className="px-5 py-3.5 font-bold">Customer</th>
                  <th className="px-5 py-3.5 font-bold">Subject</th>
                  <th className="px-5 py-3.5 font-bold">Priority</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-white">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No customer support tickets received.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-[#131B2E]/60 transition">
                      <td className="px-5 py-3.5 font-mono font-bold text-cyan-400">{t.ticketNumber}</td>
                      <td className="px-5 py-3.5 font-bold">{t.user?.name || 'Customer'}</td>
                      <td className="px-5 py-3.5 text-slate-300 max-w-[280px] truncate">{t.subject}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                            t.priority === 'HIGH' || t.priority === 'URGENT'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-700/50 text-slate-300'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                            t.status === 'RESOLVED' || t.status === 'CLOSED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedTicket(t)}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] transition"
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Reply Modal */}
          {selectedTicket && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#140F28] border border-[#322659] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-harbor-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">Reply to Support Ticket</h3>
                    <p className="text-[11px] text-slate-400">{selectedTicket.ticketNumber} • {selectedTicket.subject}</p>
                  </div>
                  <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">&times;</button>
                </div>

                <div className="p-3 rounded-xl bg-[#0B0F1A] border border-slate-800 text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-cyan-400">Client Inquiry ({selectedTicket.user?.name}):</p>
                  <p className="text-slate-400 italic">"{selectedTicket.message}"</p>
                </div>

                <form onSubmit={handleSendReply} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Your Response Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Type your official response..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingReply}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold hover:brightness-110 shadow-neon-glow flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingReply ? 'Sending...' : 'Send Response'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
