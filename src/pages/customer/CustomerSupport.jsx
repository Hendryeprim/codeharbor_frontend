import React, { useState, useEffect } from 'react';
import { supportAPI } from '../../services/api';
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Bot,
} from 'lucide-react';

export const CustomerSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketDetailsLoading, setTicketDetailsLoading] = useState(false);
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [replyMessage, setReplyMessage] = useState('');
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
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const openTicketDetails = async (ticketId) => {
    try {
      setTicketDetailsLoading(true);
      const res = await supportAPI.getTicketById(ticketId);
      if (res.ticket) setSelectedTicket(res.ticket);
    } catch (err) {
      alert(err.message || 'Error loading ticket thread');
    } finally {
      setTicketDetailsLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    try {
      setSubmitting(true);
      await supportAPI.createTicket({
        subject: newSubject,
        message: newMessage,
        priority: newPriority,
      });
      setNewTicketModal(false);
      setNewSubject('');
      setNewMessage('');
      fetchTickets();
    } catch (err) {
      alert(err.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      setSubmitting(true);
      const res = await supportAPI.addMessage(selectedTicket.id, replyMessage);
      if (res.message) {
        setSelectedTicket({
          ...selectedTicket,
          messages: [...selectedTicket.messages, res.message],
        });
        setReplyMessage('');
      }
    } catch (err) {
      alert(err.message || 'Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      OPEN: 'bg-emerald-500/10 text-[#00FFC6] border-emerald-500/30',
      IN_PROGRESS: 'bg-sky-500/10 text-[#0EA5E9] border-sky-500/30',
      RESOLVED: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
      CLOSED: 'bg-slate-800 text-slate-500 border-slate-700',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${map[status] || map.OPEN}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-[#E2E8F0]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Support Requests Desk
          </h1>
          <p className="text-xs text-[#C0C7D1] mt-1">
            Need technical guidance, deployment assistance, or license clarification? Open a ticket below.
          </p>
        </div>

        <button
          onClick={() => setNewTicketModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-neon-glow hover:brightness-110 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Request</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00FFC6]" />
        </div>
      ) : tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Ticket list (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => openTicketDetails(t.id)}
                className={`p-4 rounded-3xl bg-[#131B2E]/90 border cursor-pointer transition ${
                  selectedTicket?.id === t.id
                    ? 'border-[#00FFC6] shadow-neon-glow bg-[#1E293B]'
                    : 'border-[#334155] hover:border-[#22D3EE]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{t.ticketNumber}</span>
                  {getStatusBadge(t.status)}
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{t.subject}</h4>
                <p className="text-[11px] text-[#C0C7D1] line-clamp-2 mt-1">{t.message}</p>
                <div className="mt-3 pt-2 border-t border-[#334155]/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 font-medium text-[#22D3EE]">
                    <MessageSquare className="w-3 h-3" />
                    <span>{t._count?.messages || 1}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Conversation Thread (7 cols) */}
          <div className="md:col-span-7 bg-[#131B2E]/90 rounded-3xl border border-[#334155] p-6 flex flex-col justify-between min-h-[450px]">
            {ticketDetailsLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#00FFC6]" />
              </div>
            ) : selectedTicket ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#334155]/60 pb-4 mb-4">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {selectedTicket.ticketNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {selectedTicket.subject}
                      </h3>
                    </div>
                    {getStatusBadge(selectedTicket.status)}
                  </div>

                  {/* Thread messages */}
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                    {selectedTicket.messages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                          msg.isAdmin
                            ? 'ml-auto bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-medium rounded-br-none shadow-sm'
                            : 'bg-[#0F172A] border border-[#334155] text-[#E2E8F0] rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-80">
                          <span className="font-extrabold uppercase">
                            {msg.isAdmin ? 'Staff Support' : msg.user?.name || 'You'}
                          </span>
                          <span className="font-mono">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="whitespace-pre-line">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="mt-4 pt-3 border-t border-[#334155]/60 flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response to support..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22D3EE]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shrink-0 hover:brightness-110"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <LifeBuoy className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-xs">Select a support ticket from the list to view the conversation.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#131B2E] rounded-3xl p-12 text-center border border-[#334155] max-w-md mx-auto">
          <LifeBuoy className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">No Active Tickets</h3>
          <p className="text-xs text-slate-400 mb-6">
            You don't have any open inquiries. Need assistance? Submit your first request.
          </p>
          <button
            onClick={() => setNewTicketModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] text-xs font-bold uppercase tracking-wider"
          >
            Create New Ticket
          </button>
        </div>
      )}

      {/* New Ticket Modal */}
      {newTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F1A]/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0F172A] rounded-3xl max-w-lg w-full p-6 shadow-harbor-lg border border-[#334155]">
            <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60 mb-4">
              <h3 className="text-sm font-bold text-white">Open New Support Ticket</h3>
              <button onClick={() => setNewTicketModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Deployment setup question on Ubuntu 24.04"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                >
                  <option value="LOW">Low - General Question</option>
                  <option value="MEDIUM">Medium - Setup / Config</option>
                  <option value="HIGH">High - Urgent Issue</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Message Description</label>
                <textarea
                  rows={4}
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Provide context, error logs, or environment specifics..."
                  className="w-full px-3 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#334155] text-xs font-semibold text-slate-300 hover:bg-[#1E293B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] text-xs font-bold uppercase tracking-wider"
                >
                  {submitting ? 'Submitting...' : 'Open Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
