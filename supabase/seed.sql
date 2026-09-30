-- ==============================================================================
-- SEED DATA - MARIAGE RADENE & KEVIN
-- ==============================================================================

-- 1. EVENEMENTS DU PROGRAMME (Déjà insérés par les migrations si applicable, ici avec les données Dieuppeul)
INSERT INTO events (id, nom, date_heure, lieu, adresse, coordonnees_gps, description, dress_code, icone, ordre)
VALUES
(
    'e1111111-1111-1111-1111-111111111111',
    'Bénédiction nuptiale',
    '2026-12-05T11:00:00+00:00',
    'Eglise Protestante du Sénégal, Paroisse de Dieuppeul',
    'Allées Ababacar Sy, Dieuppeul-Derklé, Dakar, Sénégal',
    '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Eglise+Protestante+du+Senegal+Dieuppeul+Dakar"}'::jsonb,
    'Célébration solennelle et échange des consentements sacrés sous la bénédiction divine en présence de nos familles et proches.',
    'Élégance Royale • Nuances Blanc Pur, Or & Bleu Roi',
    'church',
    1
),
(
    'e2222222-2222-2222-2222-222222222222',
    'Soirée de gala',
    '2026-12-05T20:00:00+00:00',
    'Salle de fête Fun Time',
    'Dakar, Sénégal',
    '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Salle+de+fete+Fun+Time+Dakar"}'::jsonb,
    'Dîner de gala féerique, banquet d’exception, discours émouvants, ouverture du bal royal et célébration dansante jusqu’au bout de la nuit.',
    'Black Tie / Smoking & Robes Longues de Soirée',
    'sparkles',
    2
),
(
    'e3333333-3333-3333-3333-333333333333',
    'Culte d’action de grâce',
    '2026-12-06T10:00:00+00:00',
    'Eglise Protestante du Sénégal, Paroisse de Dieuppeul',
    'Allées Ababacar Sy, Dieuppeul-Derklé, Dakar, Sénégal',
    '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Eglise+Protestante+du+Senegal+Dieuppeul+Dakar"}'::jsonb,
    'Culte d’action de grâce pour rendre gloire à Dieu pour cette sainte union, suivi de moments fraternels de partage et de convivialité.',
    'Chic & Décontracté',
    'sun',
    3
)
ON CONFLICT (id) DO UPDATE SET
  nom = EXCLUDED.nom,
  date_heure = EXCLUDED.date_heure,
  lieu = EXCLUDED.lieu,
  adresse = EXCLUDED.adresse,
  coordonnees_gps = EXCLUDED.coordonnees_gps,
  description = EXCLUDED.description,
  dress_code = EXCLUDED.dress_code,
  icone = EXCLUDED.icone,
  ordre = EXCLUDED.ordre;

-- 2. TABLES (Plan de table 2D)
INSERT INTO tables (id, nom_numero, capacite, forme, coordonnees_x_y, couleur, zone, notes)
VALUES
(
    'a1111111-1111-4111-8111-111111111111',
    'Table d''Honneur - Éternité',
    8,
    'rectangulaire',
    '{"x": 420, "y": 80, "rotation": 0}'::jsonb,
    '#B89355',
    'Estrade Royale',
    'Les Mariés (Radene & Kevin), Parents & Témoins principaux'
),
(
    'a2222222-2222-4222-8222-222222222222',
    'Table 1 - Côte d''Azur',
    8,
    'ronde',
    '{"x": 160, "y": 240, "rotation": 0}'::jsonb,
    '#6E9072',
    'Aile Ouest',
    'Famille Proche & Cousins'
),
(
    'a3333333-3333-4333-8333-333333333333',
    'Table 2 - Riviera Glamour',
    8,
    'ronde',
    '{"x": 420, "y": 270, "rotation": 0}'::jsonb,
    '#CE7C6C',
    'Zone Centrale',
    'Amis d''Enfance et Lycée'
),
(
    'a4444444-4444-4444-8444-444444444444',
    'Table 3 - Belle Époque',
    8,
    'ronde',
    '{"x": 680, "y": 240, "rotation": 0}'::jsonb,
    '#B89355',
    'Aile Est',
    'Amis Promo Promo Université / Grandes Écoles'
),
(
    'a5555555-5555-4555-8555-555555555555',
    'Table 4 - Étoile Filante',
    10,
    'ronde',
    '{"x": 220, "y": 440, "rotation": 0}'::jsonb,
    '#6E9072',
    'Aile Ouest',
    'Collègues & Partenaires'
),
(
    'a6666666-6666-4666-8666-666666666666',
    'Table 5 - Dolce Vita',
    8,
    'ronde',
    '{"x": 620, "y": 440, "rotation": 0}'::jsonb,
    '#CE7C6C',
    'Aile Est',
    'Amis Internationaux & Voisins'
)
ON CONFLICT (id) DO NOTHING;

-- 3. INVITÉS (GUESTS)
INSERT INTO guests (id, nom, prenom, email, telephone, statut_rsvp, menu_choisi, allergies, accompagnants_json, qr_code_uid, table_id, checked_in, checked_in_at, nombre_invites, navette_requise, hebergement_requis, message_maries)
VALUES
(
    'b1111111-1111-4111-8111-111111111111',
    'Dupont',
    'Alexandre',
    'alexandre.dupont@example.com',
    '+33 6 12 34 56 78',
    'confirme',
    'viande_boeuf_rossini',
    'Aucune',
    '[{"nom": "Dupont", "prenom": "Camille", "menu": "poisson_bar_sauvage", "allergies": "Fruits de mer"}]'::jsonb,
    'RK-A8F29',
    'a1111111-1111-4111-8111-111111111111',
    true,
    '2026-06-20T14:45:00+02:00',
    2,
    true,
    true,
    'Tellement hâte de fêter ce jour magique à vos côtés ! Vous êtes magnifiques !'
),
(
    'b2222222-2222-4222-8222-222222222222',
    'Laurent',
    'Sophie',
    'sophie.laurent@example.com',
    '+33 6 98 76 54 32',
    'confirme',
    'vegetarien_truffe',
    'Gluten (sensibilité légère)',
    '[{"nom": "Moreau", "prenom": "Julien", "menu": "viande_boeuf_rossini", "allergies": "Aucune"}]'::jsonb,
    'RK-B7K91',
    'a3333333-3333-4333-8333-333333333333',
    false,
    null,
    2,
    false,
    true,
    'Un immense bonheur pour vous deux. Plein d''amour et de joie !'
),
(
    'b3333333-3333-4333-8333-333333333333',
    'Bernard',
    'Antoine',
    'antoine.bernard@example.com',
    '+33 6 11 22 33 44',
    'en_attente',
    null,
    null,
    '[]'::jsonb,
    'RK-C3M44',
    'a4444444-4444-4444-8444-444444444444',
    false,
    null,
    1,
    false,
    false,
    null
),
(
    'b4444444-4444-4444-8444-444444444444',
    'Martin',
    'Élodie',
    'elodie.martin@example.com',
    '+33 6 55 44 33 22',
    'confirme',
    'poisson_bar_sauvage',
    'Arachides',
    '[]'::jsonb,
    'RK-D9P12',
    'a2222222-2222-4222-8222-222222222222',
    false,
    null,
    1,
    true,
    false,
    'Félicitations aux futurs mariés ! Que votre vie soit remplie d''aventures merveilleuses.'
),
(
    'b5555555-5555-4555-8555-555555555555',
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
    'b6666666-6666-4666-8666-666666666666',
    'Girard',
    'Thomas',
    'thomas.girard@example.com',
    '+33 6 44 33 22 11',
    'en_attente',
    null,
    null,
    '[]'::jsonb,
    'RK-F6V89',
    'a5555555-5555-4555-8555-555555555555',
    false,
    null,
    1,
    false,
    false,
    null
)
ON CONFLICT (id) DO NOTHING;

-- 4. PHOTOS DE LA GALERIE (PHOTOS)
INSERT INTO photos (id, url, storage_path, uploaded_by, event_id, caption, statut, likes_count, created_at)
VALUES
(
    'c1111111-1111-4111-8111-111111111111',
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
    'c2222222-2222-4222-8222-222222222222',
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
    'c3333333-3333-4333-8333-333333333333',
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
    'c4444444-4444-4444-8444-444444444444',
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
    'c5555555-5555-4555-8555-555555555555',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    'wedding/sunset_couple.jpg',
    'Invité Anonyme',
    'e2222222-2222-2222-2222-222222222222',
    'Photo volée au coucher du soleil pendant le cocktail.',
    'en_attente',
    0,
    '2026-06-20T19:15:00+02:00'
)
ON CONFLICT (id) DO NOTHING;

-- 5. LIVRE D'OR (GUESTBOOK)
INSERT INTO guestbook (id, guest_name, email, message, emoji, is_pinned, created_at)
VALUES
(
    'd1111111-1111-4111-8111-111111111111',
    'Marie & Jean-Pierre (Parents)',
    'parents@example.com',
    'Nos cœurs débordent d''émotion en vous voyant si complices et rayonnants. Que cette journée soit le premier chapitre du plus beau des contes de fées.',
    '✨',
    true,
    '2026-06-20T11:00:00+02:00'
),
(
    'd2222222-2222-4222-8222-222222222222',
    'Alexandre & Camille',
    'alexandre.dupont@example.com',
    'Quelle ambiance inoubliable ! Bravo pour cette organisation magistrale et ce lieu à couper le souffle. Longue vie à votre amour !',
    '🥂',
    false,
    '2026-06-20T19:45:00+02:00'
),
(
    'd3333333-3333-4333-8333-333333333333',
    'Élodie Martin',
    'elodie.martin@example.com',
    'Les larmes aux yeux pendant l''échange de vos vœux... Tout était parfait du début à la fin. Mille mercis pour ce moment suspendu !',
    '💖',
    false,
    '2026-06-20T21:10:00+02:00'
)
ON CONFLICT (id) DO NOTHING;

-- 6. TÂCHES DU KANBAN (PROJECT_TASKS)
INSERT INTO project_tasks (id, titre, description, assigne_a, priorite, echeance, statut, ordre)
VALUES
(
    'f1111111-1111-4111-8111-111111111111',
    'Valider la playlist d''ouverture de bal avec le DJ',
    'Envoyer le medley acoustique & salsa préparé avec la professeure de danse.',
    'Kevin',
    'haute',
    '2026-06-10',
    'termine',
    1
),
(
    'f2222222-2222-4222-8222-222222222222',
    'Imprimer les livrets de messe & menus dorés',
    'Vérifier les épreuves de l''imprimeur à Grasse avant tirage final de 120 exemplaires.',
    'Radene',
    'haute',
    '2026-06-12',
    'en_cours',
    2
),
(
    'f3333333-3333-4333-8333-333333333333',
    'Lancer la relance SMS pour les 25 invités sans réponse',
    'Utiliser le panneau de relance automatique Supabase + Twilio.',
    'Témoin Alexandre',
    'haute',
    '2026-06-05',
    'en_cours',
    3
),
(
    'f4444444-4444-4444-8444-444444444444',
    'Finaliser les cadeaux d''invités (Filtres d''huile d''olive & lavande)',
    'Mise en sachets et étiquettes personnalisées "Radene & Kevin 2026".',
    'Camille & Sophie',
    'moyenne',
    '2026-06-15',
    'a_faire',
    4
),
(
    'f5555555-5555-4555-8555-555555555555',
    'Briefing des hôtesses d''accueil et test des scanners QR',
    'Vérifier que les tablettes iPad et smartphones du protocole ont l''application ouverte.',
    'Kevin & Protocole',
    'moyenne',
    '2026-06-19',
    'a_faire',
    5
)
ON CONFLICT (id) DO NOTHING;
