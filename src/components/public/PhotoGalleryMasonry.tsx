'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Heart, Sparkles, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { weddingStore } from '@/lib/supabase/client';
import { PhotoItem } from '@/lib/database.types';
import { PhotoUploadDropzone } from './PhotoUploadDropzone';

export const PhotoGalleryMasonry: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedSet, setUserLikedSet] = useState<Set<string>>(new Set());

  const fetchPhotos = async () => {
    const list = await weddingStore.getPhotos(false); // Only approved photos
    setPhotos(list);
    const initialLikes: Record<string, number> = {};
    list.forEach((p) => {
      initialLikes[p.id] = p.likes_count;
    });
    setLikesMap(initialLikes);
  };

  useEffect(() => {
    fetchPhotos();
    const handleDataChanged = () => fetchPhotos();
    window.addEventListener('wedding_data_changed', handleDataChanged);
    return () => window.removeEventListener('wedding_data_changed', handleDataChanged);
  }, []);

  const handleLike = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSet = new Set(userLikedSet);
    const isLiked = nextSet.has(photoId);

    if (isLiked) {
      nextSet.delete(photoId);
      setLikesMap((prev) => ({ ...prev, [photoId]: Math.max(0, (prev[photoId] || 1) - 1) }));
    } else {
      nextSet.add(photoId);
      setLikesMap((prev) => ({ ...prev, [photoId]: (prev[photoId] || 0) + 1 }));
    }
    setUserLikedSet(nextSet);
  };

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.event_id === activeFilter;
  });

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const nextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <section id="galerie" className="py-24 px-4 bg-paper-textured relative paper-texture">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-royal-50 dark:bg-royal-950 border border-gold-300 text-royal-800 dark:text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3 shadow-sm">
            <ImageIcon className="w-3.5 h-3.5 text-royal-700 dark:text-gold-400" />
            <span>Galerie Collaborative en Direct</span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-royal-950 dark:text-zinc-50 font-normal">
            Le Livre d’Images
          </h2>
          <p className="font-serif-luxury italic text-lg sm:text-xl text-royal-800/80 dark:text-zinc-300 mt-2">
            Revivez en images la grâce, la noblesse et l’amour partagés lors de ce grand jour.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'Toutes les photos' },
              { id: 'e1111111-1111-1111-1111-111111111111', label: 'Bénédiction Nuptiale (Dieuppeul)' },
              { id: 'e2222222-2222-2222-2222-222222222222', label: 'Cocktail & Félicitations' },
              { id: 'e3333333-3333-3333-3333-333333333333', label: 'Dîner de Gala & Soirée' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeFilter === f.id
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold'
                    : 'bg-white/90 dark:bg-royal-950 text-royal-900 dark:text-zinc-300 hover:bg-gold-50 border border-gold-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Zone Component */}
        <div className="mb-14 max-w-2xl mx-auto">
          <PhotoUploadDropzone onPhotoUploaded={fetchPhotos} />
        </div>

        {/* Masonry Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 font-serif-luxury text-xl">
            Aucune photo dans cette catégorie pour le moment. Soyez le premier à déposer vos clichés !
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {filteredPhotos.map((photo, index) => {
              const likes = likesMap[photo.id] || 0;
              const isLiked = userLikedSet.has(photo.id);

              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="break-inside-avoid group relative rounded-3xl overflow-hidden glass-card-gold shadow-sm hover:shadow-gold-glow cursor-pointer transition-all duration-500 border border-gold-300/80 bg-white"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Photo de mariage Radène & Kévin'}
                    className="w-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-950/85 via-royal-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
                    {photo.caption && (
                      <p className="font-serif-luxury text-base font-semibold mb-1 line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-zinc-200">
                      <span>Par {photo.uploaded_by}</span>
                      <button
                        onClick={(e) => handleLike(photo.id, e)}
                        className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'text-gold-400 fill-gold-400' : 'text-white'}`} />
                        <span>{likes}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev / Next buttons */}
              {filteredPhotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevPhoto();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextPhoto();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image & details */}
              <div
                className="max-w-4xl max-h-[85vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={filteredPhotos[selectedPhotoIndex].url}
                  alt="Vue plein écran"
                  className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl border border-gold-400"
                />
                <div className="mt-4 text-center text-white space-y-1">
                  {filteredPhotos[selectedPhotoIndex].caption && (
                    <p className="font-serif-luxury text-xl font-medium">
                      {filteredPhotos[selectedPhotoIndex].caption}
                    </p>
                  )}
                  <p className="text-xs text-gold-300">
                    Partagé par <strong>{filteredPhotos[selectedPhotoIndex].uploaded_by}</strong>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
