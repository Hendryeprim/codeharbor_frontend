import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Compass, ShieldCheck, Heart, Sparkles, Terminal, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#06040C] text-[#C4B5FD] pt-16 pb-12 border-t border-[#322659]/80 relative overflow-hidden">
      {/* Decorative Purple Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#9333EA]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C084FC]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <div className="relative">
                <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#C084FC] opacity-40 blur-md group-hover:opacity-75 transition" />
                <img
                  src="/logo.png"
                  alt="CoderHarbor Logo"
                  className="relative h-12 w-auto object-contain brightness-110"
                />
              </div>
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              <strong className="text-white">CoderHarbor</strong> is an advanced, centralized digital software repository engineered for developers and agencies to explore, inspect, and acquire production-grade codebases with integrated Harbor AI architectural matching.
            </p>
            <p className="text-xs text-[#C084FC] font-mono flex items-center gap-2 pt-1">
              <Compass className="w-4 h-4 text-white" />
              <span>"Your Projects. Your Possibilities."</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
              Platform Matrix
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/projects" className="text-slate-300 hover:text-white hover:underline transition">
                  Explore Catalogue
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-slate-300 hover:text-white hover:underline transition">
                  Industry Verticals
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white hover:underline transition">
                  About CoderHarbor
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white hover:underline transition">
                  Technical Consultation
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-white hover:underline transition">
                  Platform Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA]" />
              Featured Stacks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/projects?category=web-applications" className="text-slate-300 hover:text-white hover:underline transition">
                  Cloud SaaS Systems
                </Link>
              </li>
              <li>
                <Link to="/projects?category=billing-software" className="text-slate-300 hover:text-white hover:underline transition">
                  Billing & Tax Engines
                </Link>
              </li>
              <li>
                <Link to="/projects?category=developer-templates" className="text-slate-300 hover:text-white hover:underline transition">
                  Developer Boilerplates
                </Link>
              </li>
              <li>
                <Link to="/projects?category=education-and-lms" className="text-slate-300 hover:text-white hover:underline transition">
                  Academy & LMS Hubs
                </Link>
              </li>
              <li>
                <Link to="/projects?category=erp-and-crm" className="text-slate-300 hover:text-white hover:underline transition">
                  Enterprise ERP Suites
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Directives */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC]" />
              Legal & Protocol
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-white hover:underline transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-white hover:underline transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-slate-300 hover:text-white hover:underline transition">
                  License & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-slate-300 hover:text-white hover:underline transition">
                  Source Code Escrow
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Corporate Headquarters Address Bar */}
        <div className="pt-8 border-t border-[#322659]/70 text-xs text-slate-300 space-y-4">
          <div className="p-4 rounded-2xl bg-[#140F28] border border-[#322659]/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-xs">TRIDIN SOFTWARE PRIVATE LIMITED</p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  6th Floor, Block B, TECCI PARK, M229, #173, Cactus Corporate Coworking, Rajiv Gandhi Salai, OMR, Chennai, Tamil Nadu 600119
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-200 shrink-0">
              <a href="tel:+919600045602" className="flex items-center gap-1.5 hover:text-white transition">
                <Phone className="w-3.5 h-3.5 text-[#C084FC]" />
                <span>+91 96000 45602</span>
              </a>
              <a href="mailto:support@coderharbor.com" className="flex items-center gap-1.5 hover:text-white transition">
                <Mail className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>support@coderharbor.com</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-[11px] text-slate-400">
              &copy; {new Date().getFullYear()} CoderHarbor. Operated by <strong className="text-white font-bold">TRIDIN SOFTWARE PRIVATE LIMITED</strong>. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#C084FC]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-ping" />
                <span className="text-white font-semibold">Secure Core v2.4</span>
              </span>
              <span>•</span>
              <span className="text-slate-400">Purchasing Pipeline: <span className="text-white font-bold bg-[#9333EA]/20 px-2 py-0.5 rounded border border-[#A855F7]/30">Coming Soon</span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
