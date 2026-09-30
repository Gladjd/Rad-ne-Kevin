'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Sparkles, Image as ImageIcon, Trash2, Heart } from 'lucide-react';
import { weddingStore } from '@/lib/supabase/client';
import { PhotoItem } from '@/lib/database.types';
import { formatDate } from '@/lib/utils';

export const PhotoModerationCard: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [filter, setFilter] = useState<'en_attente' | 'valide' | 'rejete' | 'all'>('en_attente');

  const loadPhotos = async () => {
    const list = await weddingStore.getPhotos(true); // Include all photos
    setPhotos(list);
  };

  useEffect(() => {
    loadPhotos();
    window.addEventListener('wedding_data_changed', loadPhotos);
    return () => window.removeEventListener('wedding_data_changed', loadPhotos);
  }, []);

  const handleApprove = async (photoId: string) => {
    await weddingStore.updatePhotoStatus(photoId, 'valide');
    loadPhotos();
  };

  const handleReject = async (photoId: string) => {
    await weddingStore.updatePhotoStatus(photoId, 'rejete');
    loadPhotos();
  };

  const pendingCount = photos.filter((p) => p.statut === 'en_attente').length;
  const approvedCount = photos.filter((p) => p.statut === 'valide').length;
  const rejectedCount = photos.filter((p) => p.statut === 'rejete').length;

  const displayedPhotos = photos.filter((p) => {
    if (filter === 'all') return true;
    return p.statut === filter;
  });

  return (
    <div className="space-y-6">
      {/* Moderation Status Tabs */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gold-200/60 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-gold-600" />
          <h2 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100">
            File de Modération des Photos
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('en_attente')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filter === 'en_attente'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <span>En Attente</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{pendingCount}</span>
          </button>

          <button
            onClick={() => setFilter('valide')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filter === 'valide'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <span>Validées ({approvedCount})</span>
          </button>

          <button
            onClick={() => setFilter('rejete')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filter === 'rejete'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <span>Rejetées ({rejectedCount})</span>
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === 'all'
                ? 'bg-gold-500 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            Toutes ({photos.length})
          </button>
        </div>
      </div>

      {/* Grid of photos to moderate */}
      {displayedPhotos.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-gold-200/60 shadow-sm space-y-2">
          <Sparkles className="w-10 h-10 text-gold-500 mx-auto" />
          <h3 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Aucune photo dans cette file
          </h3>
          <p className="text-xs text-zinc-500">
            Toutes les photos soumises par vos invités ont été traitées !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-gold-200/60 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full bg-black/10 overflow-hidden group">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 35%' }}
                  />
                  <div className="absolute top-3 right-3">
                    {photo.statut === 'en_attente' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                        En Attente
                      </span>
                    )}
                    {photo.statut === 'valide' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                        Validée
                      </span>
                    )}
                    {photo.statut === 'rejete' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                        Rejetée
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {photo.caption || '(Sans légende)'}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Par <strong>{photo.uploaded_by}</strong> • {formatDate(photo.created_at, 'short')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleReject(photo.id)}
                  disabled={photo.statut === 'rejete'}
                  className="flex-1 py-2 rounded-xl border border-rose-200 text-rose-700 dark:text-rose-400 hover:bg-rose-50 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors disabled:opacity-40"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Rejeter</span>
                </button>

                <button
                  onClick={() => handleApprove(photo.id)}
                  disabled={photo.statut === 'valide'}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors shadow-sm disabled:opacity-40"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approuver</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
