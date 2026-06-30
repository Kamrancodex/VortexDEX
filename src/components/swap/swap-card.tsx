'use client';

import { ReactNode } from 'react';

interface SwapCardProps {
  children: ReactNode;
}

export function SwapCard({ children }: SwapCardProps) {
  return (
    <div className="relative vortex-card rounded-3xl vortex-glow overflow-hidden">
      {/* Subtle animated top border glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent opacity-60" />
      {children}
    </div>
  );
}