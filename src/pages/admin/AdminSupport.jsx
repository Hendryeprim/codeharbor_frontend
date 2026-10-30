import React, { useState, useEffect } from 'react';
import { supportAPI } from '../../services/api';
import { LifeBuoy, Send, MessageSquare, Loader2, CheckCircle2, Zap } from 'lucide-react';

export const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await supportAPI.getTickets();
      if (res.tickets) setTickets(res.tickets);
    } catch (err) {
      console.error('Error fetching admin tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTicket = async (id) => {
    try {
      setThreadLoading(true);
      const res = await supportAPI.getTicketById(id);
      if (res.ticket) setSelectedTicket(res.ticket);
    } catch (err) {
      alert(err.message || 'Error fetching ticket thread');
    } finally {
      setThreadLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;

    try {
      setSubmitting(true);
      const res = await supportAPI.addMessage(selectedTicket.id, reply);
      if (res.message) {
        setSelectedTicket({
          ...selectedTicket,
          messages: [...selectedTicket.messages, res.message],
        });
        setReply('');
        fetchTickets();
      }
    } catch (err) {
      alert(err.message || 'Failed to reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;
    try {
      await supportAPI.updateStatus(selectedTicket.id, newStatus);
      setSelectedTicket({ ...selectedTicket, status: newStatus });
      fetchTickets();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#22D3EE] text-[11px] font-semibold tracking-wider uppercase mb-2">
          <Zap className="w-3.5 h-3.5 text-[#00FFC6]" />
          Technical Assistance & Customer Care
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
          Support Management Desk
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
          Respond to customer questions, technical inquiries, and deployment assistance requests.
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0EA5E9]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Ticket list (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => loadTicket(t.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedTicket?.id === t.id
                    ? 'border-[#0EA5E9] bg-gradient-to-r from-[#131B2E] to-[#1E293B] shadow-neon-glow/20'
                    : 'border-[#334155]/60 bg-[#131B2E]/80 hover:border-[#334155]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-mono font-bold text-[#22D3EE]">{t.ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B0F1A] text-[#C0C7D1] border border-[#334155]">
                    {t.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#E2E8F0] truncate">{t.subject}</h4>
                <p className="text-xs text-[#C0C7D1]/70 mt-0.5">By: {t.user?.name || 'Customer'}</p>
                <div className="mt-2 text-[10px] text-[#C0C7D1]/50 font-mono">
                  Updated: {new Date(t.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {/* Conversation (7 cols) */}
          <div className="md:col-span-7 bg-gradient-to-br from-[#131B2E] to-[#0F172A] rounded-2xl border border-[#334155]/60 p-6 flex flex-col justify-between min-h-[480px] shadow-xl">
            {threadLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#0EA5E9]" />
              </div>
            ) : selectedTicket ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#334155]/60 pb-4 mb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#22D3EE]">
                        {selectedTicket.ticketNumber}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#E2E8F0]">
                        {selectedTicket.subject}
                      </h3>
                      <p className="text-xs text-[#C0C7D1]/70">
                        Customer: <strong className="text-[#E2E8F0]">{selectedTicket.user?.name}</strong> ({selectedTicket.user?.email})
                      </p>
                    </div>

                    <div>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-[#334155] text-xs font-semibold bg-[#0B0F1A] text-[#E2E8F0] focus:outline-none focus:border-[#0EA5E9]"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2">
                    {selectedTicket.messages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                          msg.isAdmin
                            ? 'ml-auto bg-gradient-to-r from-[#0EA5E9] to-[#0A84FF] text-white rounded-br-none shadow-md'
                            : 'bg-[#1E293B] text-[#E2E8F0] rounded-bl-none border border-[#334155]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-80">
                          <span className="font-bold">
                            {msg.isAdmin ? 'Staff Support (You)' : msg.user?.name || 'Customer'}
                          </span>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="whitespace-pre-line">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendReply} className="mt-4 pt-3 border-t border-[#334155]/60 flex gap-2">
                  <input
                    type="text"
                    required
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type official admin response..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#334155]/80 bg-[#0B0F1A] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#0EA5E9]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0A84FF] hover:shadow-neon-glow text-white text-xs font-bold flex items-center gap-1.5 transition duration-200 shrink-0 shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <LifeBuoy className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-xs">Select a customer ticket to respond.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
