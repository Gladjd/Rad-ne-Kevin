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
  AlertTriangle,
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
  }, []);

  const totalGuests = guests.reduce((acc, g) => acc + (g.nombre_invites || 1), 0);
  const confirmedGuests = guests.filter((g) => g.statut_rsvp === 'confirme').reduce((acc, g) => acc + (g.nombre_invites || 1), 0);
  const pendingGuests = guests.filter((g) => g.statut_rsvp === 'en_attente').reduce((acc, g) => acc + (g.nombre_invites || 1), 0);
  const checkedInCount = guests.filter((g) => g.checked_in).reduce((acc, g) => acc + (g.nombre_invites || 1), 0);

  const pendingPhotos = photos.filter((p) => p.statut === 'en_attente');
  const completedTasks = tasks.filter((t) => t.statut === 'termine');

  const totalCapacity = tables.reduce((acc, t) => acc + t.capacite, 0);
  const seatedGuests = guests.filter((g) => g.table_id && g.statut_rsvp !== 'decline').reduce((acc, g) => acc + (g.nombre_invites || 1), 0);

  return (
    <div>
      <AdminHeader
        title="Tableau de Bord & Vue d'Ensemble"
        subtitle="Suivi des confirmations, organisation du plan de table et protocole du Jour J."
        action={
          <Link
            href="/admin/scanner"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white font-bold text-xs uppercase tracking-widest shadow-gold flex items-center gap-2 transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Lancer le Scanner Caméra</span>
          </Link>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Top Hero Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white border border-gold-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400 bg-gold-950 px-3 py-1 rounded-full border border-gold-800">
              Jour J : 20 Juin 2026 • Château Saint-Georges
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold">
              Mariage de Radene & Kevin
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Bienvenue dans votre centre de contrôle. Tout est orchestré pour un déroulement parfait du protocole, des relances et de l'accueil de vos invités.
            </p>
          </div>

          <div className="relative z-10 flex gap-3 shrink-0">
            <Link
              href="/admin/invites"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white transition-colors"
            >
              Gérer les Invités
            </Link>
            <Link
              href="/admin/plan-de-table"
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-gold"
            >
              Plan de Table 2D
            </Link>
          </div>
        </div>

        {/* 4 Big KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Confirmed / Total */}
          <div className="glass-card-gold rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Confirmations RSVP
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="font-serif-luxury text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {confirmedGuests} <span className="text-lg text-zinc-400 font-normal">/ {totalGuests}</span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                {Math.round((confirmedGuests / (totalGuests || 1)) * 100)}% de réponses positives
              </p>
            </div>
          </div>

          {/* Pointage Jour J */}
          <div className="glass-card-gold rounded-3xl p-6 shadow-sm space-y-3 border-l-4 border-l-gold-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-800 dark:text-gold-300">
                Pointés au Jour J
              </span>
              <div className="p-2 rounded-xl bg-gold-100 text-gold-700">
                <QrCode className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="font-serif-luxury text-4xl font-bold text-gold-900 dark:text-gold-200">
                {checkedInCount} <span className="text-lg text-zinc-400 font-normal">/ {confirmedGuests}</span>
              </div>
              <p className="text-xs text-gold-700 font-semibold mt-1">
                Invités enregistrés à l'accueil
              </p>
            </div>
          </div>

          {/* Seating Plan */}
          <div className="glass-card-gold rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Placement à Table
              </span>
              <div className="p-2 rounded-xl bg-gold-100 text-gold-700">
                <Grid className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="font-serif-luxury text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {seatedGuests} <span className="text-lg text-zinc-400 font-normal">/ {totalCapacity}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {tables.length} tables créées sur le plan 2D
              </p>
            </div>
          </div>

          {/* Kanban / Tasks */}
          <div className="glass-card-gold rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Avancement Projet
              </span>
              <div className="p-2 rounded-xl bg-gold-100 text-gold-700">
                <Kanban className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="font-serif-luxury text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {completedTasks.length} <span className="text-lg text-zinc-400 font-normal">/ {tasks.length}</span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Tâches finalisées
              </p>
            </div>
          </div>
        </div>

        {/* Action Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Relances Action Card */}
          <div className="glass-card-gold rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                  <Mail className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {pendingGuests} en attente
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Relances Email & SMS
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Déclenchez vos rappels automatiques pour recueillir les réponses des invités retardataires.
              </p>
            </div>
            <Link
              href="/admin/relances"
              className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Ouvrir les Relances</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Photo Moderation Card */}
          <div className="glass-card-gold rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 rounded-xl bg-gold-100 text-gold-700">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase text-gold-800 bg-gold-100 px-2 py-0.5 rounded-full">
                  {pendingPhotos.length} à modérer
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Modération des Photos
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Validez en 1 clic les photos soumises en direct par vos invités pour la galerie publique.
              </p>
            </div>
            <Link
              href="/admin/moderation"
              className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Accéder à la File</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Day D Scanner Card */}
          <div className="glass-card-gold rounded-3xl p-6 flex flex-col justify-between space-y-4 border-2 border-gold-400">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <QrCode className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  App Mobile Protocole
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Scanner d'Accueil Jour J
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Scannez le QR Code de chaque invité pour pointer sa présence et l'orienter instantanément vers sa table.
              </p>
            </div>
            <Link
              href="/admin/scanner"
              className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Ouvrir le Scanner Caméra</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
