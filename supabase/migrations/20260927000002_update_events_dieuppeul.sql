-- ==============================================================================
-- MIGRATION : MISE À JOUR DU PROGRAMME OFFICIEL DU MARIAGE
-- SAMEDI 5 DÉCEMBRE 2026 & DIMANCHE 6 DÉCEMBRE 2026 (DAKAR, SÉNÉGAL)
-- ==============================================================================

-- 1. Nettoyage des événements précédents
DELETE FROM events WHERE id IN (
  'e1111111-1111-1111-1111-111111111111',
  'e2222222-2222-2222-2222-222222222222',
  'e3333333-3333-3333-3333-333333333333',
  'e4444444-4444-4444-4444-444444444444'
);

-- 2. Insertion des 3 événements officiels du mariage de Radène & Kévin
INSERT INTO events (id, nom, date_heure, lieu, adresse, coordonnees_gps, description, dress_code, icone, ordre)
VALUES
  (
    'e1111111-1111-1111-1111-111111111111',
    'Bénédiction nuptiale',
    '2026-12-05T11:00:00+00:00',
    'Eglise Protestante du Sénégal, Paroisse de Dieuppeul',
    'PG8V+XWQ, Dakar',
    '{"lat": 14.7174, "lng": -17.4552, "maps_url": "https://maps.google.com/?q=PG8V%2BXWQ%2C+Dakar"}'::jsonb,
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
    'PG5R+GC, Dakar',
    '{"lat": 14.7088, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=PG5R%2BGC%2C+Dakar"}'::jsonb,
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
    'PG8V+XWQ, Dakar',
    '{"lat": 14.7174, "lng": -17.4552, "maps_url": "https://maps.google.com/?q=PG8V%2BXWQ%2C+Dakar"}'::jsonb,
    'Culte d’action de grâce pour rendre gloire à Dieu pour cette sainte union, suivi de moments fraternels de partage et de convivialité.',
    'Chic & Décontracté',
    'sun',
    3
  );
