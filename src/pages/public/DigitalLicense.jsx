import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Terminal } from 'lucide-react';

export const DigitalLicense = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#E2E8F0]">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#00FFC6]/10 text-[#00FFC6] border border-[#00FFC6]/30 mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>Legal Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Digital Product License Agreement
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]">
          Guidelines and rights governing all software packages acquired or downloaded on CoderHarbor.
        </p>
      </div>

      <div className="bg-[#131B2E]/90 rounded-3xl p-8 sm:p-10 border border-[#334155]/80 shadow-harbor-sm space-y-8 text-xs sm:text-sm text-[#C0C7D1] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">1. Grant of License</h2>
          <p>
            When you obtain or download a software project or template from CoderHarbor, you are granted a non-exclusive, non-transferable license to use, adapt, and deploy the source code according to the tier of license specified for that individual item.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-bold text-white">2. Permitted Actions vs Prohibited Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 space-y-2 text-xs">
              <h3 className="font-bold text-[#00FFC6] flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#00FFC6]" />
                <span>You May:</span>
              </h3>
              <ul className="list-disc list-inside space-y-1 text-emerald-200">
                <li>Deploy live applications for personal or client use.</li>
                <li>Modify and extend the codebase freely.</li>
                <li>Integrate with 3rd-party APIs and databases.</li>
                <li>Host on private or public cloud infrastructure.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 space-y-2 text-xs">
              <h3 className="font-bold text-rose-300 flex items-center gap-1.5 text-sm">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>You May NOT:</span>
              </h3>
              <ul className="list-disc list-inside space-y-1 text-rose-200">
                <li>Re-sell or re-distribute the raw source code.</li>
                <li>Upload raw files to public code repositories.</li>
                <li>Claim original authorship of foundational templates.</li>
                <li>Sub-license to competitor marketplace entities.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">3. Open-Source Free Deliverables</h2>
          <p>
            Items designated as "FREE" in the CoderHarbor catalogue and authorized for download are governed either under the standard MIT License or Apache 2.0 license as stipulated in the repository manifest.
          </p>
        </section>
      </div>
    </div>
  );
};
