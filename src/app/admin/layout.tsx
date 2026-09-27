'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured, weddingStore } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'ADMIN' | 'PROTOCOLE'>('ADMIN');

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndRole = async () => {
      if (isLoginPage) {
        setIsLoading(false);
        return;
      }

      if (supabase && isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        const role = await weddingStore.getUserRole(user.id);
        if (isMounted) {
          setUserRole(role);

          // Enforce PROTOCOLE restriction
          if (role === 'PROTOCOLE' && !pathname.startsWith('/admin/scanner')) {
            router.push('/admin/scanner');
            return;
          }
        }
      } else {
        // Fallback for local demo mode
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

    // Subscribe to auth state changes
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

  // If on login page, render full screen without layout sidebar
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
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col md:flex-row">
      <AdminSidebar userRole={userRole} />
      <main className="flex-1 overflow-x-hidden min-h-screen flex flex-col bg-paper-warm dark:bg-zinc-900/60">
        {children}
      </main>
    </div>
  );
}
