'use server';

import { createClient } from '@supabase/supabase-js';
import { PhotoItem } from '@/lib/database.types';
import { generateUUID } from '@/lib/supabase/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

function getSupabaseServerClient() {
  if (!supabaseUrl.startsWith('https://')) return null;
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
}

export interface UploadPhotoActionResult {
  success: boolean;
  message: string;
  photo?: PhotoItem;
}

/**
 * Server Action : Téléversement d'une photo dans le bucket Supabase Storage `photos_mariage`
 * et enregistrement de l'entrée dans la table `photos` avec le statut 'en_attente'
 */
export async function uploadPhotoAction(formData: FormData): Promise<UploadPhotoActionResult> {
  const file = formData.get('file') as File | null;
  const authorName = (formData.get('uploaded_by') as string || '').trim() || 'Invité Anonyme';
  const caption = (formData.get('caption') as string || '').trim() || undefined;
  const eventId = (formData.get('event_id') as string || '') || 'e1111111-1111-1111-1111-111111111111';

  if (!file) {
    return {
      success: false,
      message: 'Aucun fichier fourni.',
    };
  }

  const supabase = getSupabaseServerClient();
  const photoId = generateUUID();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${photoId.substring(0, 8)}.${fileExt}`;
  const storagePath = `invites/${fileName}`;

  let publicUrl = '';

  if (supabase) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Essayer d'abord le bucket photos_mariage (ou fallback wedding-photos)
      let targetBucket = 'photos_mariage';
      let uploadRes = await supabase.storage
        .from(targetBucket)
        .upload(storagePath, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true,
        });

      if (uploadRes.error) {
        // Fallback vers le bucket wedding-photos si photos_mariage n'existe pas encore
        targetBucket = 'wedding-photos';
        uploadRes = await supabase.storage
          .from(targetBucket)
          .upload(storagePath, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });
      }

      if (!uploadRes.error) {
        const { data: urlData } = supabase.storage
          .from(targetBucket)
          .getPublicUrl(storagePath);

        publicUrl = urlData.publicUrl;
      } else {
        console.warn('Erreur Supabase Storage upload:', uploadRes.error);
      }
    } catch (err) {
      console.warn('Storage exception:', err);
    }
  }

  // Si pas d'url publique Supabase Storage, générer data url
  if (!publicUrl) {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    publicUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;
  }

  const newPhoto: PhotoItem = {
    id: photoId,
    url: publicUrl,
    storage_path: storagePath,
    uploaded_by: authorName,
    event_id: eventId,
    caption,
    statut: 'en_attente',
    likes_count: 0,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('photos').insert(newPhoto as any);
    } catch (e) {
      console.warn('Erreur insertion table photos:', e);
    }
  }

  return {
    success: true,
    message: 'Photo transmise avec succès ! Elle sera visible dès validation par le modérateur.',
    photo: newPhoto,
  };
}
