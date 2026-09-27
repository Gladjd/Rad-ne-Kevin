'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ShieldCheck, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-12 border-t border-gold-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Monogram */}
        <div className="mb-6">
          <span className="font-script-calligraphy text-5xl sm:text-6xl text-gold-400 block hover:scale-105 transition-transform cursor-default">
            Radene & Kevin
          </span>
          <span className="font-serif-luxury text-sm tracking-widest text-zinc-400 uppercase mt-2 block">
            Samedi 20 Juin 2026 • Château Saint-Georges, Grasse
          </span>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-wider text-zinc-400 font-medium mb-10">
          <Link href="/#histoire" className="hover:text-gold-400 transition-colors">
            Notre Histoire
          </Link>
          <Link href="/#programme" className="hover:text-gold-400 transition-colors">
            Programme
          </Link>
          <Link href="/#rsvp" className="hover:text-gold-400 transition-colors text-gold-400 font-bold">
            RSVP
          </Link>
          <Link href="/#galerie" className="hover:text-gold-400 transition-colors">
            Galerie Photos
          </Link>
          <Link href="/#livredor" className="hover:text-gold-400 transition-colors">
            Livre d'Or
          </Link>
          <Link href="/#table-finder" className="hover:text-gold-400 transition-colors">
            Trouver ma Table
          </Link>
          <Link href="/#cagnotte" className="hover:text-gold-400 transition-colors">
            Cagnotte
          </Link>
        </div>

        {/* Divider */}
        <div className="w-24 h-0.5 bg-gold-600/40 mx-auto mb-8" />

        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <div className="flex items-center gap-1.5">
            <span>Créé avec amour pour notre mariage</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>#RadeneKevin2026</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-zinc-400 hover:text-gold-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Espace Protocole / Admin</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-zinc-900 hover:bg-gold-500 hover:text-white transition-colors"
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
