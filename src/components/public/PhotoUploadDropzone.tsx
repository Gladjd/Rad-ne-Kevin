'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Camera, Image as ImageIcon, CheckCircle, Sparkles, X } from 'lucide-react';
import { weddingStore } from '@/lib/supabase/client';

import { uploadPhotoAction } from '@/app/actions/photos';

interface PhotoUploadDropzoneProps {
  onPhotoUploaded?: () => void;
}

export const PhotoUploadDropzone: React.FC<PhotoUploadDropzoneProps> = ({ onPhotoUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [caption, setCaption] = useState('');
  const [eventId, setEventId] = useState('e1111111-1111-1111-1111-111111111111');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic'] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024, // 15 MB
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !file) return;

    setIsUploading(true);
    try {
      if (file) {
        // 1. Appel de la Server Action Next.js 14 pour téléversement direct dans le bucket 'photos_mariage'
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploaded_by', authorName.trim() || 'Invité Anonyme');
        if (caption.trim()) formData.append('caption', caption.trim());
        formData.append('event_id', eventId);

        const actionRes = await uploadPhotoAction(formData);

        if (actionRes.photo) {
          await weddingStore.addPhoto(actionRes.photo);
        }
      } else {
        // Fallback sans fichier brut
        await weddingStore.addPhoto({
          url: previewUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          uploaded_by: authorName.trim() || 'Invité Anonyme',
          caption: caption.trim() || undefined,
          event_id: eventId,
          statut: 'en_attente',
        });
      }

      setUploadSuccess(true);
      if (onPhotoUploaded) onPhotoUploaded();

      // Reset form
      setTimeout(() => {
        setFile(null);
        setPreviewUrl(null);
        setCaption('');
        setUploadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };
  const clearSelection = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="glass-card-gold rounded-3xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <h3 className="font-serif-luxury text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2">
          <Camera className="w-5 h-5 text-gold-600" />
          <span>Partagez Vos Souvenirs du Jour J</span>
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Déposez vos plus belles photos et selfies en direct sans création de compte.
        </p>
      </div>

      {uploadSuccess ? (
        <div className="p-6 rounded-2xl bg-gold-50 dark:bg-zinc-800 border border-gold-300 text-center space-y-2 animate-in fade-in">
          <CheckCircle className="w-10 h-10 text-gold-600 mx-auto" />
          <h4 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Photo envoyée avec succès !
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Votre photo est en cours de validation par notre témoin modérateur et apparaîtra très vite dans la galerie collaborative.
          </p>
        </div>
      ) : !previewUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-gold-500 bg-gold-50/70 scale-[1.01]'
              : 'border-gold-300/80 bg-white/50 hover:bg-white/90 hover:border-gold-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-14 h-14 rounded-full bg-gold-100 dark:bg-zinc-800 text-gold-600 mx-auto flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {isDragActive ? 'Déposez votre photo ici...' : 'Glissez votre photo ou touchez pour ouvrir l\'appareil'}
          </p>
          <p className="text-xs text-zinc-400 mt-1">Formats acceptés : JPG, PNG, WEBP, HEIC (Max 15 Mo)</p>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden max-h-72 w-full bg-black/5 flex items-center justify-center border border-gold-200">
            <img src={previewUrl} alt="Preview" className="max-h-72 object-contain" />
            <button
              type="button"
              onClick={clearSelection}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Votre Nom ou Surnom
              </label>
              <input
                type="text"
                placeholder="Ex: Sophie L. ou Cousin Julien"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-gold-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Moment du Mariage
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-gold-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="e1111111-1111-1111-1111-111111111111">Cérémonie Laïque</option>
                <option value="e2222222-2222-2222-2222-222222222222">Cocktail & Champagne</option>
                <option value="e3333333-3333-3333-3333-333333333333">Dîner & Soirée Dansante</option>
                <option value="e4444444-4444-4444-4444-444444444444">Brunch du Lendemain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
              Légende de la photo (facultatif)
            </label>
            <input
              type="text"
              placeholder="Ex: Les mariés lors de l'ouverture de bal ✨"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-gold-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={clearSelection}
              className="flex-1 py-3 rounded-full border border-gold-300 text-xs uppercase tracking-wider font-semibold text-zinc-600 hover:bg-gold-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-white text-xs uppercase tracking-widest font-semibold shadow-gold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isUploading ? 'Envoi en cours...' : 'Envoyer la photo'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
