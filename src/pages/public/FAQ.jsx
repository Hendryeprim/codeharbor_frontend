import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Terminal } from 'lucide-react';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What is CoderHarbor & how does Harbor AI Copilot work?',
      a: 'CoderHarbor is a digital marketplace and centralized repository for production-grade software applications and developer boilerplates. Harbor AI Copilot analyzes customer functional requirements, matches them semantically to codebase repositories, and runs automated architectural security & scalability audits.',
    },
    {
      q: 'Why does the checkout show "Coming Soon"?',
      a: 'We are currently in Phase 1 of our product launch. Payment gateway integration (Stripe, Razorpay) is scheduled for the upcoming development phase. During this preview phase, you can explore detailed specifications, live demos, and download authorized free starter kits.',
    },
    {
      q: 'Can I download the free developer starter kits right now?',
      a: 'Yes! Any project marked as FREE and enabled for download can be downloaded instantly by registered customers directly from the project details page or via the customer Download Center.',
    },
    {
      q: 'What is included when a project is delivered?',
      a: 'Deliverables typically include complete source code (frontend and backend), database migration scripts (Prisma/SQL), environment variable templates, configuration files (such as Docker Compose), and architectural setup documentation.',
    },
    {
      q: 'What commercial rights do I get with a CoderHarbor project?',
      a: 'Standard commercial projects grant you the right to deploy and customize the code for personal, client, or enterprise production instances. Re-selling or distributing raw source code packages is strictly prohibited.',
    },
    {
      q: 'How does CoderHarbor protect source-code files?',
      a: 'All project archive files are kept in a protected private server storage directory completely segregated from the public web server root. Downloads require authenticated token verification and administrator authorization.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#E2E8F0]">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#C084FC]/10 text-[#C084FC] border border-[#C084FC]/30 mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]">
          Find answers regarding our platform architecture, licensing rules, and AI roadmap.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div
              key={index}
              className="bg-[#140F28]/90 rounded-2xl border border-[#322659]/80 overflow-hidden shadow-harbor-sm transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#1C1636]/60 transition"
              >
                <span className="font-bold text-xs sm:text-sm text-white">
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#C084FC] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#C0C7D1] leading-relaxed border-t border-[#322659]/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
