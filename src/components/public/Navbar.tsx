'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onOpenRsvp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRsvp }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
          ? 'bg-white/95 dark:bg-royal-950/95 backdrop-blur-md shadow-sm border-b border-gold-300/60 py-2.5'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram / Brand with Official R & K Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden p-0.5 border border-gold-400/80 shadow-sm bg-white shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/img/logo.png"
              alt="Monogramme R & K - Radène & Kévin"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-royal-950 dark:text-gold-200">
              Radène <span className="font-script-calligraphy text-gold-600 text-xl font-normal">&amp;</span> Kévin
            </span>
            <span className="text-[10px] tracking-widest text-royal-700/80 dark:text-zinc-300 uppercase font-semibold">
              5 Décembre 2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'text-xs tracking-wider uppercase transition-colors font-medium py-1 relative',
                link.isAction
                  ? 'text-gold-700 dark:text-gold-400 font-bold'
                  : 'text-royal-900/90 dark:text-zinc-200 hover:text-gold-600 dark:hover:text-gold-400'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions (Admin + RSVP Button) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            title="Espace Protocole & Admin"
            className="p-2 rounded-full text-royal-800 hover:text-gold-600 hover:bg-royal-50 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
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
            className="md:hidden p-2 rounded-lg text-royal-900 dark:text-zinc-200 hover:bg-royal-50 dark:hover:bg-zinc-800"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-white/95 dark:bg-royal-950/95 backdrop-blur-xl border-b border-gold-300 shadow-xl p-6 animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-sm tracking-widest uppercase font-medium py-2 border-b border-gold-100/60 flex items-center justify-between',
                  link.isAction ? 'text-gold-600 font-bold' : 'text-royal-950 dark:text-zinc-100'
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
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gold-400 text-royal-900 dark:text-gold-300 text-xs uppercase tracking-widest font-semibold bg-royal-50/50"
              >
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                <span>Accès Protocole &amp; Admin</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
