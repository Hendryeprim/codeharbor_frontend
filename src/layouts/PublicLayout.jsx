import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HarborAICopilot } from '../components/ai/HarborAICopilot';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F1A] text-[#E2E8F0]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Global AI Copilot */}
      <HarborAICopilot />
    </div>
  );
};
