'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  Car,
  Hotel,
  HelpCircle,
  HeartHandshake,
  Wine,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { INITIAL_EVENTS } from '@/lib/mock-data';
import { formatDate, formatTime } from '@/lib/utils';

export const ProgramSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programme' | 'logistique' | 'faq'>('programme');

  const getEventIcon = (iconName?: string) => {
    switch (iconName) {
      case 'wine':
        return <Wine className="w-5 h-5 text-gold-600" />;
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'sparkles':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-rose-500" />;
    }
  };

  const hotels = [
    {
      name: 'Hôtel Bastide Saint-Antoine (5★ Relais & Châteaux)',
      distance: 'À 5 min du domaine',
      address: '48 Avenue Henri Dunant, 06130 Grasse',
      price: 'Tarif préférentiel code : RADENEKEVIN2026',
      link: 'https://maps.google.com/?q=La+Bastide+Saint+Antoine+Grasse',
    },
    {
      name: 'Best Western Plus Elixir Grasse (4★)',
      distance: 'À 8 min du domaine',
      address: 'Rue Martine Carol, 06130 Grasse',
      price: 'Chambres doubles & familiales',
      link: 'https://maps.google.com/?q=Best+Western+Plus+Elixir+Grasse',
    },
    {
      name: 'Domaine de la Source (Maisons d\'hôtes de charme)',
      distance: 'À 10 min du domaine',
      address: 'Chemin des Chênes, 06530 Peymeinade',
      price: 'Idéal pour les groupes d\'amis',
      link: 'https://maps.google.com/?q=Domaine+de+la+Source+Peymeinade',
    },
  ];

  const faqs = [
    {
      q: 'Quel est le dress code général du mariage ?',
      a: 'Nous vous invitons à revêtir vos plus belles tenues de cocktail élégantes avec une touche dorée ou pastel pour la cérémonie et le vin d\'honneur. Pour le dîner, le Black Tie Optional (smoking ou costume sombre, robes longues ou mi-longues) est le bienvenu.',
    },
    {
      q: 'Y a-t-il des navettes organisées pour la soirée ?',
      a: 'Oui ! Des navettes privées feront des allers-retours entre le Château Saint-Georges et les principaux hôtels partenaires de minuit à 05h00 du matin pour que chacun puisse profiter de la fête en toute sécurité.',
    },
    {
      q: 'Les enfants sont-ils conviés ?',
      a: 'Oui, nous avons prévu un espace dédié avec des animateurs professionnels et baby-sitters diplômées ainsi qu\'un menu enfant adapté.',
    },
    {
      q: 'Y a-t-il un parking sur place ?',
      a: 'Oui, un vaste parking surveillé et gratuit avec service voiturier est à votre disposition dès votre arrivée aux grilles du Château.',
    },
  ];

  return (
    <section id="programme" className="py-24 px-4 bg-ivory dark:bg-zinc-950 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-100 dark:bg-zinc-800 border border-gold-200 text-gold-800 dark:text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5 text-gold-600" />
            <span>Déroulement des Festivités</span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-50 font-normal">
            Le Programme & Infos Pratiques
          </h2>
          <p className="font-serif-luxury italic text-lg text-zinc-600 dark:text-zinc-400 mt-2">
            Retrouvez tous les temps forts et les informations pour passer un séjour d'exception.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8 bg-gold-50/80 dark:bg-zinc-900 p-1.5 rounded-full max-w-md mx-auto border border-gold-200/60 shadow-inner">
            <button
              onClick={() => setActiveTab('programme')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'programme'
                  ? 'bg-gold-500 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
              }`}
            >
              Programme
            </button>
            <button
              onClick={() => setActiveTab('logistique')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'logistique'
                  ? 'bg-gold-500 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
              }`}
            >
              Hébergements
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'faq'
                  ? 'bg-gold-500 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
              }`}
            >
              FAQ
            </button>
          </div>
        </div>

        {/* Tab 1: Programme Events */}
        {activeTab === 'programme' && (
          <div className="space-y-6">
            {INITIAL_EVENTS.map((evt, idx) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card-gold rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-gold transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-gold-100 dark:bg-zinc-800 border border-gold-200 shrink-0">
                    {getEventIcon(evt.icone)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-300 font-bold text-xs">
                        {formatTime(evt.date_heure)}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {formatDate(evt.date_heure, 'short')}
                      </span>
                      {evt.dress_code && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          👗 {evt.dress_code}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif-luxury text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                      {evt.nom}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 mb-2 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gold-600" />
                      <span>{evt.lieu} — {evt.adresse}</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed max-w-2xl">
                      {evt.description}
                    </p>
                  </div>
                </div>

                {/* Google Maps Action Button */}
                <div className="shrink-0 flex items-center">
                  <a
                    href={evt.coordonnees_gps?.maps_url || 'https://maps.google.com/?q=Chateau+Saint-Georges+Grasse'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ivory hover:bg-gold-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gold-300 text-gold-800 dark:text-gold-200 text-xs uppercase tracking-widest font-semibold shadow-sm transition-all active:scale-95"
                  >
                    <MapPin className="w-4 h-4 text-gold-600" />
                    <span>Itinéraire Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab 2: Hébergements & Navettes */}
        {activeTab === 'logistique' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotels.map((h, i) => (
                <div key={i} className="glass-card-gold rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="p-3 w-fit rounded-2xl bg-gold-100 dark:bg-zinc-800 text-gold-700 mb-4">
                      <Hotel className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                      {h.name}
                    </h3>
                    <p className="text-xs text-gold-700 dark:text-gold-300 font-semibold mb-1">
                      {h.distance}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{h.address}</p>
                    <div className="px-3 py-1.5 rounded-xl bg-gold-50 dark:bg-zinc-800/80 border border-gold-200 text-xs text-zinc-700 dark:text-zinc-300 font-medium mb-4">
                      {h.price}
                    </div>
                  </div>
                  <a
                    href={h.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-gold-300 text-xs uppercase tracking-widest font-semibold text-gold-700 dark:text-gold-200 hover:bg-gold-500 hover:text-white transition-colors"
                  >
                    <span>Voir sur la carte</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {/* Shuttle Service Card */}
            <div className="glass-card-gold rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-l-4 border-l-gold-500">
              <div className="p-4 rounded-2xl bg-gold-100 dark:bg-zinc-800 text-gold-700 shrink-0">
                <Car className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Service de Navettes de Nuit
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                  Pour votre confort et votre sécurité, des navettes Mercedes privées assureront les retours depuis le Château vers les hôtels partenaires et parkings de Grasse toutes les 30 minutes de <strong>00h00 à 05h00</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in duration-300">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card-gold rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
