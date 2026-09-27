'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ShieldCheck, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-royal-950 text-white pt-16 pb-12 border-t border-gold-500/30 relative overflow-hidden">
      {/* Decorative golden aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-20 bg-gold-400/10 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Monogram with official logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full p-0.5 border border-gold-400 shadow-gold bg-white mb-3">
            <img
              src="/img/logo.png"
              alt="Monogramme R & K"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-serif-luxury text-3xl sm:text-4xl text-gold-300 font-bold tracking-wide block">
            Radène &amp; Kévin
          </span>
          <span className="font-serif-luxury text-xs sm:text-sm tracking-widest text-gold-200/80 uppercase mt-1 block">
            Samedi 5 Décembre 2026 • Paroisse Sainte-Thérèse de Dieuppeul, Dakar
          </span>
          <span className="text-[11px] text-zinc-400 tracking-wider uppercase mt-1 block font-medium">
            « Pureté • Amour • Charité »
          </span>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-wider text-zinc-300 font-medium mb-10">
          <Link href="/#histoire" className="hover:text-gold-300 transition-colors">
            Notre Histoire
          </Link>
          <Link href="/#programme" className="hover:text-gold-300 transition-colors">
            Programme
          </Link>
          <Link href="/#rsvp" className="hover:text-gold-300 transition-colors text-gold-400 font-bold">
            RSVP
          </Link>
          <Link href="/#galerie" className="hover:text-gold-300 transition-colors">
            Galerie Photos
          </Link>
          <Link href="/#livredor" className="hover:text-gold-300 transition-colors">
            Livre d'Or
          </Link>
          <Link href="/#table-finder" className="hover:text-gold-300 transition-colors">
            Trouver ma Table
          </Link>
          <Link href="/#cagnotte" className="hover:text-gold-300 transition-colors">
            Cagnotte
          </Link>
        </div>

        {/* Divider */}
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-8" />

        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div className="flex items-center gap-1.5">
            <span>Créé avec amour pour notre mariage</span>
            <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            <span>#RadeneKevin2026</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-zinc-300 hover:text-gold-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Espace Protocole / Admin</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-royal-900 border border-gold-400 hover:bg-gold-500 hover:text-white transition-colors text-gold-300"
              title="Remonter en haut"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
