'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { Countdown } from './Countdown';

interface HeroSectionProps {
  onRsvpClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onRsvpClick }) => {
  return (
    <section className="relative min-h-[95vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 px-4 paper-texture">
      {/* Subtle royal blue and gold watercolor washes in background */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-royal-100/40 via-gold-100/30 to-royal-50/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-royal-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 left-10 w-80 h-80 bg-gold-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Card Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Monogram / Top Logo Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center mb-6"
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 border-2 border-gold-400 shadow-gold bg-white mb-4 hover:scale-105 transition-transform duration-500 group">
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-paper-warm">
              <img
                src="/img/logo.png"
                alt="Monogramme R & K - Radène & Kévin"
                className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Ambient golden aura around monogram */}
            <div className="absolute inset-0 rounded-full border border-gold-300/40 animate-pulse pointer-events-none" />
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/90 dark:bg-royal-950/80 border border-gold-400 text-royal-900 dark:text-gold-300 text-xs font-bold tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Pureté • Amour • Charité</span>
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          </div>
        </motion.div>

        {/* Calligraphy Names */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-normal text-royal-950 dark:text-zinc-50 tracking-tight leading-none mb-3"
        >
          Radène <span className="font-script-calligraphy text-gold-500 text-6xl sm:text-8xl lg:text-9xl mx-1">&amp;</span> Kévin
        </motion.h1>

        {/* Romantic & Spiritual tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-serif-luxury italic text-xl sm:text-2xl text-royal-900/85 dark:text-zinc-300 max-w-2xl mx-auto mb-6"
        >
          « Ce que Dieu a uni, que l’homme ne le sépare point. Nous avons l’immense joie de vous convier à notre saint sacrement de mariage. »
        </motion.p>

        {/* Date & Location Pill Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold tracking-wider uppercase text-royal-950 dark:text-zinc-200 mb-8"
        >
          <div className="flex items-center gap-2 bg-white/95 px-5 py-2.5 rounded-full border border-gold-400 shadow-sm">
            <Calendar className="w-4 h-4 text-gold-600" />
            <span>Samedi 5 Décembre 2026 • 11h00</span>
          </div>
          <div className="flex items-center gap-2 bg-white/95 px-5 py-2.5 rounded-full border border-gold-400 shadow-sm">
            <MapPin className="w-4 h-4 text-gold-600" />
            <span>Eglise Protestante de Dieuppeul • Dakar</span>
          </div>
        </motion.div>

        {/* Live Dynamic Countdown to 5 Décembre 2026 11h00 */}
        <div className="mb-10">
          <Countdown targetDate="2026-12-05T11:00:00+00:00" />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onRsvpClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white font-semibold text-xs sm:text-sm uppercase tracking-widest shadow-gold hover:shadow-gold-glow transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirmer ma présence (RSVP)</span>
          </button>

          <a
            href="#histoire"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/95 hover:bg-gold-50/80 dark:bg-royal-950/80 dark:hover:bg-royal-900 border border-gold-400 text-royal-950 dark:text-zinc-100 font-semibold text-xs sm:text-sm uppercase tracking-widest shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 text-royal-700 dark:text-gold-400" />
            <span>Découvrir notre histoire</span>
          </a>
        </motion.div>

        {/* Down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="#histoire"
            className="text-gold-600 hover:text-royal-900 transition-colors animate-bounce p-2"
            aria-label="Faire défiler"
          >
            <ChevronDown className="w-6 h-6" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
