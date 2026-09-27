-- ==============================================================================
-- PHASE 2 : POLITIQUES DE SÉCURITÉ RLS POUR LE BUCKET DE STOCKAGE 'photos_mariage'
-- ==============================================================================

-- 1. CRÉATION DU BUCKET photos_mariage (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'photos_mariage',
    'photos_mariage',
    true,
    15728640, -- 15 Mo max par photo
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. SUPPRESSION DES ANCIENNES POLITIQUES SUR CE BUCKET (POUR IDEMPOTENCE)
DROP POLICY IF EXISTS "Public can upload to photos_mariage" ON storage.objects;
DROP POLICY IF EXISTS "Public can read approved photos in photos_mariage" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all objects in photos_mariage" ON storage.objects;

-- 3. POLITIQUE INSERT : Autoriser tout le monde (anon & authenticated) à uploader des photos
CREATE POLICY "Public can upload to photos_mariage"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
    bucket_id = 'photos_mariage'
);

-- 4. POLITIQUE SELECT :
-- - Le public ne peut lire que les images dont l'entrée correspondante dans la table 'photos' est 'valide'.
-- - Les utilisateurs authentifiés (Admins/Modérateurs) ont accès à tous les fichiers (pour la modération).
CREATE POLICY "Public can read approved photos in photos_mariage"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
    bucket_id = 'photos_mariage'
    AND (
        auth.role() = 'authenticated'
        OR EXISTS (
            SELECT 1 
            FROM public.photos 
            WHERE photos.storage_path = storage.objects.name 
              AND photos.statut = 'valide'
        )
    )
);

-- 5. POLITIQUE ADMIN (UPDATE & DELETE) : Les modérateurs peuvent supprimer ou déplacer les fichiers
CREATE POLICY "Admins can manage all objects in photos_mariage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'photos_mariage')
WITH CHECK (bucket_id = 'photos_mariage');
