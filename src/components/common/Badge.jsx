import React from 'react';
import { Clock, CheckCircle2, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export const ComingSoonBadge = ({ size = 'sm', className = '' }) => {
  const sizeClasses = size === 'lg' ? 'px-3.5 py-1 text-xs font-bold' : 'px-2.5 py-0.5 text-[10px] font-semibold';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/35 backdrop-blur-md shadow-sm ${sizeClasses} ${className}`}
    >
      <Clock className={size === 'lg' ? 'w-3.5 h-3.5 text-amber-300' : 'w-3 h-3 text-amber-300'} />
      <span>Coming Soon</span>
    </span>
  );
};

export const FreeBadge = ({ size = 'sm', className = '' }) => {
  const sizeClasses = size === 'lg' ? 'px-3.5 py-1 text-xs font-black' : 'px-2.5 py-0.5 text-[10px] font-extrabold';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#9333EA]/25 text-white border border-[#A855F7]/60 backdrop-blur-md shadow-purple-glow ${sizeClasses} ${className}`}
    >
      <Sparkles className={size === 'lg' ? 'w-3.5 h-3.5 text-[#C084FC]' : 'w-3 h-3 text-[#C084FC]'} />
      <span className="tracking-wider">FREE ACCESS</span>
    </span>
  );
};

export const ProductTypeBadge = ({ type }) => {
  const labels = {
    FULL_APPLICATION: 'Full Application',
    TEMPLATE: 'Template / UI Kit',
    RESOURCE: 'Resource / Library',
    PLUGIN: 'Plugin / Module',
  };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#1C1636] text-[#C084FC] border border-[#322659]">
      {labels[type] || type}
    </span>
  );
};
