'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  Car,
  Hotel,
  HelpCircle,
  Wine,
  Moon,
  Sun,
  X,
  Navigation,
  Church,
} from 'lucide-react';
import { INITIAL_EVENTS } from '@/lib/mock-data';
import { weddingStore } from '@/lib/supabase/client';
import { formatDate, formatTime } from '@/lib/utils';
import { EventItem } from '@/lib/database.types';

export const ProgramSection: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [activeTab, setActiveTab] = useState<'programme' | 'logistique' | 'faq'>('programme');
  const [selectedMapEvent, setSelectedMapEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await weddingStore.getEvents();
      if (data && data.length > 0) {
        setEvents(data);
      }
    };
    loadEvents();
    const handleDataChanged = () => loadEvents();
    window.addEventListener('wedding_data_changed', handleDataChanged);
    return () => window.removeEventListener('wedding_data_changed', handleDataChanged);
  }, []);

  const getEventIcon = (iconName?: string) => {
    switch (iconName) {
      case 'heart':
      case 'church':
        return <Church className="w-5 h-5 text-royal-700 dark:text-gold-400" />;
      case 'wine':
        return <Wine className="w-5 h-5 text-gold-600 dark:text-gold-400" />;
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-royal-600 dark:text-gold-300" />;
      default:
        return <Sparkles className="w-5 h-5 text-gold-600" />;
    }
  };

  const hotels = [
    {
      name: 'Radisson Blu Hotel, Dakar Sea Plaza (5★)',
      distance: 'À 12 min de l’Eglise Protestante de Dieuppeul',
      address: 'Route de la Corniche Ouest, Dakar',
      price: 'Tarif préférentiel mariage : RADENE-KEVIN-2026',
      link: 'https://maps.google.com/?q=Radisson+Blu+Hotel+Dakar',
    },
    {
      name: 'Pullman Dakar Teranga (5★)',
      distance: 'À 15 min de l’Eglise Protestante de Dieuppeul',
      address: '10 Rue Colbert, Plateau, Dakar',
      price: 'Vue imprenable sur l’Océan & Île de Gorée',
      link: 'https://maps.google.com/?q=Pullman+Dakar+Teranga',
    },
    {
      name: 'Hôtel Le Djoloff (Boutique Hôtel de Charme)',
      distance: 'À 10 min de l’Eglise Protestante de Dieuppeul',
      address: '7 Rue Nani, Fann Hock, Dakar',
      price: 'Idéal pour séjour intime & familial',
      link: 'https://maps.google.com/?q=Hotel+Le+Djoloff+Dakar',
    },
  ];

  const faqs = [
    {
      q: 'Quel est le dress code général du mariage ?',
      a: 'Pour la bénédiction nuptiale à l’Eglise Protestante du Sénégal (Dieuppeul), nous vous invitons à porter des tenues très élégantes avec des nuances de Blanc Pur, Or Métallique ou Bleu Roi. Pour la soirée de gala à la salle de fête Fun Time, le Black Tie (smoking, costumes d’apparat et robes longues de soirée) est vivement souhaité.',
    },
    {
      q: 'À quelle heure est-il recommandé d’arriver pour les célébrations ?',
      a: 'Le Samedi 5 Décembre 2026, la bénédiction nuptiale débute précisément à 11h00 (accueil des invités dès 10h30 à l’Eglise Protestante du Sénégal, Paroisse de Dieuppeul). La soirée de gala débutera à 20h00 à la salle de fête Fun Time. Le Dimanche 6 Décembre 2026, le culte d’action de grâce aura lieu à 10h00 à l’Eglise Protestante de Dieuppeul.',
    },
    {
      q: 'Y a-t-il des navettes et un service de sécurité organisés ?',
      a: 'Oui, un service de navettes climatisées et un protocole de sécurité dédié assureront les liaisons entre l’Eglise Protestante de Dieuppeul, la salle de fête Fun Time et les principaux hôtels.',
    },
    {
      q: 'Comment utiliser mon pass QR Code ?',
      a: 'Après confirmation de votre présence dans l’onglet RSVP, votre QR Pass personnalisé est généré. Présentez-le sur votre téléphone ou imprimé à l’entrée de la réception pour un accueil fluide.',
    },
  ];

  return (
    <section id="programme" className="py-24 px-4 bg-paper-textured relative paper-texture">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-royal-50 dark:bg-royal-950 border border-gold-300 text-royal-800 dark:text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-royal-700 dark:text-gold-400" />
            <span>Samedi 5 &amp; Dimanche 6 Décembre 2026</span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-royal-950 dark:text-zinc-50 font-normal">
            Le Programme &amp; Infos Pratiques
          </h2>
          <p className="font-serif-luxury italic text-lg sm:text-xl text-royal-800/80 dark:text-zinc-300 mt-2">
            Retrouvez tous les temps forts, horaires et détails de notre sainte célébration.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8 bg-royal-50/80 dark:bg-royal-950/80 p-1.5 rounded-full max-w-md mx-auto border border-gold-300 shadow-inner">
            <button
              onClick={() => setActiveTab('programme')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'programme'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold'
                  : 'text-royal-800 dark:text-zinc-300 hover:text-royal-950'
              }`}
            >
              Programme
            </button>
            <button
              onClick={() => setActiveTab('logistique')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'logistique'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold'
                  : 'text-royal-800 dark:text-zinc-300 hover:text-royal-950'
              }`}
            >
              Hébergements
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'faq'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold'
                  : 'text-royal-800 dark:text-zinc-300 hover:text-royal-950'
              }`}
            >
              FAQ
            </button>
          </div>
        </div>

        {/* Tab 1: Programme Events */}
        {activeTab === 'programme' && (
          <div className="space-y-6">
            {events.map((evt, idx) => {
              const lat = evt.coordonnees_gps?.lat || 14.7126;
              const lng = evt.coordonnees_gps?.lng || -17.4589;

              return (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card-gold rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-gold transition-all border border-gold-300/80 bg-white/95"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-2xl bg-royal-50 dark:bg-royal-950 border border-gold-300 shrink-0">
                      {getEventIcon(evt.icone)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-royal-100/70 text-royal-900 dark:text-gold-300 font-bold text-xs border border-royal-200">
                          {formatTime(evt.date_heure)}
                        </span>
                        <span className="text-xs text-royal-700/80 dark:text-zinc-400 font-medium">
                          {formatDate(evt.date_heure, 'short')}
                        </span>
                        {evt.dress_code && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold-50 text-gold-900 border border-gold-200 font-medium">
                            ✨ {evt.dress_code}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-royal-950 dark:text-zinc-50 mb-1">
                        {evt.nom}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-royal-700 dark:text-gold-400 mb-3 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-gold-600" />
                        <span>{evt.lieu} — {evt.adresse}</span>
                      </div>
                      <p className="text-royal-950/80 dark:text-zinc-300 text-sm leading-relaxed max-w-2xl font-sans">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  {/* Google Maps Action Button */}
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMapEvent(evt)}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-royal-900 hover:bg-royal-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gold-400 text-xs uppercase tracking-widest font-semibold shadow-gold hover:shadow-gold-glow transition-all active:scale-95"
                    >
                      <MapPin className="w-4 h-4 text-gold-400" />
                      <span>Itinéraire &amp; GPS</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Hébergements & Navettes */}
        {activeTab === 'logistique' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotels.map((h, i) => (
                <div key={i} className="glass-card-gold rounded-3xl p-6 flex flex-col justify-between border border-gold-300/80 bg-white/95">
                  <div>
                    <div className="p-3 w-fit rounded-2xl bg-royal-50 text-royal-700 mb-4 border border-gold-200">
                      <Hotel className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-luxury text-xl font-bold text-royal-950 dark:text-zinc-100 mb-2">
                      {h.name}
                    </h3>
                    <p className="text-xs text-royal-700 dark:text-gold-300 font-semibold mb-1">
                      {h.distance}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{h.address}</p>
                    <div className="px-3 py-1.5 rounded-xl bg-gold-50/80 border border-gold-200 text-xs text-royal-900 font-medium mb-4">
                      {h.price}
                    </div>
                  </div>
                  <a
                    href={h.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-gold-400 text-xs uppercase tracking-widest font-semibold text-royal-900 hover:bg-gold-500 hover:text-white transition-colors"
                  >
                    <span>Voir sur la carte</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {/* Shuttle Service Card */}
            <div className="glass-card-gold rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-l-4 border-l-gold-500 bg-white/95">
              <div className="p-4 rounded-2xl bg-royal-50 text-royal-700 shrink-0 border border-gold-200">
                <Car className="w-8 h-8 text-gold-600" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-royal-950 dark:text-zinc-100 mb-1">
                  Service de Navettes &amp; Protocole Sécurisé
                </h3>
                <p className="text-royal-950/80 dark:text-zinc-300 text-sm leading-relaxed">
                  Pour votre confort et votre tranquillité, des navettes privées assureront les liaisons entre la Paroisse de Dieuppeul, les salons de réception et les principaux hôtels partenaires.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in duration-300">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card-gold rounded-2xl p-6 shadow-sm border border-gold-300/80 bg-white/95">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif-luxury text-xl font-bold text-royal-950 dark:text-zinc-100 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-sm text-royal-950/80 dark:text-zinc-300 leading-relaxed font-sans">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Google Maps GPS Modal */}
      <AnimatePresence>
        {selectedMapEvent && (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedMapEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gold-400 shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between pb-4 border-b border-gold-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-royal-50 dark:bg-zinc-800 text-royal-700 dark:text-gold-400 border border-gold-200">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury text-xl font-bold text-royal-950 dark:text-zinc-100">
                      {selectedMapEvent.nom}
                    </h3>
                    <p className="text-xs text-royal-700/80">{selectedMapEvent.lieu}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMapEvent(null)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Map Embed Frame / Preview */}
              <div className="my-5 rounded-2xl overflow-hidden border border-gold-300 h-64 bg-zinc-100 dark:bg-zinc-800 relative shadow-inner">
                <iframe
                  title="Carte du lieu"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    selectedMapEvent.lieu.includes('Fun Time')
                      ? 'Salle de fete Fun Time Dakar'
                      : selectedMapEvent.lieu.includes('Dieuppeul')
                      ? 'Eglise Protestante du Senegal Dieuppeul Dakar'
                      : `${selectedMapEvent.coordonnees_gps?.lat || 14.7126},${selectedMapEvent.coordonnees_gps?.lng || -17.4589}`
                  )}&hl=fr&z=15&output=embed`}
                />
              </div>

              <div className="text-xs text-royal-900 dark:text-zinc-300 mb-5 space-y-1 font-sans">
                <p>📍 <strong>Adresse :</strong> {selectedMapEvent.adresse}</p>
                <p>🚗 <strong>Accès &amp; Parking :</strong> Espaces dédiés aux invités du mariage</p>
              </div>

              {/* Universal Navigation Redirection Buttons */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-royal-700/70 block mb-2">
                  Lancer le guidage GPS direct :
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      selectedMapEvent.lieu.includes('Fun Time')
                        ? 'Salle de fete Fun Time Dakar'
                        : selectedMapEvent.lieu.includes('Dieuppeul')
                        ? 'Eglise Protestante du Senegal Dieuppeul Dakar'
                        : `${selectedMapEvent.coordonnees_gps?.lat || 14.7126},${selectedMapEvent.coordonnees_gps?.lng || -17.4589}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white text-center text-xs font-semibold uppercase tracking-wider transition-colors shadow-gold flex flex-col items-center justify-center gap-1"
                  >
                    <span>Google Maps</span>
                  </a>
                  <a
                    href={`https://maps.apple.com/?daddr=${selectedMapEvent.coordonnees_gps?.lat || 14.7126},${selectedMapEvent.coordonnees_gps?.lng || -17.4589}&dirflg=d`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-royal-900 hover:bg-royal-950 text-white text-center text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex flex-col items-center justify-center gap-1 border border-gold-400"
                  >
                    <span>Apple Maps</span>
                  </a>
                  <a
                    href={`https://waze.com/ul?ll=${selectedMapEvent.coordonnees_gps?.lat || 14.7126},${selectedMapEvent.coordonnees_gps?.lng || -17.4589}&navigate=yes`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-center text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex flex-col items-center justify-center gap-1"
                  >
                    <span>Waze</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
