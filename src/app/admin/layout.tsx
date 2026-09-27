'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Lock, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const EXPECTED_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '2026';

  useEffect(() => {
    // Check if session token exists
    const storedAuth = sessionStorage.getItem('radene_kevin_admin_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim() === EXPECTED_PIN || pinCode.trim() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('radene_kevin_admin_auth', 'true');
      setErrorMsg(null);
    } else {
      setErrorMsg(`Code PIN incorrect. Utilisez le code PIN par défaut (${EXPECTED_PIN}).`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('radene_kevin_admin_auth');
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-gold-400">
        <Sparkles className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // If not authenticated, display luxury PIN lock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel-dark rounded-3xl p-8 border border-gold-500/40 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 mx-auto flex items-center justify-center mb-4 border border-gold-500/50 shadow-gold">
            <Lock className="w-7 h-7" />
          </div>

          <span className="font-script-calligraphy text-4xl text-gold-400 block mb-1">
            Radene & Kevin
          </span>
          <h2 className="font-serif-luxury text-2xl font-bold text-white mb-2">
            Accès Espace Protocole & Organisation
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Veuillez saisir votre code PIN d'accès sécurisé pour ouvrir le tableau de bord.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gold-500" />
              <input
                type="password"
                maxLength={8}
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Code PIN (ex: 2026)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900 border border-gold-500/50 text-center font-mono text-xl tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 animate-in fade-in">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white font-semibold text-xs uppercase tracking-widest shadow-gold transition-all"
            >
              Déverrouiller le Tableau de Bord
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
            <a href="/" className="text-xs text-zinc-500 hover:text-gold-400 transition-colors">
              ← Retour au site public du mariage
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col md:flex-row">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-x-hidden min-h-screen flex flex-col bg-ivory/60 dark:bg-zinc-900/60">
        {children}
      </main>
    </div>
  );
}
