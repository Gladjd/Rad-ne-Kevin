'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Utensils, Users, MapPin, Sparkles, Check, Heart } from 'lucide-react';
import { weddingStore } from '@/lib/supabase/client';
import { GuestItem, TableItem } from '@/lib/database.types';

export const TableFinderWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const g = await weddingStore.getGuests();
      const t = await weddingStore.getTables();
      setGuests(g);
      setTables(t);
    };
    loadData();
    window.addEventListener('wedding_data_changed', loadData);
    return () => window.removeEventListener('wedding_data_changed', loadData);
  }, []);

  const searchResults = query.trim().length >= 2
    ? guests.filter((g) =>
        `${g.prenom} ${g.nom}`.toLowerCase().includes(query.toLowerCase()) ||
        `${g.nom} ${g.prenom}`.toLowerCase().includes(query.toLowerCase()) ||
        g.qr_code_uid.toLowerCase() === query.trim().toLowerCase()
      )
    : [];

  const getTableForGuest = (tableId?: string | null) => {
    if (!tableId) return null;
    return tables.find((t) => t.id === tableId) || null;
  };

  const getTableMates = (tableId?: string | null, currentGuestId?: string) => {
    if (!tableId) return [];
    return guests.filter((g) => g.table_id === tableId && g.id !== currentGuestId);
  };

  const assignedTable = selectedGuest ? getTableForGuest(selectedGuest.table_id) : null;
  const tableMates = selectedGuest ? getTableMates(selectedGuest.table_id, selectedGuest.id) : [];

  return (
    <section id="table-finder" className="py-24 px-4 bg-ivory dark:bg-zinc-950 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-100 dark:bg-zinc-800 border border-gold-200 text-gold-800 dark:text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3">
            <Utensils className="w-3.5 h-3.5 text-gold-600" />
            <span>Plan de Salle & Placement</span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-50 font-normal">
            Trouver Ma Table
          </h2>
          <p className="font-serif-luxury italic text-lg text-zinc-600 dark:text-zinc-400 mt-2">
            Entrez votre nom pour découvrir instantanément votre table d'honneur pour la soirée.
          </p>
        </div>

        {/* Search Card */}
        <div className="glass-card-gold rounded-3xl p-6 sm:p-10 shadow-gold max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gold-600" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedGuest(null);
              }}
              placeholder="Tapez votre prénom ou nom (ex: Alexandre Dupont)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-gold-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-sm"
            />
          </div>

          {/* Predictive Search Dropdown */}
          {query.trim().length >= 2 && !selectedGuest && (
            <div className="mt-3 bg-white dark:bg-zinc-800 rounded-2xl border border-gold-200 shadow-xl overflow-hidden divide-y divide-gold-100 max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((guest) => (
                  <button
                    key={guest.id}
                    onClick={() => setSelectedGuest(guest)}
                    className="w-full px-4 py-3 text-left hover:bg-gold-50 dark:hover:bg-zinc-700 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-serif-luxury text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {guest.prenom} {guest.nom}
                      </span>
                      {guest.accompagnants_json && guest.accompagnants_json.length > 0 && (
                        <span className="text-xs text-zinc-500 ml-2">
                          (+ {guest.accompagnants_json.length} accompagnant{guest.accompagnants_json.length > 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-700 bg-gold-100 px-2.5 py-1 rounded-full">
                      Voir ma table →
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-zinc-500">
                  Aucun invité trouvé pour « {query} ». Vérifiez l'orthographe ou contactez le protocole.
                </div>
              )}
            </div>
          )}

          {/* Table Result Display Card */}
          <AnimatePresence>
            {selectedGuest && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 pt-6 border-t border-gold-200"
              >
                <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white to-gold-50/50 dark:from-zinc-900 dark:to-zinc-800 border-2 border-gold-400 shadow-gold text-center relative">
                  <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-600 mx-auto flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    {selectedGuest.prenom} {selectedGuest.nom}
                  </h3>

                  {assignedTable ? (
                    <div className="mt-4 space-y-4">
                      <div className="inline-block px-5 py-2 rounded-2xl bg-gold-500 text-white shadow-gold">
                        <span className="text-[10px] uppercase font-bold tracking-widest block opacity-90">
                          Votre Table
                        </span>
                        <span className="font-serif-luxury text-2xl font-bold">
                          {assignedTable.nom_numero}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold-600" />
                          <span>Zone : {assignedTable.zone || 'Salle Principale'}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gold-600" />
                          <span>Capacité : {assignedTable.capacite} personnes</span>
                        </span>
                      </div>

                      {/* Co-seated guests */}
                      {tableMates.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gold-200 text-left">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                            À votre table :
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {tableMates.map((m) => (
                              <span
                                key={m.id}
                                className="px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-gold-200 text-xs text-zinc-800 dark:text-zinc-200 font-medium"
                              >
                                {m.prenom} {m.nom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-zinc-800 border border-amber-200 text-amber-800 text-xs">
                      Votre placement est en cours de finalisation par les mariés. Renseignez-vous auprès du protocole le jour J !
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedGuest(null);
                      setQuery('');
                    }}
                    className="mt-6 text-xs text-zinc-500 hover:text-zinc-800 underline"
                  >
                    Faire une autre recherche
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
