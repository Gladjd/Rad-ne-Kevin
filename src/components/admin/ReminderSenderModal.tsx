'use client';

import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { weddingStore } from '@/lib/supabase/client';
import { GuestItem, ReminderLogItem } from '@/lib/database.types';
import { formatDate } from '@/lib/utils';

import { sendBatchRemindersAction } from '@/app/actions/reminders';

export const ReminderSenderModal: React.FC = () => {
  const [pendingGuests, setPendingGuests] = useState<GuestItem[]>([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<'email' | 'sms'>('email');
  const [reminderLogs, setReminderLogs] = useState<ReminderLogItem[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Template preview
  const emailTemplate = `Objet : Mariage de Radène & Kévin - Votre réponse souhaitée pour le 5 Décembre 2026 🥂

Chère/Cher {Prénom},

Le grand jour approche à grands pas ! Nous finalisons les préparatifs pour notre célébration à l'Eglise Protestante de Dieuppeul (11h00) et la soirée de gala à la salle Fun Time (20h00) le Samedi 5 Décembre 2026.

Pourriez-vous prendre un court instant pour confirmer votre présence et vos accompagnants ?

👉 Confirmez votre venue ici : https://radene-kevin.com/#rsvp?code={Code}

Avec toute notre affection,
Radène & Kévin`;

  const smsTemplate = `Mariage Radène & Kévin : Bonjour {Prénom} ! Nous finalisons les préparatifs pour le 5 Décembre 2026 à Dakar. Merci de nous confirmer votre présence : https://radene-kevin.com/#rsvp 💍`;

  const loadData = async () => {
    const [allGuests, logs] = await Promise.all([
      weddingStore.getGuests(),
      weddingStore.getReminders(),
    ]);
    const pending = allGuests.filter((g) => g.statut_rsvp === 'en_attente');
    setPendingGuests(pending);
    setReminderLogs(logs);
    // Select all by default
    setSelectedGuestIds(new Set(pending.map((g) => g.id)));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('wedding_data_changed', loadData);
    return () => window.removeEventListener('wedding_data_changed', loadData);
  }, []);

  const toggleSelectGuest = (id: string) => {
    const next = new Set(selectedGuestIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedGuestIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedGuestIds.size === pendingGuests.length) {
      setSelectedGuestIds(new Set());
    } else {
      setSelectedGuestIds(new Set(pendingGuests.map((g) => g.id)));
    }
  };

  const handleSendBatch = async () => {
    if (selectedGuestIds.size === 0) return;
    setIsSending(true);
    setSuccessMessage(null);

    try {
      const ids = Array.from(selectedGuestIds);

      // 1. Déclencher l'envoi via la Server Action Next.js 14 (Resend + Twilio)
      const actionRes = await sendBatchRemindersAction({
        guestIds: ids,
        channel,
      });

      // 2. Synchronisation locale de secours
      const selectedList = pendingGuests.filter((g) => selectedGuestIds.has(g.id));
      for (const guest of selectedList) {
        await weddingStore.sendReminder(guest.id, channel, `${guest.prenom} ${guest.nom}`);
      }

      setSuccessMessage(
        actionRes.message || `${selectedList.length} relance(s) ${channel.toUpperCase()} envoyée(s) avec succès !`
      );
      loadData();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Erreur lors de l\'envoi des relances:', err);
      setSuccessMessage('Relances traitées.');
      loadData();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Controls */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gold-200/60 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Mail className="w-5 h-5 text-gold-600" />
            <span>Relances Automatisées des Invités (Email / SMS)</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Envoyez en un clic un rappel élégant à tous les invités dont le statut RSVP est toujours « En Attente ».
          </p>
        </div>

        {/* Channel Selection Buttons */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setChannel('email')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              channel === 'email' ? 'bg-gold-500 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email (Resend API)</span>
          </button>

          <button
            onClick={() => setChannel('sms')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              channel === 'sms' ? 'bg-gold-500 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>SMS (Twilio API)</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. Grid (Pending Guests Checklist & Template Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pending Guests Checklist (6 cols) */}
        <div className="lg:col-span-6 glass-card-gold rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gold-200/60 pb-3">
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Destinataires en Attente ({pendingGuests.length})
              </h3>
              <span className="text-[11px] text-zinc-400">
                {selectedGuestIds.size} invité(s) sélectionné(s)
              </span>
            </div>

            <button
              onClick={toggleSelectAll}
              className="text-xs font-semibold text-gold-700 hover:underline"
            >
              {selectedGuestIds.size === pendingGuests.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>

          {pendingGuests.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              🎉 Aucun invité en attente ! Toutes les invitations ont reçu une réponse.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {pendingGuests.map((g) => (
                <label
                  key={g.id}
                  className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 flex items-center justify-between gap-3 text-xs cursor-pointer hover:border-gold-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedGuestIds.has(g.id)}
                      onChange={() => toggleSelectGuest(g.id)}
                      className="rounded text-gold-600 focus:ring-gold-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                        {g.prenom} {g.nom}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {channel === 'email' ? g.email || 'Email manquant ⚠️' : g.telephone || 'Tél manquant ⚠️'}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] text-gold-700 font-bold bg-gold-50 px-2 py-0.5 rounded">
                    {g.qr_code_uid}
                  </span>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleSendBatch}
            disabled={isSending || selectedGuestIds.size === 0}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white font-semibold text-xs uppercase tracking-widest shadow-gold hover:shadow-gold-glow transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>
              {isSending
                ? 'Envoi en cours...'
                : `Envoyer ${selectedGuestIds.size} Relance(s) ${channel.toUpperCase()}`}
            </span>
          </button>
        </div>

        {/* Template Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card-gold rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-serif-luxury text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>Aperçu du Message ({channel.toUpperCase()})</span>
            </h3>

            <div className="p-4 rounded-2xl bg-zinc-900 text-zinc-200 font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner border border-zinc-800">
              {channel === 'email' ? emailTemplate : smsTemplate}
            </div>

            <p className="text-[11px] text-zinc-400 italic">
              Les balises {'{Prénom}'} et {'{Code}'} seront automatiquement remplacées pour chaque invité.
            </p>
          </div>

          {/* Logs History */}
          <div className="glass-card-gold rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-serif-luxury text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-600" />
              <span>Historique des Dernières Relances</span>
            </h3>

            {reminderLogs.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-400">
                Aucune relance envoyée pour le moment.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {reminderLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                        {log.details || `Relance ${log.channel.toUpperCase()}`}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {formatDate(log.sent_at, 'full')}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
