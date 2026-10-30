import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#E2E8F0]">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Effective Date: October 2026</p>
      </div>

      <div className="bg-[#131B2E]/90 rounded-3xl p-8 sm:p-10 border border-[#334155]/80 shadow-harbor-sm space-y-6 text-xs sm:text-sm text-[#C0C7D1] leading-relaxed">
        <div>
          <h2 className="text-sm font-bold text-white mb-2">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when registering an account, updating your profile, using AI Copilot queries, or submitting support tickets (such as name, email address, phone, and organization).
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-2">2. How We Protect Your Data</h2>
          <p>
            Passwords are cryptographically hashed using industry-standard bcrypt before storage. We apply server-side rate limits, strict CORS policies, and role-based access control.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-2">3. Download Audit Logs</h2>
          <p>
            When downloading authorized source-code archives, download metadata (timestamp, user ID, IP address) is recorded to protect intellectual property and ensure platform integrity.
          </p>
        </div>
      </div>
    </div>
  );
};
