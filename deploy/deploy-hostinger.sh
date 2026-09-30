#!/bin/bash
# ==============================================================================
# SCRIPT DE DÉPLOIEMENT HOSTINGER - MARIAGE RADÈNE & KÉVIN
# ==============================================================================

set -e

echo "🚀 [1/4] Installation des dépendances..."
npm ci --production=false

echo "🔨 [2/4] Compilation du projet Next.js..."
npm run build

echo "📦 [3/4] Préparation du build Standalone..."
node scripts/prepare-standalone.js

echo "🔄 [4/4] Redémarrage du serveur..."
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
    echo "✅ Application rechargée avec succès via PM2 !"
else
    echo "ℹ️ PM2 non détecté. Lancez 'npm run start' ou 'node server.js'."
fi

echo "✨ Déploiement Hostinger terminé avec succès !"
