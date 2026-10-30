import React from 'react';

export const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#E2E8F0]">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
          Terms and Conditions
        </h1>
        <p className="text-xs text-slate-400">Effective Date: October 2026</p>
      </div>

      <div className="bg-[#131B2E]/90 rounded-3xl p-8 sm:p-10 border border-[#334155]/80 shadow-harbor-sm space-y-6 text-xs sm:text-sm text-[#C0C7D1] leading-relaxed">
        <div>
          <h2 className="text-sm font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CoderHarbor, you agree to be bound by these Terms and Conditions and all applicable digital marketplace laws and regulations.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-2">2. Digital Marketplace Nature & Payment Status</h2>
          <p>
            CoderHarbor provides a showcase of software projects. Direct online payment checkout is currently scheduled for future release phases and is marked as "Coming Soon". No unauthorized transactions are processed.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-2">3. User Accounts & AI Tools</h2>
          <p>
            You are responsible for maintaining the confidentiality of your credentials. CoderHarbor reserves the right to restrict or terminate accounts that breach platform rules or attempt unauthorized file access.
          </p>
        </div>
      </div>
    </div>
  );
};
