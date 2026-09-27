'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Utensils,
  Users,
  Search,
  RefreshCw,
  Sparkles,
  MapPin,
  Volume2,
} from 'lucide-react';
import { weddingStore } from '@/lib/supabase/client';
import { GuestItem, TableItem } from '@/lib/database.types';
import { triggerConfetti, formatDate } from '@/lib/utils';

export const QrScannerCamera: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<GuestItem | null>(null);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    weddingStore.getTables().then(setTables);
  }, []);

  const handleProcessCode = async (decodedText: string) => {
    const cleanCode = decodedText.trim();
    if (!cleanCode) return;

    try {
      const guest = await weddingStore.findGuestByQuery(cleanCode);
      if (guest) {
        setScannedResult(guest);
        // Automatically check-in
        const updated = await weddingStore.checkInGuest(guest.id, 'Protocole Scanner');
        if (updated) {
          setScannedResult(updated);
          setCheckInSuccess(true);
          triggerConfetti();
        }
      } else {
        alert(`Aucun invité trouvé pour le code : ${cleanCode}`);
      }
    } catch (err) {
      console.error('Error processing QR code', err);
    }
  };

  const startScanner = async () => {
    setCameraError(null);
    setScanning(true);
    setScannedResult(null);
    setCheckInSuccess(false);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader-container');
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleProcessCode(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // scanning frame error (ignore continuous scan logs)
        }
      );
    } catch (err: any) {
      console.error('Camera start failed', err);
      setCameraError('Accès caméra indisponible ou refusé. Vous pouvez utiliser la saisie manuelle.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.error('Error stopping camera', e);
      }
    }
    setScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessCode(manualCode);
    setManualCode('');
  };

  const getTable = (tableId?: string | null) => {
    if (!tableId) return null;
    return tables.find((t) => t.id === tableId) || null;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Scanner Card */}
      <div className="glass-card-gold rounded-3xl p-6 sm:p-8 shadow-gold text-center">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-gold-600" />
            <h2 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Scanner Caméra Jour J
            </h2>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Mode Accueil Direct</span>
          </span>
        </div>

        {/* Video Box Container */}
        <div className="relative rounded-3xl overflow-hidden bg-black/90 min-h-[280px] flex flex-col items-center justify-center p-4 border-2 border-gold-300">
          <div id="qr-reader-container" className="w-full max-w-[320px] rounded-2xl overflow-hidden" />

          {!scanning && (
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 mx-auto flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-sm text-zinc-300 font-medium">
                Pointez la caméra vers le QR Code de l'invité pour l'orienter instantanément.
              </p>
              <button
                type="button"
                onClick={startScanner}
                className="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest shadow-gold transition-colors"
              >
                Activer la Caméra
              </button>
            </div>
          )}

          {scanning && (
            <button
              type="button"
              onClick={stopScanner}
              className="mt-4 px-5 py-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white text-xs uppercase tracking-wider font-semibold"
            >
              Désactiver la Caméra
            </button>
          )}

          {cameraError && (
            <div className="absolute inset-0 bg-zinc-900/90 p-6 flex flex-col items-center justify-center text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <p className="text-xs text-zinc-200">{cameraError}</p>
              <button
                onClick={startScanner}
                className="text-xs text-gold-400 underline pt-2"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>

        {/* Manual Fallback Input */}
        <div className="mt-6 pt-4 border-t border-gold-200/60">
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Code ou Nom (ex: RK-A8F29 ou Dupont)..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-gold-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-700 text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors"
            >
              Valider
            </button>
          </form>
        </div>
      </div>

      {/* Result Card (When scanned) */}
      {scannedResult && (
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-zinc-900 border-2 border-gold-500 shadow-gold-glow animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-gold-200/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Pointage Confirmé • Bienvenue !
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-zinc-500">
              {scannedResult.qr_code_uid}
            </span>
          </div>

          <div className="py-6 text-center space-y-4">
            <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              {scannedResult.prenom} {scannedResult.nom}
            </h3>

            {/* Table Badge */}
            {scannedResult.table_id && getTable(scannedResult.table_id) ? (
              <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold">
                <span className="text-[10px] uppercase font-bold tracking-widest block opacity-90">
                  Orientation Table
                </span>
                <span className="font-serif-luxury text-2xl font-bold">
                  {getTable(scannedResult.table_id)?.nom_numero}
                </span>
                <span className="text-xs block opacity-90 mt-0.5">
                  Zone : {getTable(scannedResult.table_id)?.zone || 'Salle Principale'}
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold">
                Table non assignée
              </div>
            )}

            {/* Accompagnants details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200">
                <span className="font-bold block text-zinc-500 mb-1">Nombre d'entrées</span>
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {scannedResult.nombre_invites} personne{scannedResult.nombre_invites > 1 ? 's' : ''}
                </span>
                {scannedResult.accompagnants_json && scannedResult.accompagnants_json.length > 0 && (
                  <p className="text-zinc-500 mt-1">
                    Accompagnant(s) : {scannedResult.accompagnants_json.map((a) => `${a.prenom} ${a.nom}`).join(', ')}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200">
                <span className="font-bold block text-zinc-500 mb-1">Menu & Allergies</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {scannedResult.menu_choisi?.replace(/_/g, ' ') || 'Standard'}
                </span>
                {scannedResult.allergies && (
                  <p className="text-rose-600 font-bold mt-1">
                    ⚠️ Allergie : {scannedResult.allergies}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gold-200 flex justify-end">
            <button
              onClick={() => {
                setScannedResult(null);
                setCheckInSuccess(false);
                startScanner();
              }}
              className="px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-semibold"
            >
              Invité suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
