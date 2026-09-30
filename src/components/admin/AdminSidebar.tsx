'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  QrCode,
  Users,
  Grid,
  Image as ImageIcon,
  Mail,
  MessageCircle,
  Kanban,
  LogOut,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface AdminSidebarProps {
  userRole?: 'ADMIN' | 'PROTOCOLE';
  onLogout?: () => void;
  onNavigate?: () => void;
  isMobileDrawer?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  userRole = 'ADMIN',
  onLogout,
  onNavigate,
  isMobileDrawer = false,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    if (onLogout) {
      onLogout();
    } else {
      router.push('/admin/login');
      router.refresh();
    }
    toast.info('Vous avez été déconnecté.');
  };

  const allLinks = [
    { name: 'Vue d’Ensemble', href: '/admin', icon: LayoutDashboard, adminOnly: true },
    { name: 'Scanner Jour J (Protocole)', href: '/admin/scanner', icon: QrCode, isHighlight: true, adminOnly: false },
    { name: 'Gestion des Invités', href: '/admin/invites', icon: Users, adminOnly: true },
    { name: 'Plan de Table 2D', href: '/admin/plan-de-table', icon: Grid, adminOnly: true },
    { name: 'Modération Photos', href: '/admin/moderation', icon: ImageIcon, adminOnly: true },
    { name: 'Faire-parts & WhatsApp', href: '/admin/relances', icon: MessageCircle, adminOnly: true },
    { name: 'Kanban Organisation', href: '/admin/kanban', icon: Kanban, adminOnly: true },
  ];

  const visibleLinks = userRole === 'PROTOCOLE'
    ? allLinks.filter((l) => !l.adminOnly)
    : allLinks;

  return (
    <aside
      className={cn(
        'bg-royal-950 text-white flex flex-col',
        isMobileDrawer
          ? 'w-full h-full'
          : 'hidden md:flex w-64 border-r border-gold-500/30 shrink-0 h-screen sticky top-0 shadow-xl'
      )}
    >
      {/* Brand Header with Monogram */}
      <div className="p-6 border-b border-zinc-800/80">
        <Link
          href="/"
          onClick={onNavigate}
          className="group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full p-0.5 border border-gold-400 shadow-sm bg-white shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/img/logo.png"
              alt="Monogramme R & K"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-serif-luxury text-lg font-bold text-white block">
              Radène &amp; Kévin
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 block">
              {userRole === 'PROTOCOLE' ? 'Espace Protocole' : 'Administration'}
            </span>
          </div>
        </Link>

        {/* Role Badge */}
        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-royal-900/90 border border-gold-400/40">
          {userRole === 'PROTOCOLE' ? (
            <>
              <Smartphone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div className="text-[10px] leading-tight">
                <span className="font-bold text-cyan-300 block uppercase">Rôle : Protocole</span>
                <span className="text-zinc-400 text-[9px]">Accès Scanner uniquement</span>
              </div>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <div className="text-[10px] leading-tight">
                <span className="font-bold text-gold-300 block uppercase">Rôle : Administrateur</span>
                <span className="text-zinc-400 text-[9px]">Accès complet</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all',
                isActive
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold font-bold'
                  : link.isHighlight
                  ? 'bg-gold-500/15 text-gold-300 border border-gold-400/40 hover:bg-gold-500/25'
                  : 'text-zinc-300 hover:text-white hover:bg-royal-900/60'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-white' : link.isHighlight ? 'text-gold-400' : 'text-zinc-400')} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-zinc-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-gold-300 hover:bg-royal-900/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Voir le site public</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/15 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};
