'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  QrCode,
  Users,
  Grid,
  Image as ImageIcon,
  Mail,
  Kanban,
  LogOut,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const pathname = usePathname();

  const links = [
    { name: 'Vue d\'Ensemble', href: '/admin', icon: LayoutDashboard },
    { name: 'Scanner Jour J (Protocole)', href: '/admin/scanner', icon: QrCode, isHighlight: true },
    { name: 'Gestion des Invités', href: '/admin/invites', icon: Users },
    { name: 'Plan de Table 2D', href: '/admin/plan-de-table', icon: Grid },
    { name: 'Modération Photos', href: '/admin/moderation', icon: ImageIcon },
    { name: 'Relances Email / SMS', href: '/admin/relances', icon: Mail },
    { name: 'Kanban Organisation', href: '/admin/kanban', icon: Kanban },
  ];

  return (
    <aside className="w-64 bg-zinc-950 text-white flex flex-col border-r border-gold-900/40 shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800/80">
        <Link href="/" className="group block">
          <span className="font-script-calligraphy text-3xl text-gold-400 block group-hover:scale-105 transition-transform">
            Radene & Kevin
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mt-1">
            Back-Office & Protocole
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all',
                isActive
                  ? 'bg-gradient-to-r from-gold-600 to-gold-700 text-white shadow-gold'
                  : link.isHighlight
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:bg-gold-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-white' : link.isHighlight ? 'text-gold-400' : 'text-zinc-400')} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Quick Link */}
      <div className="p-4 border-t border-zinc-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Voir le site public</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        )}
      </div>
    </aside>
  );
};
