-- ==============================================================================
-- SEED DATA - MARIAGE RADENE & KEVIN
-- ==============================================================================

-- 1. EVENEMENTS DU PROGRAMME
INSERT INTO events (id, nom, date_heure, lieu, adresse, coordonnees_gps, description, dress_code, icone, ordre)
VALUES
(
    'e1111111-1111-1111-1111-111111111111',
    'Cérémonie Laïque & Échange des Vœux',
    '2026-06-20T15:00:00+02:00',
    'Château Saint-Georges - Les Grands Jardins',
    '12 Route de Grasse, 06130 Grasse, Côte d''Azur',
    '{"lat": 43.6622, "lng": 6.9248, "maps_url": "https://maps.google.com/?q=Chateau+Saint-Georges+Grasse"}'::jsonb,
    'Rejoignez-nous sous l''arche fleurie pour célébrer notre union et le partage de nos vœux dans un cadre enchanteur surplombant la baie.',
    'Tenue de cocktail élégante • Nuances pastel & doré',
    'heart',
    1
),
(
    'e2222222-2222-2222-2222-222222222222',
    'Cocktail & Vin d''Honneur au Coucher du Soleil',
    '2026-06-20T17:30:00+02:00',
    'Terrasse Panoramique des Oliviers',
    '12 Route de Grasse, 06130 Grasse',
    '{"lat": 43.6622, "lng": 6.9248, "maps_url": "https://maps.google.com/?q=Chateau+Saint-Georges+Grasse"}'::jsonb,
    'Coupes de champagne, pièces cocktails gastronomiques du Chef et musique acoustique en live par le duo jazz.',
    'Chic & Estival',
    'wine',
    2
),
(
    'e3333333-3333-3333-3333-333333333333',
    'Dîner Gastronomique & Ouverture du Bal',
    '2026-06-20T20:30:00+02:00',
    'Grande Orangerie Royale',
    '12 Route de Grasse, 06130 Grasse',
    '{"lat": 43.6622, "lng": 6.9248, "maps_url": "https://maps.google.com/?q=Chateau+Saint-Georges+Grasse"}'::jsonb,
    'Repas d''exception 4 services orchestré par notre traiteur étoilé, discours surprises des témoins, cascade de pièces montées et nuit dansante jusqu''à l''aube.',
    'Black Tie Optional / Smoking & Robes longues',
    'sparkles',
    3
),
(
    'e4444444-4444-4444-4444-444444444444',
    'Brunch Décontracté du Lendemain',
    '2026-06-21T12:00:00+02:00',
    'Espace Piscine & Gazébo Privé',
    '12 Route de Grasse, 06130 Grasse',
    '{"lat": 43.6622, "lng": 6.9248, "maps_url": "https://maps.google.com/?q=Chateau+Saint-Georges+Grasse"}'::jsonb,
    'Buffet méditerranéen gourmand, bar à smoothies, viennoiseries fraîches et détente au soleil pour prolonger les festivités.',
    'Garden Party Casual & Lunettes de soleil',
    'sun',
    4
);

-- 2. TABLES (Plan de table 2D)
INSERT INTO tables (id, nom_numero, capacite, forme, coordonnees_x_y, couleur, zone, notes)
VALUES
(
    't1111111-1111-1111-1111-111111111111',
    'Table d''Honneur - Éternité',
    8,
    'rectangulaire',
    '{"x": 420, "y": 80, "rotation": 0}'::jsonb,
    '#B89355',
    'Estrade Royale',
    'Les Mariés (Radene & Kevin), Parents & Témoins principaux'
),
(
    't2222222-2222-2222-2222-222222222222',
    'Table 1 - Côte d''Azur',
    8,
    'ronde',
    '{"x": 160, "y": 240, "rotation": 0}'::jsonb,
    '#6E9072',
    'Aile Ouest',
    'Famille Proche & Cousins'
),
(
    't3333333-3333-3333-3333-333333333333',
    'Table 2 - Riviera Glamour',
    8,
    'ronde',
    '{"x": 420, "y": 270, "rotation": 0}'::jsonb,
    '#CE7C6C',
    'Zone Centrale',
    'Amis d''Enfance et Lycée'
),
(
    't4444444-4444-4444-4444-444444444444',
    'Table 3 - Belle Époque',
    8,
    'ronde',
    '{"x": 680, "y": 240, "rotation": 0}'::jsonb,
    '#B89355',
    'Aile Est',
    'Amis Promo Promo Université / Grandes Écoles'
),
(
    't5555555-5555-5555-5555-555555555555',
    'Table 4 - Étoile Filante',
    10,
    'ronde',
    '{"x": 220, "y": 440, "rotation": 0}'::jsonb,
    '#6E9072',
    'Aile Ouest',
    'Collègues & Partenaires'
),
(
    't6666666-6666-6666-6666-666666666666',
    'Table 5 - Dolce Vita',
    8,
    'ronde',
    '{"x": 620, "y": 440, "rotation": 0}'::jsonb,
    '#CE7C6C',
    'Aile Est',
    'Amis Internationaux & Voisins'
);

-- 3. INVITÉS (GUESTS)
INSERT INTO guests (id, nom, prenom, email, telephone, statut_rsvp, menu_choisi, allergies, accompagnants_json, qr_code_uid, table_id, checked_in, checked_in_at, nombre_invites, navette_requise, hebergement_requis, message_maries)
VALUES
(
    'g1111111-1111-1111-1111-111111111111',
    'Dupont',
    'Alexandre',
    'alexandre.dupont@example.com',
    '+33 6 12 34 56 78',
    'confirme',
    'viande_boeuf_rossini',
    'Aucune',
    '[{"nom": "Dupont", "prenom": "Camille", "menu": "poisson_bar_sauvage", "allergies": "Fruits de mer"}]'::jsonb,
    'RK-A8F29',
    't1111111-1111-1111-1111-111111111111',
    true,
    '2026-06-20T14:45:00+02:00',
    2,
    true,
    true,
    'Tellement hâte de fêter ce jour magique à vos côtés ! Vous êtes magnifiques !'
),
(
    'g2222222-2222-2222-2222-222222222222',
    'Laurent',
    'Sophie',
    'sophie.laurent@example.com',
    '+33 6 98 76 54 32',
    'confirme',
    'vegetarien_truffe',
    'Gluten (sensibilité légère)',
    '[{"nom": "Moreau", "prenom": "Julien", "menu": "viande_boeuf_rossini", "allergies": "Aucune"}]'::jsonb,
    'RK-B7K91',
    't3333333-3333-3333-3333-333333333333',
    false,
    null,
    2,
    false,
    true,
    'Un immense bonheur pour vous deux. Plein d''amour et de joie !'
),
(
    'g3333333-3333-3333-3333-333333333333',
    'Bernard',
    'Antoine',
    'antoine.bernard@example.com',
    '+33 6 11 22 33 44',
    'en_attente',
    null,
    null,
    '[]'::jsonb,
    'RK-C3M44',
    't4444444-4444-4444-4444-444444444444',
    false,
    null,
    1,
    false,
    false,
    null
),
(
    'g4444444-4444-4444-4444-444444444444',
    'Martin',
    'Élodie',
    'elodie.martin@example.com',
    '+33 6 55 44 33 22',
    'confirme',
    'poisson_bar_sauvage',
    'Arachides',
    '[]'::jsonb,
    'RK-D9P12',
    't2222222-2222-2222-2222-222222222222',
    false,
    null,
    1,
    true,
    false,
    'Félicitations aux futurs mariés ! Que votre vie soit remplie d''aventures merveilleuses.'
),
(
    'g5555555-5555-5555-5555-555555555555',
    'Morel',
    'Christophe',
    'christophe.morel@example.com',
    '+33 6 77 88 99 00',
    'decline',
    null,
    null,
    '[]'::jsonb,
    'RK-E5Q77',
    null,
    false,
    null,
    1,
    false,
    false,
    'De tout cœur avec vous par la pensée, je serai malheureusement en déplacement professionnel.'
),
(
    'g6666666-6666-6666-6666-666666666666',
    'Girard',
    'Thomas',
    'thomas.girard@example.com',
    '+33 6 44 33 22 11',
    'en_attente',
    null,
    null,
    '[]'::jsonb,
    'RK-F6V89',
    't5555555-5555-5555-5555-555555555555',
    false,
    null,
    1,
    false,
    false,
    null
);

-- 4. PHOTOS DE LA GALERIE (PHOTOS)
INSERT INTO photos (id, url, storage_path, uploaded_by, event_id, caption, statut, likes_count, created_at)
VALUES
(
    'p1111111-1111-1111-1111-111111111111',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'wedding/ceremony_arch.jpg',
    'Radene & Kevin',
    'e1111111-1111-1111-1111-111111111111',
    'L''arche fleurie prête pour le grand moment sous le soleil de Provence.',
    'valide',
    42,
    '2026-06-20T14:10:00+02:00'
),
(
    'p2222222-2222-2222-2222-222222222222',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    'wedding/rings.jpg',
    'Camille D.',
    'e1111111-1111-1111-1111-111111111111',
    'Les alliances dorées gravées de nos initiales.',
    'valide',
    38,
    '2026-06-20T15:30:00+02:00'
),
(
    'p3333333-3333-3333-3333-333333333333',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    'wedding/table_decor.jpg',
    'Sophie Laurent',
    'e3333333-3333-3333-3333-333333333333',
    'Une table sublimement décorée de chandeliers et d''eucalyptus frais.',
    'valide',
    29,
    '2026-06-20T18:00:00+02:00'
),
(
    'p4444444-4444-4444-4444-444444444444',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    'wedding/champagne_toast.jpg',
    'Alexandre Dupont',
    'e2222222-2222-2222-2222-222222222222',
    'À la santé des mariés ! 🥂',
    'valide',
    56,
    '2026-06-20T18:30:00+02:00'
),
(
    'p5555555-5555-5555-5555-555555555555',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    'wedding/sunset_couple.jpg',
    'Invité Anonyme',
    'e2222222-2222-2222-2222-222222222222',
    'Photo volée au coucher du soleil pendant le cocktail.',
    'en_attente',
    0,
    '2026-06-20T19:15:00+02:00'
);

-- 5. LIVRE D'OR (GUESTBOOK)
INSERT INTO guestbook (id, guest_name, email, message, emoji, is_pinned, created_at)
VALUES
(
    'b1111111-1111-1111-1111-111111111111',
    'Marie & Jean-Pierre (Parents)',
    'parents@example.com',
    'Nos cœurs débordent d''émotion en vous voyant si complices et rayonnants. Que cette journée soit le premier chapitre du plus beau des contes de fées.',
    '✨',
    true,
    '2026-06-20T11:00:00+02:00'
),
(
    'b2222222-2222-2222-2222-222222222222',
    'Alexandre & Camille',
    'alexandre.dupont@example.com',
    'Quelle ambiance inoubliable ! Bravo pour cette organisation magistrale et ce lieu à couper le souffle. Longue vie à votre amour !',
    '🥂',
    false,
    '2026-06-20T19:45:00+02:00'
),
(
    'b3333333-3333-3333-3333-333333333333',
    'Élodie Martin',
    'elodie.martin@example.com',
    'Les larmes aux yeux pendant l''échange de vos vœux... Tout était parfait du début à la fin. Mille mercis pour ce moment suspendu !',
    '💖',
    false,
    '2026-06-20T21:10:00+02:00'
);

-- 6. TÂCHES DU KANBAN (PROJECT_TASKS)
INSERT INTO project_tasks (id, titre, description, assigne_a, priorite, echeance, statut, ordre)
VALUES
(
    'k1111111-1111-1111-1111-111111111111',
    'Valider la playlist d''ouverture de bal avec le DJ',
    'Envoyer le medley acoustique & salsa préparé avec la professeure de danse.',
    'Kevin',
    'haute',
    '2026-06-10',
    'termine',
    1
),
(
    'k2222222-2222-2222-2222-222222222222',
    'Imprimer les livrets de messe & menus dorés',
    'Vérifier les épreuves de l''imprimeur à Grasse avant tirage final de 120 exemplaires.',
    'Radene',
    'haute',
    '2026-06-12',
    'en_cours',
    2
),
(
    'k3333333-3333-3333-3333-333333333333',
    'Lancer la relance SMS pour les 25 invités sans réponse',
    'Utiliser le panneau de relance automatique Supabase + Twilio.',
    'Témoin Alexandre',
    'haute',
    '2026-06-05',
    'en_cours',
    3
),
(
    'k4444444-4444-4444-4444-444444444444',
    'Finaliser les cadeaux d''invités (Filtres d''huile d''olive & lavande)',
    'Mise en sachets et étiquettes personnalisées "Radene & Kevin 2026".',
    'Camille & Sophie',
    'moyenne',
    '2026-06-15',
    'a_faire',
    4
),
(
    'k5555555-5555-5555-5555-555555555555',
    'Briefing des hôtesses d''accueil et test des scanners QR',
    'Vérifier que les tablettes iPad et smartphones du protocole ont l''application ouverte.',
    'Kevin & Protocole',
    'moyenne',
    '2026-06-19',
    'a_faire',
    5
);
