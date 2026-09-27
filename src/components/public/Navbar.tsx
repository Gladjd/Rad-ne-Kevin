'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X, Sparkles, UserCheck, Music, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onOpenRsvp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRsvp }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Notre Histoire', href: '/#histoire' },
    { name: 'Programme', href: '/#programme' },
    { name: 'RSVP', href: '/#rsvp', isAction: true },
    { name: 'Galerie Photos', href: '/#galerie' },
    { name: 'Livre d\'Or', href: '/#livredor' },
    { name: 'Trouver ma Table', href: '/#table-finder' },
    { name: 'Liste de Mariage', href: '/#cagnotte' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-ivory/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-sm border-b border-gold-200/50 py-3'
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram / Brand */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-script-calligraphy text-3xl sm:text-4xl text-gold-600 dark:text-gold-400 group-hover:scale-105 transition-transform">
            R & K
          </span>
          <span className="hidden sm:inline-block font-serif-luxury text-sm tracking-widest text-zinc-600 dark:text-zinc-300 uppercase border-l border-gold-300 pl-2 ml-1">
            20 Juin 2026
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'text-xs tracking-wider uppercase transition-colors font-medium py-1 relative',
                link.isAction
                  ? 'text-gold-700 dark:text-gold-300 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-200 hover:text-gold-600 dark:hover:text-gold-400'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions (Admin + RSVP Button) */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            title="Espace Organisation & Protocole"
            className="p-2 rounded-full text-zinc-500 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ShieldCheck className="w-5 h-5" />
          </Link>

          <Link
            href="/#rsvp"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white text-xs uppercase tracking-widest font-semibold shadow-gold hover:shadow-gold-glow transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>RSVP</span>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-gold-50 dark:hover:bg-zinc-800"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-ivory/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-gold-200 shadow-xl p-6 animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-sm tracking-widest uppercase font-medium py-2 border-b border-gold-100/50 flex items-center justify-between',
                  link.isAction ? 'text-gold-600 font-bold' : 'text-zinc-800 dark:text-zinc-100'
                )}
              >
                <span>{link.name}</span>
                {link.isAction && <Sparkles className="w-4 h-4 text-gold-500" />}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gold-300 text-gold-700 dark:text-gold-300 text-xs uppercase tracking-widest font-semibold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Accès Protocole & Admin</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
