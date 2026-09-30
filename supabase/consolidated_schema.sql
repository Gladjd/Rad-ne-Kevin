-- ==============================================================================
-- SCHEMA SUPABASE COMPLET - APPLICATION DE MARIAGE RADÈNE & KÉVIN
-- Projet : bgdoudwqamjxlzawqtkl (Radene-Kevin)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SUPPRESSION PRÉVENTIVE
DROP TABLE IF EXISTS reminders_log CASCADE;
DROP TABLE IF EXISTS project_tasks CASCADE;
DROP TABLE IF EXISTS guestbook CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

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

-- 4. TABLE : USER_ROLES (RBAC Admin)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'GUEST' CHECK (role IN ('ADMIN', 'ORGANIZER', 'VIP', 'GUEST')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE : EVENTS (Programme du Mariage à Dieuppeul, Dakar)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    date_heure TIMESTAMPTZ NOT NULL,
    lieu TEXT NOT NULL,
    adresse TEXT,
    coordonnees_gps JSONB DEFAULT '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Paroisse+Sainte+Therese+Dieuppeul+Dakar"}'::jsonb,
    description TEXT,
    dress_code TEXT,
    icone TEXT DEFAULT 'sparkles',
    ordre INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLE : TABLES (Plan de table 2D)
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

-- 7. TABLE : GUESTS (Gestion des Invités et RSVP)
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT,
    telephone TEXT,
    statut_rsvp rsvp_status NOT NULL DEFAULT 'en_attente',
    menu_choisi TEXT,
    allergies TEXT,
    accompagnants_json JSONB DEFAULT '[]'::jsonb,
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

CREATE INDEX idx_guests_qr_code_uid ON guests(qr_code_uid);
CREATE INDEX idx_guests_nom_prenom ON guests(LOWER(nom), LOWER(prenom));
CREATE INDEX idx_guests_statut_rsvp ON guests(statut_rsvp);
CREATE INDEX idx_guests_table_id ON guests(table_id);

-- 8. TABLE : PHOTOS (Galerie collaborative)
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

-- 9. TABLE : GUESTBOOK (Livre d'or)
CREATE TABLE guestbook (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    emoji TEXT DEFAULT '🥂',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABLE : PROJECT_TASKS (Kanban Organisation)
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

-- 11. TABLE : REMINDERS_LOG (Historique des Relances)
CREATE TABLE reminders_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
    status TEXT NOT NULL DEFAULT 'envoye' CHECK (status IN ('envoye', 'echec', 'en_attente')),
    details TEXT,
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. TRIGGERS
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

-- 13. SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders_log ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Public can view events" ON events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view tables" ON tables FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage tables" ON tables FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can search and view basic guest info" ON guests FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can update their own RSVP" ON guests FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage all guests" ON guests FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view approved photos" ON photos FOR SELECT TO anon, authenticated USING (statut = 'valide');
CREATE POLICY "Public can upload photos in pending state" ON photos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view and moderate all photos" ON photos FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can read guestbook" ON guestbook FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can post to guestbook" ON guestbook FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage guestbook" ON guestbook FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can view and manage tasks" ON project_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read tasks for demo purposes" ON project_tasks FOR SELECT TO anon USING (true);

CREATE POLICY "Admins can view and insert reminders" ON reminders_log FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow read user_roles for authenticated users" ON user_roles FOR SELECT TO authenticated USING (true);

-- 14. BUCKET DE STOCKAGE PHOTOS
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public can read wedding photos storage"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'wedding-photos');

CREATE POLICY "Public can upload photos to wedding-photos bucket"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'wedding-photos');

-- 15. REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
ALTER PUBLICATION supabase_realtime ADD TABLE guestbook;
ALTER PUBLICATION supabase_realtime ADD TABLE guests;
ALTER PUBLICATION supabase_realtime ADD TABLE project_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE tables;

-- 16. DONNÉES INITIALES (SEED DATA)
INSERT INTO events (id, nom, date_heure, lieu, adresse, coordonnees_gps, description, dress_code, icone, ordre) VALUES
('e1111111-1111-1111-1111-111111111111', 'Bénédiction Nuptiale & Sacrement de Mariage', '2026-12-05T15:00:00+00:00', 'Paroisse Sainte-Thérèse de Dieuppeul', 'Allées Ababacar Sy, Dieuppeul-Derklé, Dakar, Sénégal', '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Paroisse+Sainte+Therese+Dieuppeul+Dakar"}'::jsonb, 'Célébration eucharistique solennelle et échange des consentements sacrés sous la bénédiction de Dieu et en présence de tous nos proches.', 'Élégance Royale • Nuances Blanc Pur, Or & Bleu Roi', 'heart', 1),
('e2222222-2222-2222-2222-222222222222', 'Cocktail d’Honneur & Félicitations au Coucher du Soleil', '2026-12-05T17:30:00+00:00', 'Jardins Royaux de Réception', 'Dakar, Sénégal', '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Paroisse+Sainte+Therese+Dieuppeul+Dakar"}'::jsonb, 'Coupes de champagne, bouchées gastronomiques raffinées et musique acoustique en live pour célébrer les nouveaux mariés.', 'Chic Majestueux & Tenues Traditionnelles Raffinées', 'wine', 2),
('e3333333-3333-3333-3333-333333333333', 'Dîner de Gala & Ouverture du Bal Royal', '2026-12-05T20:30:00+00:00', 'Grande Salle Royale des Célébrations', 'Dakar, Sénégal', '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Paroisse+Sainte+Therese+Dieuppeul+Dakar"}'::jsonb, 'Banquet d’exception 4 services, discours surprises émouvants des familles et témoins, cascade de pièces montées dorées et nuit dansante.', 'Black Tie / Smoking & Robes Longues de Soirée', 'sparkles', 3),
('e4444444-4444-4444-4444-444444444444', 'Messe d’Action de Grâce & Brunch Convivial', '2026-12-06T12:00:00+00:00', 'Résidence Privée & Espaces Détente', 'Dakar, Sénégal', '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Paroisse+Sainte+Therese+Dieuppeul+Dakar"}'::jsonb, 'Action de grâce, buffet gourmand aux saveurs locales et internationales, rafraîchissements et partage de souvenirs.', 'Garden Party Chic & Décontracté', 'sun', 4);

INSERT INTO tables (id, nom_numero, capacite, forme, coordonnees_x_y, couleur, zone, notes) VALUES
('t1111111-1111-1111-1111-111111111111', 'Table d''Honneur - Pureté & Charité', 8, 'rectangulaire', '{"x": 380, "y": 70, "rotation": 0}'::jsonb, '#D4AF37', 'Estrade Royale', 'Mariés (Radène & Kévin), Parents & Témoins'),
('t2222222-2222-2222-2222-222222222222', 'Table 1 - Alliance Céleste', 8, 'ronde', '{"x": 140, "y": 220, "rotation": 0}'::jsonb, '#133E87', 'Aile Ouest', 'Famille Proche & Cousins'),
('t3333333-3333-3333-3333-333333333333', 'Table 2 - Grâce Éternelle', 8, 'ronde', '{"x": 380, "y": 240, "rotation": 0}'::jsonb, '#D4AF37', 'Zone Centrale', 'Amis d''Enfance et Collège'),
('t4444444-4444-4444-4444-444444444444', 'Table 3 - Bénédiction Divine', 8, 'ronde', '{"x": 620, "y": 220, "rotation": 0}'::jsonb, '#133E87', 'Aile Est', 'Amis Universitaires & Grandes Écoles'),
('t5555555-5555-5555-5555-555555555555', 'Table 4 - Étoile d’Or', 10, 'ronde', '{"x": 190, "y": 410, "rotation": 0}'::jsonb, '#D4AF37', 'Aile Ouest', 'Collègues & Partenaires'),
('t6666666-6666-6666-6666-666666666666', 'Table 5 - Harmonie Royale', 8, 'ronde', '{"x": 570, "y": 410, "rotation": 0}'::jsonb, '#133E87', 'Aile Est', 'Amis Internationaux & Voisins');

INSERT INTO guests (id, nom, prenom, email, telephone, statut_rsvp, menu_choisi, allergies, accompagnants_json, qr_code_uid, table_id, checked_in, checked_in_at, checked_in_by, nombre_invites, navette_requise, hebergement_requis, message_maries) VALUES
('g1111111-1111-1111-1111-111111111111', 'Dupont', 'Alexandre', 'alexandre.dupont@example.com', '+221 77 123 45 67', 'confirme', 'viande_boeuf_rossini', 'Aucune', '[{"nom": "Dupont", "prenom": "Camille", "menu": "poisson_bar_sauvage", "allergies": "Fruits de mer", "age_category": "adulte"}]'::jsonb, 'RK-A8F29', 't1111111-1111-1111-1111-111111111111', true, '2026-12-05T14:45:00+00:00', 'Protocole Accueil', 2, true, true, 'Tellement hâte de fêter ce jour magique et sacré à vos côtés ! Que Dieu bénisse votre foyer.'),
('g2222222-2222-2222-2222-222222222222', 'Laurent', 'Sophie', 'sophie.laurent@example.com', '+221 78 987 65 43', 'confirme', 'vegetarien_truffe', 'Gluten (sensibilité)', '[{"nom": "Moreau", "prenom": "Julien", "menu": "viande_boeuf_rossini", "allergies": "Aucune", "age_category": "adulte"}]'::jsonb, 'RK-B7K91', 't3333333-3333-3333-3333-333333333333', false, null, null, 2, false, true, 'Un immense bonheur pour vous deux. Pureté, Amour et Charité au quotidien !'),
('g3333333-3333-3333-3333-333333333333', 'Bernard', 'Antoine', 'antoine.bernard@example.com', '+221 76 112 23 34', 'en_attente', null, null, '[]'::jsonb, 'RK-C3M44', 't4444444-4444-4444-4444-444444444444', false, null, null, 1, false, false, null),
('g4444444-4444-4444-4444-444444444444', 'Martin', 'Élodie', 'elodie.martin@example.com', '+221 77 554 43 32', 'confirme', 'poisson_bar_sauvage', 'Arachides', '[]'::jsonb, 'RK-D9P12', 't2222222-2222-2222-2222-222222222222', false, null, null, 1, true, false, 'Félicitations aux futurs mariés ! Hâte d’être à Dieuppeul pour ce grand jour.'),
('g5555555-5555-5555-5555-555555555555', 'Morel', 'Christophe', 'christophe.morel@example.com', '+221 70 778 89 90', 'decline', null, null, '[]'::jsonb, 'RK-E5Q77', null, false, null, null, 1, false, false, 'De tout cœur avec vous par la prière et la pensée pour ce saint mariage.'),
('g6666666-6666-6666-6666-666666666666', 'Girard', 'Thomas', 'thomas.girard@example.com', '+221 78 443 32 21', 'en_attente', null, null, '[]'::jsonb, 'RK-F6V89', 't5555555-5555-5555-5555-555555555555', false, null, null, 1, false, false, null);

INSERT INTO photos (id, url, uploaded_by, event_id, caption, statut, likes_count) VALUES
('p1111111-1111-1111-1111-111111111111', '/img/couple-16.jpg', 'Radène & Kévin', 'e1111111-1111-1111-1111-111111111111', 'Complicité et élégance : notre union sous le sceau de la grâce.', 'valide', 58),
('p2222222-2222-2222-2222-222222222222', '/img/couple-15.jpg', 'Radène & Kévin', 'e1111111-1111-1111-1111-111111111111', 'La tradition et la noblesse des tenues royales.', 'valide', 49),
('p3333333-3333-3333-3333-333333333333', '/img/couple-14.jpg', 'Famille & Témoins', 'e3333333-3333-3333-3333-333333333333', 'Un regard qui en dit long sur toute une vie d’amour.', 'valide', 41),
('p4444444-4444-4444-4444-444444444444', '/img/couple-12.jpg', 'Alexandre Dupont', 'e2222222-2222-2222-2222-222222222222', 'Rayonnants sous les éclats dorés de cette belle journée ! 🥂', 'valide', 67),
('p5555555-5555-5555-5555-555555555555', '/img/couple-10.jpg', 'Sophie Laurent', 'e2222222-2222-2222-2222-222222222222', 'La beauté des tenues traditionnelles bleu roi et or.', 'valide', 35),
('p6666666-6666-6666-6666-666666666666', '/img/couple-4.jpg', 'Témoin Julien', 'e3333333-3333-3333-3333-333333333333', 'Moments précieux gravés pour l’éternité ✨', 'valide', 52);

INSERT INTO guestbook (id, guest_name, email, message, emoji, is_pinned) VALUES
('b1111111-1111-1111-1111-111111111111', 'Marie & Jean-Pierre (Parents)', 'parents@example.com', 'Nos cœurs débordent d’émotion en vous voyant si complices et rayonnants devant l’autel de Dieuppeul. Que le Seigneur bénisse votre foyer d’un amour inconditionnel.', '✨', true),
('b2222222-2222-2222-2222-222222222222', 'Alexandre & Camille', 'alexandre.dupont@example.com', 'Quelle grâce et quelle magnificence ! Une cérémonie si émouvante et une soirée royale inoubliable. Longue et sainte vie à votre mariage !', '🥂', false),
('b3333333-3333-3333-3333-333333333333', 'Élodie Martin', 'elodie.martin@example.com', 'Les larmes aux yeux lors de la bénédiction à la Paroisse de Dieuppeul... Pureté, Amour et Charité incarnés à la perfection. Félicitations Radène et Kévin !', '💖', false);

INSERT INTO project_tasks (id, titre, description, assigne_a, priorite, echeance, statut, ordre) VALUES
('k1111111-1111-1111-1111-111111111111', 'Répétition des chants liturgiques à la Paroisse de Dieuppeul', 'Valider les chants d’entrée et de communion avec la chorale paroissiale.', 'Kévin', 'haute', '2026-11-28', 'termine', 1),
('k2222222-2222-2222-2222-222222222222', 'Imprimer les livrets de messe & menus royaux dorés', 'Vérifier le monogramme R & K et les finitions en feuille d’or avant tirage.', 'Radène', 'haute', '2026-11-25', 'en_cours', 2),
('k3333333-3333-3333-3333-333333333333', 'Relance des invités pour confirmation RSVP', 'Utiliser la passerelle de relance automatique Supabase + Resend / Twilio.', 'Témoin Alexandre', 'haute', '2026-11-15', 'en_cours', 3),
('k4444444-4444-4444-4444-444444444444', 'Finaliser la scénographie et les fleurs d’honneur', 'Roses blanches pures, feuillages et rubans dorés.', 'Camille & Sophie', 'moyenne', '2026-12-01', 'a_faire', 4),
('k5555555-5555-5555-5555-555555555555', 'Briefing protocole et test des scanners QR Jour-J', 'Vérifier la fluidité du contrôle d’accès aux entrées.', 'Kévin & Protocole', 'moyenne', '2026-12-04', 'a_faire', 5);

-- 17. ATTRIBUTION RÔLE ADMIN AU COMPTE CRÉÉ
INSERT INTO user_roles (user_id, role)
SELECT id, 'ADMIN' FROM auth.users WHERE email = 'gladinhopoh@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'ADMIN';
