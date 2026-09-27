'use client';

import React from 'react';
import { Sparkles, Calendar, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-gold-200/60 dark:border-zinc-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold-700 bg-gold-100 dark:bg-zinc-800 dark:text-gold-300 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-gold-600" />
            <span>Protocole Actif</span>
          </span>
        </div>
        {subtitle && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </header>
  );
};
