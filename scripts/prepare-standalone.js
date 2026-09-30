/**
 * Script de préparation Standalone pour Hostinger
 * Copie automatiquement les assets statiques et le dossier public dans .next/standalone
 */
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');

if (fs.existsSync(standaloneDir)) {
  console.log('📦 Préparation du build Standalone pour Hostinger...');
  
  // 1. Copier le dossier public
  copyDir(path.join(rootDir, 'public'), path.join(standaloneDir, 'public'));
  
  // 2. Copier le dossier .next/static
  copyDir(path.join(rootDir, '.next', 'static'), path.join(standaloneDir, '.next', 'static'));
  
  console.log('✅ Build Standalone prêt à être exécuté sur Hostinger (.next/standalone/server.js) !');
} else {
  console.log('ℹ️ Dossier .next/standalone introuvable. Assurez-vous d\'avoir exécuté "next build".');
}
