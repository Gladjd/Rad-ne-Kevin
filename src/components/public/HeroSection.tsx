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
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-4">
      {/* Ambient background imagery & gradient overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/80 via-ivory/70 to-ivory dark:from-zinc-950/85 dark:via-zinc-950/80 dark:to-zinc-950" />
      </div>

      {/* Floating decorative sparkles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gold-300/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blush-300/20 rounded-full blur-3xl animate-pulse-glow delay-700" />
      </div>

      {/* Main Hero Card Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Monogram / Top Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-gold-300/60 text-gold-800 dark:text-gold-200 text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span>Mariage de Radene & Kevin</span>
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
        </motion.div>

        {/* Calligraphy Names */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-normal text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-4"
        >
          Radene <span className="font-script-calligraphy text-gold-500 text-6xl sm:text-8xl lg:text-9xl mx-1">&</span> Kevin
        </motion.h1>

        {/* Romantic tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-serif-luxury italic text-xl sm:text-2xl text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto mb-6"
        >
          « Nous avons l'immense joie de vous convier à célébrer notre union et le début de notre nouvelle aventure. »
        </motion.p>

        {/* Date & Location Pill Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium tracking-wider uppercase text-zinc-800 dark:text-zinc-200 mb-10"
        >
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full border border-gold-200 shadow-sm">
            <Calendar className="w-4 h-4 text-gold-600 dark:text-gold-400" />
            <span>Samedi 20 Juin 2026</span>
          </div>
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full border border-gold-200 shadow-sm">
            <MapPin className="w-4 h-4 text-gold-600 dark:text-gold-400" />
            <span>Château Saint-Georges • Grasse</span>
          </div>
        </motion.div>

        {/* Live Dynamic Countdown */}
        <div className="mb-10">
          <Countdown targetDate="2026-06-20T15:00:00+02:00" />
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
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel hover:bg-white/90 dark:hover:bg-zinc-800 border border-gold-300/80 text-zinc-800 dark:text-zinc-100 font-semibold text-xs sm:text-sm uppercase tracking-widest shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 text-rose-500" />
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
            className="text-zinc-400 hover:text-gold-600 transition-colors animate-bounce p-2"
            aria-label="Faire défiler"
          >
            <ChevronDown className="w-6 h-6" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
