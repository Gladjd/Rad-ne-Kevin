'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, MapPin } from 'lucide-react';
import { STORY_MILESTONES } from '@/lib/mock-data';

export const StoryTimeline: React.FC = () => {
  return (
    <section id="histoire" className="py-24 px-4 bg-gradient-to-b from-ivory via-champagne/40 to-ivory dark:from-zinc-950 dark:via-zinc-900/40 dark:to-zinc-950 relative overflow-hidden">
      {/* Decorative floral aura */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blush-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-100 dark:bg-zinc-800 border border-gold-200 text-gold-800 dark:text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Notre Parcours</span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-50 font-normal">
            Notre Histoire d'Amour
          </h2>
          <p className="font-serif-luxury italic text-lg text-zinc-600 dark:text-zinc-400 mt-3">
            Chaque instant partagé nous a guidés jusqu’à ce jour inoubliable.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical central gold line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-300" />

          <div className="space-y-12 sm:space-y-16">
            {STORY_MILESTONES.map((milestone, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full md:w-1/2 p-2 sm:p-4">
                    <div className="glass-card-gold rounded-3xl p-6 sm:p-8 hover:shadow-gold-glow transition-all duration-300">
                      {/* Badge Year & Tag */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-serif-luxury text-3xl font-bold text-gold-600 dark:text-gold-400">
                          {milestone.year}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gold-100/80 dark:bg-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-gold-800 dark:text-gold-200">
                          {milestone.tag}
                        </span>
                      </div>

                      {/* Image Preview */}
                      <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden mb-4 shadow-inner group">
                        <img
                          src={milestone.image}
                          alt={milestone.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>

                      <h3 className="font-serif-luxury text-2xl text-zinc-900 dark:text-zinc-100 font-semibold mb-1">
                        {milestone.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-3">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{milestone.subtitle}</span>
                      </div>

                      <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Central Node / Marker */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-ivory dark:bg-zinc-900 border-2 border-gold-500 shadow-gold flex items-center justify-center text-gold-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Empty Spacer on opposite side for desktop */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
