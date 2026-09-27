'use client';

import React from 'react';
import { Gift, ExternalLink, Heart, Sparkles, Plane, Palmtree } from 'lucide-react';

export const RegistrySection: React.FC = () => {
  const cagnotteUrl = process.env.NEXT_PUBLIC_CAGNOTTE_URL || 'https://www.leetchi.com/c/mariage-radene-kevin';

  return (
    <section id="cagnotte" className="py-24 px-4 bg-gradient-to-b from-ivory via-champagne/30 to-ivory dark:from-zinc-950 dark:via-zinc-900/30 dark:to-zinc-950 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-100 dark:bg-zinc-800 border border-gold-200 text-gold-800 dark:text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3">
            <Gift className="w-3.5 h-3.5 text-gold-600" />
            <span>Liste de Mariage</span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-50 font-normal">
            Voyage de Noces
          </h2>
          <p className="font-serif-luxury italic text-lg text-zinc-600 dark:text-zinc-400 mt-2">
            Votre présence à nos côtés est notre plus beau cadeau.
          </p>
        </div>

        {/* Registry Presentation Card */}
        <div className="glass-card-gold rounded-3xl p-6 sm:p-12 shadow-gold text-center relative overflow-hidden">
          {/* Decorative background badges */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gold-100 text-gold-700">
              <Plane className="w-6 h-6" />
            </div>
            <div className="p-3 rounded-2xl bg-gold-100 text-gold-700">
              <Palmtree className="w-6 h-6" />
            </div>
          </div>

          <h3 className="font-serif-luxury text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Destination : La Polynésie Française & Bora Bora
          </h3>

          <p className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Pour celles et ceux qui souhaiteraient nous accompagner dans le financement de notre lune de miel au bout du monde, une urne élégante sera à votre disposition le jour J lors du cocktail, ou vous pouvez contribuer directement en ligne via notre cagnotte sécurisée.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={cagnotteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white font-semibold text-xs uppercase tracking-widest shadow-gold hover:shadow-gold-glow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>Participer à la Cagnotte en Ligne</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-6 italic">
            Paiement 100% sécurisé via carte bancaire. Mille mercis pour votre générosité !
          </p>
        </div>
      </div>
    </section>
  );
};
