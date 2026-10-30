import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Compass, ShieldCheck, Heart, Sparkles, Terminal, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#070A12] text-[#C0C7D1] pt-16 pb-12 border-t border-[#334155]/60 relative overflow-hidden">
      {/* Decorative Cyber Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00FFC6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] opacity-30 blur-sm group-hover:opacity-60 transition" />
                <img
                  src="/image.png"
                  alt="CoderHarbor Logo"
                  className="relative h-12 w-auto object-contain brightness-110"
                />
              </div>
            </Link>
            <p className="text-xs text-[#C0C7D1] leading-relaxed max-w-sm">
              <strong className="text-white">CoderHarbor</strong> is an advanced, centralized digital software repository engineered for developers and agencies to explore, inspect, and acquire production-grade codebases with integrated Harbor AI architectural matching.
            </p>
            <p className="text-xs text-[#00FFC6] font-mono flex items-center gap-2 pt-1">
              <Compass className="w-4 h-4 text-[#22D3EE]" />
              <span>"Your Projects. Your Possibilities."</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#00FFC6]">Platform Matrix</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/projects" className="hover:text-[#22D3EE] transition">
                  Explore Catalogue
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#22D3EE] transition">
                  Industry Verticals
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#22D3EE] transition">
                  About CoderHarbor
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#22D3EE] transition">
                  Technical Consultation
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#22D3EE] transition">
                  Platform Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0EA5E9]">Featured Stacks</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/projects?category=web-applications" className="hover:text-[#22D3EE] transition">
                  Cloud SaaS Systems
                </Link>
              </li>
              <li>
                <Link to="/projects?category=billing-software" className="hover:text-[#22D3EE] transition">
                  Billing & Tax Engines
                </Link>
              </li>
              <li>
                <Link to="/projects?category=developer-templates" className="hover:text-[#22D3EE] transition">
                  Developer Boilerplates
                </Link>
              </li>
              <li>
                <Link to="/projects?category=education-and-lms" className="hover:text-[#22D3EE] transition">
                  Academy & LMS Hubs
                </Link>
              </li>
              <li>
                <Link to="/projects?category=erp-and-crm" className="hover:text-[#22D3EE] transition">
                  Enterprise ERP Suites
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Directives */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C0C7D1]">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/license" className="hover:text-[#22D3EE] transition">
                  Digital Product License
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#22D3EE] transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#22D3EE] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#00FFC6] transition text-[11px] text-slate-400">
                  Staff Console Login
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131B2E] text-[10px] text-amber-400 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                Payment Gateways: Coming Soon
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#334155]/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CoderHarbor. Next-Gen Software Marketplace.</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-[#C0C7D1]">
            <Terminal className="w-3.5 h-3.5 text-[#00FFC6]" />
            <span>Built for developers in the Harbor</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
