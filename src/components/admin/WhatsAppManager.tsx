'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  QrCode,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  LogOut,
  Sparkles,
  Search,
  Check,
  ExternalLink,
  Filter,
  MessageCircle,
  Copy,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { weddingStore } from '@/lib/supabase/client';
import { GuestItem } from '@/lib/database.types';

export const DEFAULT_INVITATION_TEMPLATE = `✨ *FAIRE-PART & INVITATION ROYALE* ✨
💍 *MARIAGE DE RADÈNE & KÉVIN* 💍

Très chère / Très cher *{Prénom} {Nom}*,

C’est avec une immense joie et le cœur rempli de reconnaissance que nous vous convions à célébrer l'union sacrée de notre amour sous la bénédiction divine.

📅 *PROGRAMME OFFICIEL DES FESTIVITÉS :*

⛪ *1. Bénédiction Nuptiale*
• *Date & Heure :* Samedi 5 Décembre 2026 à 11h00
• *Lieu :* Église Protestante du Sénégal, Paroisse de Dieuppeul (PG8V+XWQ, Dakar)
• *Dress Code :* Élégance Royale (Blanc Pur, Or & Bleu Roi)

🥂 *2. Grande Soirée de Gala & Banquet*
• *Date & Heure :* Samedi 5 Décembre 2026 à 20h00
• *Lieu :* Salle de fête Fun Time (PG5R+GC, Dakar)
• *Dress Code :* Black Tie / Smoking & Robes Longues de Soirée

🕊️ *3. Culte d'Action de Grâce*
• *Date & Heure :* Dimanche 6 Décembre 2026 à 10h00
• *Lieu :* Église Protestante du Sénégal, Paroisse de Dieuppeul (Dakar)

---
🔑 *VOTRE CODE PERSONNEL D'INVITÉ :*
👉 *{Code}*

Pour nous aider dans l'organisation de ce grand jour, merci de bien vouloir confirmer votre présence (et vos accompagnants) en cliquant sur le lien ci-dessous :
🔗 *Confirmez votre présence ici :*
{Lien}

Dans la joie et l'impatience de partager ce moment béni et inoubliable à vos côtés.

Avec toute notre affection,
*Radène & Kévin* ✨`;

export const SHORT_INVITATION_TEMPLATE = `💍 *Mariage Radène & Kévin - 5 Décembre 2026 à Dakar*

Bonjour *{Prénom}* !

Nous avons le grand bonheur de vous inviter à célébrer notre mariage à Dakar :
⛪ *11h00 :* Bénédiction Nuptiale (Paroisse de Dieuppeul)
🥂 *20h00 :* Soirée de Gala (Salle Fun Time)

🔑 *Votre Code d'accès :* *{Code}*
🔗 *Confirmez votre présence en 1 clic :*
{Lien}

Avec toute notre affection,
*Radène & Kévin* ✨`;

export const WhatsAppManager: React.FC = () => {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'qr_ready' | 'connected'
  >('disconnected');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [connectedUser, setConnectedUser] = useState<{ id: string; name?: string } | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Template state
  const [template, setTemplate] = useState<string>(DEFAULT_INVITATION_TEMPLATE);
  const [copiedPreview, setCopiedPreview] = useState(false);

  // Guests & Selection
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Batch sending state
  const [isBatchSending, setIsBatchSending] = useState(false);
  const [sendProgress, setSendProgress] = useState<{ current: number; total: number; success: number; failed: number } | null>(null);
  const [sendResultAlert, setSendResultAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [individualSendStatus, setIndividualSendStatus] = useState<Record<string, 'idle' | 'sending' | 'sent' | 'error'>>({});

  // 1. Fetch initial status & guests
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/status');
      if (res.ok) {
        const data = await res.json();
        setConnectionStatus(data.status);
        setQrCodeData(data.qrCode || null);
        setConnectedUser(data.user || null);
        if (data.error) setConnectionError(data.error);
        else setConnectionError(null);
      }
    } catch (e) {
      console.warn('Error checking WhatsApp status:', e);
    }
  };

  const loadGuests = async () => {
    const list = await weddingStore.getGuests();
    setGuests(list);
    // Pre-select all guests with phone numbers by default
    const withPhone = list.filter((g) => g.telephone && g.telephone.trim().length > 5);
    setSelectedGuestIds(new Set(withPhone.map((g) => g.id)));
  };

  useEffect(() => {
    fetchStatus();
    loadGuests();
  }, []);

  // Polling for QR Code and Connection status when not yet connected
  useEffect(() => {
    if (connectionStatus === 'connected') return;

    const interval = setInterval(() => {
      fetchStatus();
    }, 2500);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  // Handle Connect / Refresh QR
  const handleConnect = async () => {
    setIsInitializing(true);
    setConnectionError(null);
    try {
      const res = await fetch('/api/whatsapp/connect', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setConnectionStatus(data.status);
        if (data.qrCode) setQrCodeData(data.qrCode);
        if (data.user) setConnectedUser(data.user);
      } else {
        setConnectionError(data.error || 'Échec de démarrage de la session.');
      }
    } catch (err: any) {
      setConnectionError(err?.message || 'Erreur de connexion au serveur.');
    } finally {
      setIsInitializing(false);
    }
  };

  // Handle Disconnect
  const handleDisconnect = async () => {
    if (!window.confirm('Voulez-vous vraiment déconnecter votre session WhatsApp ?')) return;
    try {
      await fetch('/api/whatsapp/disconnect', { method: 'POST' });
      setConnectionStatus('disconnected');
      setQrCodeData(null);
      setConnectedUser(null);
      setSendResultAlert({
        type: 'success',
        message: 'Session WhatsApp déconnectée avec succès.',
      });
      setTimeout(() => setSendResultAlert(null), 4000);
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  };

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        `${g.prenom} ${g.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.telephone && g.telephone.includes(searchQuery)) ||
        (g.qr_code_uid && g.qr_code_uid.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (g.message_maries && g.message_maries.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (filterStatus === 'pending') return g.statut_rsvp === 'en_attente';
      if (filterStatus === 'confirmed') return g.statut_rsvp === 'confirme';
      if (filterStatus === 'with_phone') return !!g.telephone && g.telephone.trim().length > 5;
      if (filterStatus === 'international') return g.navette_requise || g.hebergement_requis;

      return true;
    });
  }, [guests, searchQuery, filterStatus]);

  // Select / Deselect All
  const toggleSelectAll = () => {
    const visibleIds = filteredGuests.map((g) => g.id);
    const allSelected = visibleIds.every((id) => selectedGuestIds.has(id));

    const next = new Set(selectedGuestIds);
    if (allSelected) {
      visibleIds.forEach((id) => next.delete(id));
    } else {
      visibleIds.forEach((id) => next.add(id));
    }
    setSelectedGuestIds(next);
  };

  const toggleSelectGuest = (id: string) => {
    const next = new Set(selectedGuestIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedGuestIds(next);
  };

  // Format sample preview message
  const sampleGuest = guests[0] || {
    prenom: 'Antonin',
    nom: 'DOSSOU',
    qr_code_uid: 'RK-001',
    telephone: '+221 77 648 01 97',
    message_maries: 'Provenance: Dakar',
  };

  const previewMessage = useMemo(() => {
    const code = sampleGuest.qr_code_uid || 'RK-001';
    const link = `https://radene-kevin.com/#rsvp?code=${encodeURIComponent(code)}`;
    const provenance = sampleGuest.message_maries?.replace(/^Provenance:\s*/i, '') || 'Dakar';

    return template
      .replace(/\{Prénom\}|\{prenom\}|\{PRENOM\}/g, sampleGuest.prenom)
      .replace(/\{Nom\}|\{nom\}|\{NOM\}/g, sampleGuest.nom)
      .replace(/\{Code\}|\{code\}|\{CODE\}/g, code)
      .replace(/\{Lien\}|\{lien\}|\{LIEN\}/g, link)
      .replace(/\{Provenance\}|\{provenance\}/g, provenance);
  }, [template, sampleGuest]);

  // Generate 1-click Direct WhatsApp wa.me URL
  const getDirectWaMeUrl = (guest: GuestItem) => {
    if (!guest.telephone) return '#';
    let cleanPhone = guest.telephone.replace(/[^\d]/g, '');
    if (cleanPhone.startsWith('00')) cleanPhone = cleanPhone.slice(2);

    const code = guest.qr_code_uid;
    const link = `https://radene-kevin.com/#rsvp?code=${encodeURIComponent(code)}`;
    const provenance = guest.message_maries?.replace(/^Provenance:\s*/i, '') || 'Dakar';

    const msg = template
      .replace(/\{Prénom\}|\{prenom\}|\{PRENOM\}/g, guest.prenom)
      .replace(/\{Nom\}|\{nom\}|\{NOM\}/g, guest.nom)
      .replace(/\{Code\}|\{code\}|\{CODE\}/g, code)
      .replace(/\{Lien\}|\{lien\}|\{LIEN\}/g, link)
      .replace(/\{Provenance\}|\{provenance\}/g, provenance);

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Send Individual Message via Baileys API
  const handleSendSingle = async (guest: GuestItem) => {
    if (connectionStatus !== 'connected') {
      alert('Veuillez d’abord connecter votre WhatsApp en scannant le QR Code.');
      return;
    }

    if (!guest.telephone) {
      alert(`Numéro de téléphone manquant pour ${guest.prenom} ${guest.nom}`);
      return;
    }

    setIndividualSendStatus((prev) => ({ ...prev, [guest.id]: 'sending' }));

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: guest.id,
          phone: guest.telephone,
          template,
          guest,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIndividualSendStatus((prev) => ({ ...prev, [guest.id]: 'sent' }));
        weddingStore.sendReminder(guest.id, 'sms', `WhatsApp Faire-part envoyé à ${guest.prenom} ${guest.nom}`);
      } else {
        setIndividualSendStatus((prev) => ({ ...prev, [guest.id]: 'error' }));
        alert(`Erreur d'envoi à ${guest.prenom} : ${data.error}`);
      }
    } catch (err: any) {
      setIndividualSendStatus((prev) => ({ ...prev, [guest.id]: 'error' }));
      alert(`Erreur d'envoi : ${err?.message}`);
    }
  };

  // Send Batch via Baileys API
  const handleSendBatch = async () => {
    if (connectionStatus !== 'connected') {
      alert('Veuillez d’abord connecter votre WhatsApp en scannant le QR Code.');
      return;
    }

    const selectedIds = Array.from(selectedGuestIds);
    if (selectedIds.length === 0) {
      alert('Veuillez sélectionner au moins un invité.');
      return;
    }

    if (
      !window.confirm(
        `Confirmez-vous l'envoi du faire-part personnalisé à ${selectedIds.length} invité(s) via votre WhatsApp connecté ?`
      )
    ) {
      return;
    }

    setIsBatchSending(true);
    setSendProgress({ current: 0, total: selectedIds.length, success: 0, failed: 0 });
    setSendResultAlert(null);

    try {
      const res = await fetch('/api/whatsapp/send-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestIds: selectedIds,
          template,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSendResultAlert({
          type: 'success',
          message: data.message || `Envoi terminé avec succès (${data.sent} réussis, ${data.failed} échecs).`,
        });
        // Mark all as sent in local state
        const updatedStatus: Record<string, 'sent'> = {};
        selectedIds.forEach((id) => (updatedStatus[id] = 'sent'));
        setIndividualSendStatus((prev) => ({ ...prev, ...updatedStatus }));
      } else {
        setSendResultAlert({
          type: 'error',
          message: data.error || 'Une erreur est survenue lors de l’envoi groupé.',
        });
      }
    } catch (err: any) {
      setSendResultAlert({
        type: 'error',
        message: err?.message || 'Erreur de communication avec le serveur WhatsApp.',
      });
    } finally {
      setIsBatchSending(false);
      setSendProgress(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2000);
  };

  const insertVariable = (variable: string) => {
    setTemplate((prev) => prev + ` {${variable}}`);
  };

  // Flag by Country
  const getCountryBadge = (phone?: string) => {
    if (!phone) return null;
    if (phone.includes('+221') || phone.startsWith('221') || phone.startsWith('00221')) return '🇸🇳 Sénégal';
    if (phone.includes('+242') || phone.startsWith('242') || phone.startsWith('00242')) return '🇨🇬 Congo';
    if (phone.includes('+33') || phone.startsWith('33') || phone.startsWith('0033')) return '🇫🇷 France';
    if (phone.includes('+229') || phone.startsWith('229') || phone.startsWith('00229')) return '🇧🇯 Bénin';
    if (phone.includes('+254') || phone.startsWith('254') || phone.startsWith('00254')) return '🇰🇪 Kenya';
    return '🌍 Int.';
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP STATUS & WHATSAPP WEB QR SCANNER CARD */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-gold-50/20 to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 border border-gold-200/80 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gold-200/60 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-sm">
                <MessageCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>Passerelle WhatsApp Web & Faire-Parts</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-400/30 font-sans font-medium">
                    1-Clic Direct
                  </span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Connectez votre compte WhatsApp par scan QR Code pour expédier automatiquement des invitations personnalisées avec QR Code UID.
                </p>
              </div>
            </div>
          </div>

          {/* Connection State Badge & Actions */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            {connectionStatus === 'connected' ? (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                    WhatsApp Connecté ✅
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {connectedUser?.name || connectedUser?.id || 'Session Active'}
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="ml-2 p-1.5 hover:bg-emerald-500/20 rounded-xl text-zinc-500 hover:text-red-500 transition-colors"
                  title="Déconnecter WhatsApp"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isInitializing || connectionStatus === 'connecting'}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-semibold text-xs uppercase tracking-widest shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isInitializing || connectionStatus === 'connecting' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>{connectionStatus === 'qr_ready' ? 'Actualiser le QR Code' : 'Connecter mon WhatsApp'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* QR Code Presentation Box (When in QR ready or connecting mode) */}
        {connectionStatus !== 'connected' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white dark:bg-zinc-800/80 p-6 rounded-3xl border border-gold-200/60 dark:border-zinc-700/60 shadow-inner">
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              {qrCodeData ? (
                <div className="p-3 bg-white rounded-2xl shadow-md flex flex-col items-center">
                  <QRCodeSVG
                    value={qrCodeData}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-zinc-500 font-medium animate-pulse">
                    <Zap className="w-3 h-3 text-gold-600" />
                    <span>Scannez avec WhatsApp</span>
                  </div>
                </div>
              ) : (
                <div className="w-52 h-52 flex flex-col items-center justify-center text-center p-4">
                  <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mb-3" />
                  <span className="text-xs text-zinc-500">
                    Cliquez sur « Connecter mon WhatsApp » pour afficher votre QR Code de connexion...
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-8 space-y-4">
              <h3 className="font-serif-luxury text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Instructions de connexion WhatsApp Web :</span>
              </h3>

              <ol className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-800 dark:text-gold-300 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Ouvrez <strong>WhatsApp</strong> sur votre téléphone mobile.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-800 dark:text-gold-300 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Accédez aux <strong>Réglages</strong> (sur iPhone) ou appuyez sur le <strong>Menu ⋮</strong> (sur Android) puis sélectionnez <strong>Appareils connectés</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-800 dark:text-gold-300 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Appuyez sur <strong>Connecter un appareil</strong> et scannez le QR Code affiché à gauche.
                  </span>
                </li>
              </ol>

              {connectionError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{connectionError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Connexion sécurisée de bout en bout directe sur votre téléphone.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {sendResultAlert && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in ${
            sendResultAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-red-50 text-red-900 border border-red-300'
          }`}
        >
          {sendResultAlert.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{sendResultAlert.message}</span>
        </div>
      )}

      {/* 2. TEMPLATE CUSTOMIZATION & LIVE MOBILE SIMULATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Template Editor (7 cols) */}
        <div className="lg:col-span-7 glass-card-gold rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-200/60 pb-3">
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span>Modèle de Faire-Part Personnalisé</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Personnalisez le texte avec les balises dynamiques insérées pour chaque invité.
              </p>
            </div>

            {/* Quick Templates Selector */}
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-[11px]">
              <button
                onClick={() => setTemplate(DEFAULT_INVITATION_TEMPLATE)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  template === DEFAULT_INVITATION_TEMPLATE
                    ? 'bg-gold-500 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-gold-600'
                }`}
              >
                Complet (Royal)
              </button>
              <button
                onClick={() => setTemplate(SHORT_INVITATION_TEMPLATE)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  template === SHORT_INVITATION_TEMPLATE
                    ? 'bg-gold-500 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-gold-600'
                }`}
              >
                Court (Express)
              </button>
            </div>
          </div>

          {/* Dynamic Tags Insertion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-zinc-500 mr-1">Balises :</span>
            {['Prénom', 'Nom', 'Code', 'Lien', 'Provenance'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => insertVariable(tag)}
                className="px-2.5 py-1 rounded-lg bg-gold-100/80 dark:bg-zinc-800 hover:bg-gold-200 dark:hover:bg-zinc-700 text-gold-900 dark:text-gold-300 font-mono text-[10px] font-bold border border-gold-300/60 dark:border-zinc-700 transition-colors"
                title={`Insérer {${tag}} dans le texte`}
              >
                +{`{${tag}}`}
              </button>
            ))}
          </div>

          {/* Text Area */}
          <div className="space-y-1.5">
            <textarea
              rows={14}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs font-mono leading-relaxed resize-y shadow-inner text-zinc-900 dark:text-zinc-100"
              placeholder="Saisissez le texte du faire-part WhatsApp..."
            />
            <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
              <span>{template.length} caractères</span>
              <button
                type="button"
                onClick={() => copyToClipboard(previewMessage)}
                className="text-gold-700 hover:underline flex items-center gap-1"
              >
                {copiedPreview ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPreview ? 'Copié !' : 'Copier l’aperçu'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Smartphone Simulation Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card-gold rounded-3xl p-6 shadow-sm">
            <h3 className="font-serif-luxury text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-gold-600" />
              <span>Aperçu sur WhatsApp (Exemple : {sampleGuest.prenom} {sampleGuest.nom})</span>
            </h3>

            {/* Smartphone Mockup */}
            <div className="bg-[#0b141a] p-3 rounded-[32px] border-4 border-zinc-800 shadow-2xl relative max-w-sm mx-auto overflow-hidden">
              {/* WhatsApp Header */}
              <div className="bg-[#202c33] px-3 py-2 rounded-t-2xl flex items-center gap-2.5 text-white mb-2">
                <div className="w-7 h-7 rounded-full bg-gold-600 text-white font-serif font-bold text-xs flex items-center justify-center">
                  RK
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold block truncate">Radène & Kévin</span>
                  <span className="text-[9px] text-emerald-400 block">en ligne</span>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="bg-[#005c4b] text-[#e9edef] p-3 rounded-2xl rounded-tr-xs text-[11px] leading-relaxed font-sans whitespace-pre-wrap max-h-96 overflow-y-auto shadow-md">
                {previewMessage}
                <div className="text-right text-[9px] text-[#8696a0] mt-1">11:45 ✓✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GUESTS LIST & 1-CLICK ACTIONS */}
      <div className="glass-card-gold rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-200/60 pb-4">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-gold-600" />
              <span>Liste des Invités & Envoi Groupé ({filteredGuests.length}/{guests.length})</span>
            </h3>
            <span className="text-xs text-zinc-400">
              {selectedGuestIds.size} invité(s) coché(s) pour l'envoi groupé
            </span>
          </div>

          {/* Bulk Send Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendBatch}
              disabled={isBatchSending || selectedGuestIds.size === 0 || connectionStatus !== 'connected'}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/40 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isBatchSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Envoi en cours ({sendProgress?.current || 0}/{sendProgress?.total || 0})...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Envoyer aux {selectedGuestIds.size} Invités Sélectionnés</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, numéro de téléphone, QR code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:ring-1 focus:ring-gold-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200"
            >
              <option value="all">Tous les invités ({guests.length})</option>
              <option value="with_phone">Avec téléphone ({guests.filter((g) => !!g.telephone).length})</option>
              <option value="pending">En attente RSVP ({guests.filter((g) => g.statut_rsvp === 'en_attente').length})</option>
              <option value="confirmed">Confirmés ({guests.filter((g) => g.statut_rsvp === 'confirme').length})</option>
              <option value="international">Internationaux (Navette/Hébergement)</option>
            </select>
          </div>

          <div className="sm:col-span-2 text-right">
            <button
              onClick={toggleSelectAll}
              className="text-xs font-semibold text-gold-700 hover:underline"
            >
              {filteredGuests.length > 0 && filteredGuests.every((g) => selectedGuestIds.has(g.id))
                ? 'Tout décocher'
                : 'Tout cocher'}
            </button>
          </div>
        </div>

        {/* Guests Table */}
        <div className="overflow-x-auto rounded-2xl border border-gold-200/60 dark:border-zinc-800 max-h-[500px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gold-50/80 dark:bg-zinc-800 sticky top-0 z-10 text-zinc-700 dark:text-zinc-300 font-serif border-b border-gold-200/60 dark:border-zinc-700">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredGuests.length > 0 && filteredGuests.every((g) => selectedGuestIds.has(g.id))}
                    onChange={toggleSelectAll}
                    className="rounded text-gold-600 focus:ring-gold-500 w-4 h-4"
                  />
                </th>
                <th className="p-3.5">Invité</th>
                <th className="p-3.5">Téléphone</th>
                <th className="p-3.5">Provenance</th>
                <th className="p-3.5">Code QR</th>
                <th className="p-3.5">Statut RSVP</th>
                <th className="p-3.5 text-right">Actions 1-Clic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400">
                    Aucun invité ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const isSelected = selectedGuestIds.has(guest.id);
                  const status = individualSendStatus[guest.id] || 'idle';
                  const country = getCountryBadge(guest.telephone);

                  return (
                    <tr
                      key={guest.id}
                      className={`hover:bg-gold-50/40 dark:hover:bg-zinc-800/50 transition-colors ${
                        isSelected ? 'bg-gold-50/20 dark:bg-zinc-800/30' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectGuest(guest.id)}
                          className="rounded text-gold-600 focus:ring-gold-500 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="p-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                        {guest.prenom} {guest.nom}
                      </td>

                      <td className="p-3.5 font-mono text-zinc-600 dark:text-zinc-300">
                        {guest.telephone ? (
                          <div className="flex items-center gap-1.5">
                            <span>{guest.telephone}</span>
                            {country && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-sans">
                                {country}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic">Non renseigné</span>
                        )}
                      </td>

                      <td className="p-3.5 text-zinc-500">
                        {guest.message_maries?.replace(/^Provenance:\s*/i, '') || 'Dakar'}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-gold-100 text-gold-800 dark:bg-zinc-800 dark:text-gold-300 font-mono text-[10px] font-bold">
                          {guest.qr_code_uid}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            guest.statut_rsvp === 'confirme'
                              ? 'bg-emerald-100 text-emerald-800'
                              : guest.statut_rsvp === 'decline'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {guest.statut_rsvp}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 1-Click Direct WhatsApp wa.me link */}
                          {guest.telephone && (
                            <a
                              href={getDirectWaMeUrl(guest)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 font-medium text-[11px] border border-emerald-300/60 flex items-center gap-1 transition-all"
                              title="Ouvrir directement dans WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Ouvrir wa.me</span>
                              <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                            </a>
                          )}

                          {/* Baileys Automatic Send Button */}
                          <button
                            onClick={() => handleSendSingle(guest)}
                            disabled={
                              !guest.telephone ||
                              connectionStatus !== 'connected' ||
                              status === 'sending'
                            }
                            className={`px-2.5 py-1 rounded-xl font-medium text-[11px] flex items-center gap-1 transition-all ${
                              status === 'sent'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gold-500 hover:bg-gold-600 text-white shadow-xs disabled:opacity-40'
                            }`}
                            title="Envoyer automatiquement via votre WhatsApp connecté"
                          >
                            {status === 'sending' ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : status === 'sent' ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                            <span>{status === 'sent' ? 'Envoyé' : 'Envoyer'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
