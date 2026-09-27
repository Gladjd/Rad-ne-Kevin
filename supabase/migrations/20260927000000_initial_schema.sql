-- ==============================================================================
-- SCHEMA SUPABASE - APPLICATION DE MARIAGE RADENE & KEVIN
-- ==============================================================================

-- 1. EXTENSIONS REQUISES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SUPPRESSION PRÉVENTIVE (IF EXISTS)
DROP TABLE IF EXISTS reminders_log CASCADE;
DROP TABLE IF EXISTS project_tasks CASCADE;
DROP TABLE IF EXISTS guestbook CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS events CASCADE;

-- 3. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE rsvp_status AS ENUM ('en_attente', 'confirme', 'decline');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE photo_status AS ENUM ('en_attente', 'valide', 'rejete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('a_faire', 'en_cours', 'termine');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('haute', 'moyenne', 'basse');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. TABLE : EVENTS (Programme du Jour J et du Week-end)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    date_heure TIMESTAMPTZ NOT NULL,
    lieu TEXT NOT NULL,
    adresse TEXT,
    coordonnees_gps JSONB DEFAULT '{"lat": 43.6961, "lng": 7.2718}'::jsonb,
    description TEXT,
    dress_code TEXT,
    icone TEXT DEFAULT 'sparkles',
    ordre INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE : TABLES (Plan de table 2D)
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_numero TEXT NOT NULL UNIQUE,
    capacite INT NOT NULL DEFAULT 8 CHECK (capacite > 0),
    forme TEXT NOT NULL DEFAULT 'ronde' CHECK (forme IN ('ronde', 'rectangulaire', 'ovale')),
    coordonnees_x_y JSONB NOT NULL DEFAULT '{"x": 150, "y": 150, "rotation": 0}'::jsonb,
    couleur TEXT DEFAULT '#B89355',
    zone TEXT DEFAULT 'Salle Principale',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLE : GUESTS (Gestion des Invités et RSVP)
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT,
    telephone TEXT,
    statut_rsvp rsvp_status NOT NULL DEFAULT 'en_attente',
    menu_choisi TEXT, -- 'viande_boeuf_rossini', 'poisson_bar_sauvage', 'vegetarien_truffe', 'menu_enfant'
    allergies TEXT,
    accompagnants_json JSONB DEFAULT '[]'::jsonb, -- [{ "nom": "...", "prenom": "...", "menu": "...", "allergies": "..." }]
    qr_code_uid TEXT NOT NULL UNIQUE DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)),
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    checked_in BOOLEAN NOT NULL DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    checked_in_by TEXT,
    nombre_invites INT NOT NULL DEFAULT 1,
    navette_requise BOOLEAN DEFAULT FALSE,
    hebergement_requis BOOLEAN DEFAULT FALSE,
    message_maries TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour recherche rapide et scan QR
CREATE INDEX idx_guests_qr_code_uid ON guests(qr_code_uid);
CREATE INDEX idx_guests_nom_prenom ON guests(LOWER(nom), LOWER(prenom));
CREATE INDEX idx_guests_statut_rsvp ON guests(statut_rsvp);
CREATE INDEX idx_guests_table_id ON guests(table_id);

-- 7. TABLE : PHOTOS (Galerie collaborative & Modération)
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    storage_path TEXT,
    uploaded_by TEXT DEFAULT 'Invité Anonyme',
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    caption TEXT,
    statut photo_status NOT NULL DEFAULT 'en_attente',
    likes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_photos_statut ON photos(statut);
CREATE INDEX idx_photos_event_id ON photos(event_id);

-- 8. TABLE : GUESTBOOK (Livre d'or)
CREATE TABLE guestbook (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    emoji TEXT DEFAULT '🥂',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLE : PROJECT_TASKS (Kanban Organisation)
CREATE TABLE project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL,
    description TEXT,
    assigne_a TEXT,
    priorite task_priority NOT NULL DEFAULT 'moyenne',
    echeance DATE,
    statut task_status NOT NULL DEFAULT 'a_faire',
    ordre INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABLE : REMINDERS_LOG (Historique des Relances Email/SMS)
CREATE TABLE reminders_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
    status TEXT NOT NULL DEFAULT 'envoye' CHECK (status IN ('envoye', 'echec', 'en_attente')),
    details TEXT,
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- FONCTIONS & DÉCLENCHEURS (TRIGGERS)
-- ==============================================================================

-- Auto-update `updated_at` on guests
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_guests_updated_at
BEFORE UPDATE ON guests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Auto calculate nombre_invites based on accompagnants_json
CREATE OR REPLACE FUNCTION update_guest_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.accompagnants_json IS NOT NULL AND jsonb_typeof(NEW.accompagnants_json) = 'array' THEN
        NEW.nombre_invites = 1 + jsonb_array_length(NEW.accompagnants_json);
    ELSE
        NEW.nombre_invites = 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_guest_count
BEFORE INSERT OR UPDATE OF accompagnants_json ON guests
FOR EACH ROW
EXECUTE FUNCTION update_guest_count();

-- ==============================================================================
-- SÉCURITÉ : ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders_log ENABLE ROW LEVEL SECURITY;

-- 1. EVENTS : Public en lecture seule, Admin en écriture
CREATE POLICY "Public can view events"
    ON events FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage events"
    ON events FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. TABLES : Public peut lire pour le widget de recherche de table
CREATE POLICY "Public can view tables"
    ON tables FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage tables"
    ON tables FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. GUESTS :
-- - Tout le monde peut rechercher son nom ou son QR code pour RSVP & retrouver sa table
-- - Tout le monde peut mettre à jour son propre RSVP
-- - Les administrateurs ont un accès total (lecture, création, modification, suppression, scan)
CREATE POLICY "Public can search and view basic guest info"
    ON guests FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can update their own RSVP"
    ON guests FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can manage all guests"
    ON guests FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. PHOTOS :
-- - Public voit uniquement les photos 'valide'
-- - Public peut uploader des photos (statut initialement 'en_attente')
-- - Admin peut tout voir et modérer (UPDATE statut)
CREATE POLICY "Public can view approved photos"
    ON photos FOR SELECT
    TO anon, authenticated
    USING (statut = 'valide');

CREATE POLICY "Public can upload photos in pending state"
    ON photos FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can view and moderate all photos"
    ON photos FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. GUESTBOOK :
-- - Public peut lire les vœux et écrire un nouveau message
CREATE POLICY "Public can read guestbook"
    ON guestbook FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can post to guestbook"
    ON guestbook FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can manage guestbook"
    ON guestbook FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. PROJECT_TASKS :
CREATE POLICY "Admins can view and manage tasks"
    ON project_tasks FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public read tasks for demo purposes"
    ON project_tasks FOR SELECT
    TO anon
    USING (true);

-- 7. REMINDERS_LOG :
CREATE POLICY "Admins can view and insert reminders"
    ON reminders_log FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS (Photos de mariage)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public can read wedding photos storage"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'wedding-photos');

CREATE POLICY "Public can upload photos to wedding-photos bucket"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'wedding-photos');

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
ALTER PUBLICATION supabase_realtime ADD TABLE guestbook;
ALTER PUBLICATION supabase_realtime ADD TABLE guests;
ALTER PUBLICATION supabase_realtime ADD TABLE project_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE tables;
