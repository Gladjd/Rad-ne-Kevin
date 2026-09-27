-- ==============================================================================
-- MIGRATION : MISE À JOUR DU PROGRAMME DU MARIAGE (PAROISSE DE DIEUPPEUL)
-- DATE DU MARIAGE : SAMEDI 5 DÉCEMBRE 2026
-- ==============================================================================

-- 1. Nettoyage des événements mockés précédents si existants
DELETE FROM events WHERE id IN (
  'e1111111-1111-1111-1111-111111111111',
  'e2222222-2222-2222-2222-222222222222',
  'e3333333-3333-3333-3333-333333333333',
  'e4444444-4444-4444-4444-444444444444'
);

-- 2. Insertion des événements officiels du mariage de Radène & Kévin
INSERT INTO events (id, nom, date_heure, lieu, adresse, coordonnees_gps, description, dress_code, icone, ordre)
VALUES
  (
    'e1111111-1111-1111-1111-111111111111',
    'Bénédiction Nuptiale & Sacrement de Mariage',
    '2026-12-05T15:00:00+00:00',
    'Paroisse Sainte-Thérèse de Dieuppeul',
    'Allées Ababacar Sy, Dieuppeul-Derklé, Dakar, Sénégal',
    '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Paroisse+Sainte+Therese+Dieuppeul+Dakar"}'::jsonb,
    'Célébration eucharistique solennelle et échange des consentements sacrés sous la bénédiction de Dieu et en présence de tous nos proches.',
    'Élégance Royale • Nuances Blanc Pur, Or & Bleu Roi',
    'heart',
    1
  ),
  (
    'e2222222-2222-2222-2222-222222222222',
    'Cocktail d’Honneur & Félicitations au Coucher du Soleil',
    '2026-12-05T17:30:00+00:00',
    'Jardins Royaux de Réception',
    'Dakar, Sénégal',
    '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Paroisse+Sainte+Therese+Dieuppeul+Dakar"}'::jsonb,
    'Coupes de champagne, bouchées gastronomiques raffinées et musique acoustique en live pour célébrer les nouveaux mariés.',
    'Chic Majestueux & Tenues Traditionnelles Raffinées',
    'wine',
    2
  ),
  (
    'e3333333-3333-3333-3333-333333333333',
    'Dîner de Gala & Ouverture du Bal Royal',
    '2026-12-05T20:30:00+00:00',
    'Grande Salle Royale des Célébrations',
    'Dakar, Sénégal',
    '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Paroisse+Sainte+Therese+Dieuppeul+Dakar"}'::jsonb,
    'Banquet d’exception 4 services, discours surprises émouvants des familles et témoins, cascade de pièces montées dorées et nuit dansante.',
    'Black Tie / Smoking & Robes Longues de Soirée',
    'sparkles',
    3
  ),
  (
    'e4444444-4444-4444-4444-444444444444',
    'Messe d’Action de Grâce & Brunch Convivial',
    '2026-12-06T12:00:00+00:00',
    'Résidence Privée & Espaces Détente',
    'Dakar, Sénégal',
    '{"lat": 14.7126, "lng": -17.4589, "maps_url": "https://maps.google.com/?q=Paroisse+Sainte+Therese+Dieuppeul+Dakar"}'::jsonb,
    'Action de grâce, buffet gourmand aux saveurs locales et internationales, rafraîchissements et partage de souvenirs.',
    'Garden Party Chic & Décontracté',
    'sun',
    4
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
