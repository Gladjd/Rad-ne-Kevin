'use client';

import React from 'react';
import { Navbar } from '@/components/public/Navbar';
import { HeroSection } from '@/components/public/HeroSection';
import { StoryTimeline } from '@/components/public/StoryTimeline';
import { ProgramSection } from '@/components/public/ProgramSection';
import { RsvpSection } from '@/components/public/RsvpSection';
import { PhotoGalleryMasonry } from '@/components/public/PhotoGalleryMasonry';
import { GuestbookSection } from '@/components/public/GuestbookSection';
import { TableFinderWidget } from '@/components/public/TableFinderWidget';
import { RegistrySection } from '@/components/public/RegistrySection';
import { Footer } from '@/components/public/Footer';

export default function HomePage() {
  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-ivory text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 overflow-x-hidden selection:bg-gold-200 selection:text-gold-900">
      {/* Fixed Luxury Navigation */}
      <Navbar onOpenRsvp={scrollToRsvp} />

      {/* 1. Hero & Dynamic Live Countdown */}
      <HeroSection onRsvpClick={scrollToRsvp} />

      {/* 2. Notre Histoire d'Amour (Framer Motion Timeline) */}
      <StoryTimeline />

      {/* 3. Le Programme du Mariage, Hébergements & FAQ */}
      <ProgramSection />

      {/* 4. Flux RSVP Intelligent & Générateur de QR Pass */}
      <RsvpSection />

      {/* 5. Galerie Collaborative & Dépôt Instantané de Photos */}
      <PhotoGalleryMasonry />

      {/* 6. Livre d'Or Numérique & Mots Doux */}
      <GuestbookSection />

      {/* 7. Trouver Ma Table (Widget Prédictif) */}
      <TableFinderWidget />

      {/* 8. Liste de Mariage & Cagnotte Voyage de Noces */}
      <RegistrySection />

      {/* 9. Pied de Page */}
      <Footer />
    </main>
  );
}
