'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Menu, Sparkles, ShieldCheck, Smartphone, QrCode } from 'lucide-react';
import { supabase, isSupabaseConfigured, weddingStore } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'ADMIN' | 'PROTOCOLE'>('ADMIN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndRole = async () => {
      if (isLoginPage) {
        setIsLoading(false);
        return;
      }

      if (supabase && isSupabaseConfigured) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        const role = await weddingStore.getUserRole(user.id);
        if (isMounted) {
          setUserRole(role);

          // Restriction stricte pour le rôle PROTOCOLE
          if (role === 'PROTOCOLE' && !pathname.startsWith('/admin/scanner')) {
            router.push('/admin/scanner');
            return;
          }
        }
      } else {
        // Mode démo local
        const role = await weddingStore.getUserRole();
        if (isMounted) {
          setUserRole(role);
          if (role === 'PROTOCOLE' && !pathname.startsWith('/admin/scanner')) {
            router.push('/admin/scanner');
            return;
          }
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    checkAuthAndRole();

    // Abonnement aux changements d'authentification
    if (supabase && isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/admin/login');
        } else if (session?.user) {
          const role = await weddingStore.getUserRole(session.user.id);
          if (isMounted) {
            setUserRole(role);
          }
        }
      });

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  // Si sur la page de connexion, affichage plein écran sans sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-royal-950 flex flex-col items-center justify-center text-gold-400 gap-3">
        <Sparkles className="w-8 h-8 animate-spin text-gold-400" />
        <span className="font-serif-luxury text-sm tracking-widest uppercase text-gold-200">
          Chargement de l’espace sécurisé...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-warm dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* 1. Barre de navigation supérieure visible UNIQUEMENT sur mobile (< md) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-royal-950 text-white border-b border-gold-500/30 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          {/* Bouton Hamburger avec Drawer Sheet Shadcn UI */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="p-2 rounded-xl bg-royal-900 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 active:scale-95 transition-all"
                aria-label="Ouvrir le menu de navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="p-0 w-72 sm:w-80 bg-royal-950 border-r border-gold-500/30 text-white overflow-y-auto"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Menu de Navigation Back-Office</SheetTitle>
                <SheetDescription>Accédez aux sections d'administration et de protocole</SheetDescription>
              </SheetHeader>

              <AdminSidebar
                userRole={userRole}
                onNavigate={() => setMobileMenuOpen(false)}
                isMobileDrawer={true}
              />
            </SheetContent>
          </Sheet>

          {/* Logo & Titre Mobile */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full p-0.5 border border-gold-400 bg-white shrink-0">
              <img
                src="/img/logo.png"
                alt="Logo R & K"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif-luxury text-base font-bold text-white tracking-wide">
              Radène &amp; Kévin
            </span>
          </Link>
        </div>

        {/* Badge Rôle & Raccourci Scanner sur mobile */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-royal-900 border border-gold-400/40 text-[10px] font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1">
            {userRole === 'PROTOCOLE' ? (
              <>
                <Smartphone className="w-3 h-3 text-cyan-400" />
                <span>Protocole</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3 text-gold-400" />
                <span>Admin</span>
              </>
            )}
          </span>

          <Link
            href="/admin/scanner"
            className="p-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white shadow-gold transition-transform active:scale-95"
            title="Lancer le scanner QR"
          >
            <QrCode className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* 2. Barre latérale fixe sur desktop (hidden sur mobile) */}
      <AdminSidebar userRole={userRole} />

      {/* 3. Conteneur principal 100% responsive */}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden min-h-screen flex flex-col bg-paper-warm dark:bg-zinc-900/60">
        {children}
      </main>
    </div>
  );
}
