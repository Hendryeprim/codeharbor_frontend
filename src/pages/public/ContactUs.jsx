import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles, Terminal } from 'lucide-react';
import { supportAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ContactUs = () => {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isAuthenticated) {
        await supportAPI.createTicket({
          subject: formData.subject,
          message: `Inquiry from ${formData.name} (${formData.email}):\n\n${formData.message}`,
        });
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#E2E8F0]">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#00FFC6]/10 text-[#00FFC6] border border-[#00FFC6]/30 mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>Direct Engineering Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Contact CoderHarbor
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]">
          Have an inquiry about a project codebase, custom architecture adaptation, or enterprise deployment? We're here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-[#131B2E] rounded-3xl p-8 text-white space-y-8 shadow-harbor-md border border-[#334155]/80 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00FFC6]">
                Harbor Headquarters
              </span>
              <h2 className="text-xl font-bold mt-1">Get in Touch</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Our engineering team handles technical inquiries, license guidance, and software delivery consultation.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Direct Email</p>
                  <p className="text-white font-mono">support@coderharbor.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Telephone</p>
                  <p className="text-white font-mono">+1 (800) 555-0199</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Location</p>
                  <p className="text-white font-medium">
                    742 Harbor Way, Suite 400<br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#334155]/60 text-xs text-slate-400">
            <p>Support Hours: Monday – Friday</p>
            <p className="text-[#00FFC6] font-mono">09:00 AM – 06:00 PM PST</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#131B2E]/90 rounded-3xl p-8 border border-[#334155]/80 shadow-harbor-sm backdrop-blur-xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-[#00FFC6] flex items-center justify-center mx-auto border border-[#00FFC6]/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Message Received!</h3>
              <p className="text-xs text-[#C0C7D1] max-w-sm mx-auto">
                Thank you for contacting CoderHarbor. A member of our technical support team will review your inquiry and follow up shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] text-xs font-bold uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                    placeholder="e.g. Alex Morgan"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                  placeholder="e.g. Architecture inquiry for cloud billing system"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#334155] bg-[#0B0F1A] text-white focus:outline-none focus:border-[#22D3EE]"
                  placeholder="Please describe your deployment environment or technical inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#0EA5E9] via-[#22D3EE] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs uppercase tracking-wider shadow-neon-glow transition hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
