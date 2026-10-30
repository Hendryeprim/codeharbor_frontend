import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Ship, Code2, ShieldCheck, Cpu, ArrowRight, Sparkles, Terminal, Bot } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="space-y-16 py-12 text-[#E2E8F0]">
      {/* Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#00FFC6]/10 text-[#00FFC6] border border-[#00FFC6]/30 mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>About CoderHarbor</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
          Your Projects. <span className="text-gradient-cyan">Your Possibilities.</span>
        </h1>
        <p className="text-xs sm:text-base text-[#C0C7D1] leading-relaxed font-normal">
          CoderHarbor was built for modern engineers: software architectures should be accessible, transparent, and built on rock-solid foundations. We provide a centralized harbor where creators showcase battle-tested codebases and developers find the launchpad for their next breakthrough with integrated AI assistance.
        </p>
      </section>

      {/* Brand Concept & Harbor Metaphor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#131B2E]/90 rounded-3xl p-8 sm:p-12 border border-[#334155]/80 shadow-harbor-sm grid grid-cols-1 md:grid-cols-2 gap-10 items-center backdrop-blur-xl">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00FFC6]">
              The Harbor Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              A Safe Port for Software Excellence
            </h2>
            <p className="text-xs text-[#C0C7D1] leading-relaxed">
              Just like ships dock in a harbor to exchange cargo and set sail toward distant waters, developers bring their projects to CoderHarbor. Every codebase hosted here is reviewed for clarity, modern dependency management, security compliance, and architectural documentation.
            </p>
            <p className="text-xs text-[#C0C7D1] leading-relaxed">
              Whether you need a complete enterprise SaaS foundation, a billing portal, an automated workflow engine, or clean developer boilerplate, you're docking at the right harbor.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-8 rounded-3xl bg-[#0F172A] text-center max-w-sm w-full shadow-harbor-md border border-[#334155]">
              <div className="relative inline-block mb-4">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] opacity-30 blur-sm" />
                <img
                  src="/image.png"
                  alt="CoderHarbor"
                  className="relative h-28 w-auto mx-auto object-contain"
                />
              </div>
              <p className="text-xs text-[#00FFC6] font-mono tracking-wider">
                ESTABLISHED 2026
              </p>
              <h4 className="text-base font-bold text-white mt-1">CoderHarbor Platform</h4>
              <p className="text-[11px] text-slate-400 mt-2">
                Centralized Digital Project Repository & AI Developer Ecosystem
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Built on Uncompromising Principles
          </h2>
          <p className="text-xs sm:text-sm text-[#C0C7D1]">
            How we protect developers and elevate software standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#131B2E]/90 p-7 rounded-3xl border border-[#334155]/80 shadow-harbor-sm">
            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/15 text-[#0EA5E9] flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">No Spaghetti Code</h3>
            <p className="text-xs text-[#C0C7D1] leading-relaxed">
              We curate modular, maintainable, and type-conscious projects. Clean directory hierarchies, separated layers, and readable comments.
            </p>
          </div>

          <div className="bg-[#131B2E]/90 p-7 rounded-3xl border border-[#334155]/80 shadow-harbor-sm">
            <div className="w-10 h-10 rounded-xl bg-[#00FFC6]/15 text-[#00FFC6] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Private & Protected Storage</h3>
            <p className="text-xs text-[#C0C7D1] leading-relaxed">
              Source code files are kept outside the public web root. Only authorized customers can access permitted downloads under verified sessions.
            </p>
          </div>

          <div className="bg-[#131B2E]/90 p-7 rounded-3xl border border-[#334155]/80 shadow-harbor-sm">
            <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/15 text-[#22D3EE] flex items-center justify-center mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">AI-Powered Copilot</h3>
            <p className="text-xs text-[#C0C7D1] leading-relaxed">
              Intelligent architecture diagnostics and semantic requirement matching helping engineers deploy faster.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] font-extrabold text-xs uppercase tracking-wider shadow-neon-glow hover:brightness-110 transition"
        >
          <span>Explore Available Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
