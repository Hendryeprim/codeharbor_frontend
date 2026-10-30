import React from 'react';
import { Clock, ShieldAlert, X, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComingSoonModal = ({ isOpen, onClose, productTitle, price }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F1A]/85 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-[#0F172A] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-harbor-lg border border-[#334155] relative text-left text-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1E293B] transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/30">
          <Clock className="w-6 h-6 animate-pulse" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-2">
          Purchasing Phase Notice
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white">
          Online Purchasing is Coming Soon
        </h3>

        <div className="my-4 p-4 rounded-2xl bg-[#131B2E] border border-[#334155] text-xs text-slate-300 space-y-2">
          {productTitle && (
            <p className="font-semibold text-white">
              Selected: <span className="text-[#22D3EE]">{productTitle}</span>
            </p>
          )}
          {price !== undefined && (
            <p className="text-slate-400">
              Listed Price:{' '}
              <span className="font-black text-[#00FFC6]">${Number(price).toFixed(2)} USD</span>
            </p>
          )}
          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
            CoderHarbor's direct payment gateway integration (Stripe / Razorpay) is currently scheduled for the upcoming release phase. In this current phase, direct online checkout is disabled.
          </p>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          You can inspect the full architecture, test live interactive demos, or contact our engineering team if you require immediate deployment assistance.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/contact"
            onClick={onClose}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs uppercase tracking-wider transition shadow-neon-glow hover:brightness-110"
          >
            <span>Inquire Directly</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#334155] text-slate-300 font-semibold hover:bg-[#1E293B] hover:text-white transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
