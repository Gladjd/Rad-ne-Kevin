'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  QrCode,
  Grid,
  Image as ImageIcon,
  Mail,
  Kanban,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { weddingStore } from '@/lib/supabase/client';
import { GuestItem, PhotoItem, ProjectTaskItem, TableItem } from '@/lib/database.types';

export default function AdminDashboardPage() {
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [tasks, setTasks] = useState<ProjectTaskItem[]>([]);

  useEffect(() => {
    const loadAll = async () => {
      const [g, t, p, k] = await Promise.all([
        weddingStore.getGuests(),
        weddingStore.getTables(),
        weddingStore.getPhotos(true),
        weddingStore.getTasks(),
      ]);
      setGuests(g);
      setTables(t);
      setPhotos(p);
      setTasks(k);
    };
    loadAll();

    const handleDataChanged = () => loadAll();
    window.addEventListener('wedding_data_changed', handleDataChanged);
    return () => window.removeEventListener('wedding_data_changed', handleDataChanged);
  }, []);

  const totalGuests = guests.reduce((acc, g) => acc + (g.nombre_invites || 1), 0);
  const confirmedGuests = guests
    .filter((g) => g.statut_rsvp === 'confirme')
    .reduce((acc, g) => acc + (g.nombre_invites || 1), 0);
  const pendingGuests = guests
    .filter((g) => g.statut_rsvp === 'en_attente')
    .reduce((acc, g) => acc + (g.nombre_invites || 1), 0);
  const checkedInCount = guests
    .filter((g) => g.checked_in)
    .reduce((acc, g) => acc + (g.nombre_invites || 1), 0);

  const pendingPhotos = photos.filter((p) => p.statut === 'en_attente');
  const completedTasks = tasks.filter((t) => t.statut === 'termine');

  const totalCapacity = tables.reduce((acc, t) => acc + t.capacite, 0);
  const seatedGuests = guests
    .filter((g) => g.table_id && g.statut_rsvp !== 'decline')
    .reduce((acc, g) => acc + (g.nombre_invites || 1), 0);

  return (
    <div className="w-full">
      <AdminHeader
        title="Tableau de Bord & Vue d’Ensemble"
        subtitle="Suivi des confirmations, organisation du plan de table et protocole du Jour J."
        action={
          <Link
            href="/admin/scanner"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white font-bold text-xs uppercase tracking-widest shadow-gold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Lancer le Scanner Caméra</span>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
        {/* Top Hero Banner - 100% Fluid & Mobile-First */}
        <div className="w-full relative overflow-hidden rounded-3xl p-5 sm:p-8 bg-gradient-to-r from-royal-950 via-royal-900 to-royal-950 text-white border border-gold-400/50 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Subtle Golden Glow Overlay */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase font-bold tracking-widest text-gold-300 bg-royal-900/90 px-3 py-1 rounded-full border border-gold-400/40">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              <span>Jour J : Samedi 5 Décembre 2026 • 11h00 • Eglise Protestante de Dieuppeul, Dakar</span>
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Mariage de Radène <span className="font-script-calligraphy text-gold-400 font-normal text-3xl sm:text-5xl mx-1">&amp;</span> Kévin
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Bienvenue dans votre centre de contrôle officiel. Suivez en temps réel le protocole, le pointage des invités, le plan de table et les relances.
            </p>
          </div>

          {/* Action Buttons Group - Responsive Stack on Mobile */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto shrink-0">
            <Link
              href="/admin/invites"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-royal-900/90 hover:bg-royal-800 border border-gold-400/40 text-xs font-semibold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Users className="w-4 h-4 text-gold-400" />
              <span>Gérer les Invités</span>
            </Link>

            <Link
              href="/admin/plan-de-table"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-gold flex items-center justify-center gap-2 active:scale-95"
            >
              <Grid className="w-4 h-4" />
              <span>Plan de Table 2D</span>
            </Link>
          </div>
        </div>

        {/* 4 Big KPI Metric Cards - Responsive Fluid Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Confirmed / Total */}
          <div className="glass-card-gold rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 border border-gold-300/70 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-royal-950/70">
                Confirmations RSVP
              </span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="font-serif-luxury text-3xl sm:text-4xl font-bold text-royal-950 dark:text-zinc-100">
                {confirmedGuests}{' '}
                <span className="text-base sm:text-lg text-zinc-400 font-normal">/ {totalGuests}</span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{Math.round((confirmedGuests / (totalGuests || 1)) * 100)}% de réponses positives</span>
              </p>
            </div>
          </div>

          {/* Pointage Jour J */}
          <div className="glass-card-gold rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 border-l-4 border-l-gold-500 border-gold-300/70 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gold-800 dark:text-gold-300">
                Pointés au Jour J
              </span>
              <div className="p-2.5 rounded-2xl bg-royal-50 text-royal-800 border border-gold-300">
                <QrCode className="w-5 h-5 text-gold-600" />
              </div>
            </div>
            <div>
              <div className="font-serif-luxury text-3xl sm:text-4xl font-bold text-royal-950 dark:text-gold-200">
                {checkedInCount}{' '}
                <span className="text-base sm:text-lg text-zinc-400 font-normal">/ {confirmedGuests}</span>
              </div>
              <p className="text-xs text-gold-700 font-semibold mt-1">
                Invités enregistrés à l’accueil
              </p>
            </div>
          </div>

          {/* Seating Plan */}
          <div className="glass-card-gold rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 border border-gold-300/70 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-royal-950/70">
                Placement à Table
              </span>
              <div className="p-2.5 rounded-2xl bg-royal-50 text-royal-700 border border-gold-200">
                <Grid className="w-5 h-5 text-gold-600" />
              </div>
            </div>
            <div>
              <div className="font-serif-luxury text-3xl sm:text-4xl font-bold text-royal-950 dark:text-zinc-100">
                {seatedGuests}{' '}
                <span className="text-base sm:text-lg text-zinc-400 font-normal">/ {totalCapacity}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {tables.length} tables créées sur le plan 2D
              </p>
            </div>
          </div>

          {/* Kanban / Tasks */}
          <div className="glass-card-gold rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 border border-gold-300/70 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-royal-950/70">
                Avancement Projet
              </span>
              <div className="p-2.5 rounded-2xl bg-royal-50 text-royal-700 border border-gold-200">
                <Kanban className="w-5 h-5 text-gold-600" />
              </div>
            </div>
            <div>
              <div className="font-serif-luxury text-3xl sm:text-4xl font-bold text-royal-950 dark:text-zinc-100">
                {completedTasks.length}{' '}
                <span className="text-base sm:text-lg text-zinc-400 font-normal">/ {tasks.length}</span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Tâches finalisées
              </p>
            </div>
          </div>
        </div>

        {/* Action Modules Grid - Responsive 1 to 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {/* Relances Action Card */}
          <div className="glass-card-gold rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 border border-gold-300/70 bg-white">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
                  <Mail className="w-5 h-5 text-amber-600" />
                </span>
                <span className="text-[11px] font-bold uppercase text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {pendingGuests} en attente
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-royal-950 dark:text-zinc-100">
                Relances Email &amp; SMS
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Déclenchez vos rappels automatiques pour recueillir les réponses des invités en attente.
              </p>
            </div>
            <Link
              href="/admin/relances"
              className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl bg-royal-900 hover:bg-royal-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm active:scale-95"
            >
              <span>Ouvrir les Relances</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>

          {/* Photo Moderation Card */}
          <div className="glass-card-gold rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 border border-gold-300/70 bg-white">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-2xl bg-royal-50 text-royal-700 border border-gold-200">
                  <ImageIcon className="w-5 h-5 text-gold-600" />
                </span>
                <span className="text-[11px] font-bold uppercase text-royal-900 bg-royal-50 px-2.5 py-0.5 rounded-full border border-royal-200">
                  {pendingPhotos.length} à modérer
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-royal-950 dark:text-zinc-100">
                Modération des Photos
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Validez en 1 clic les photos soumises en direct par vos invités pour la galerie publique.
              </p>
            </div>
            <Link
              href="/admin/moderation"
              className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-gold active:scale-95"
            >
              <span>Accéder à la File</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Day D Scanner Card */}
          <div className="glass-card-gold rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 border-2 border-gold-400 bg-white sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-2xl bg-royal-900 text-gold-300 border border-gold-400">
                  <QrCode className="w-5 h-5 text-gold-400" />
                </span>
                <span className="text-[11px] font-bold uppercase text-gold-800 bg-gold-50 px-2.5 py-0.5 rounded-full border border-gold-300">
                  Protocole Accueil
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-royal-950 dark:text-zinc-100">
                Scanner d’Accueil Jour J
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Scannez le QR Code de chaque invité pour pointer sa présence et l’orienter instantanément vers sa table.
              </p>
            </div>
            <Link
              href="/admin/scanner"
              className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl bg-royal-950 hover:bg-royal-900 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm active:scale-95 border border-gold-400/50"
            >
              <span>Ouvrir le Scanner Caméra</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
