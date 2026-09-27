'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus, Trash2 } from 'lucide-react';
import { GuestItem, TableItem, Accompagnant } from '@/lib/database.types';
import { generateQrUid } from '@/lib/utils';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guest: Partial<GuestItem>) => Promise<void>;
  guest?: GuestItem | null;
  tables: TableItem[];
}

export const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  guest,
  tables,
}) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [statutRsvp, setStatutRsvp] = useState<'en_attente' | 'confirme' | 'decline'>('en_attente');
  const [menuChoisi, setMenuChoisi] = useState('viande_boeuf_rossini');
  const [allergies, setAllergies] = useState('');
  const [tableId, setTableId] = useState<string>('');
  const [checkedIn, setCheckedIn] = useState(false);
  const [navetteRequise, setNavetteRequise] = useState(false);
  const [hebergementRequis, setHebergementRequis] = useState(false);
  const [accompagnants, setAccompagnants] = useState<Accompagnant[]>([]);
  const [messageMaries, setMessageMaries] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (guest) {
      setNom(guest.nom);
      setPrenom(guest.prenom);
      setEmail(guest.email || '');
      setTelephone(guest.telephone || '');
      setStatutRsvp(guest.statut_rsvp);
      setMenuChoisi(guest.menu_choisi || 'viande_boeuf_rossini');
      setAllergies(guest.allergies || '');
      setTableId(guest.table_id || '');
      setCheckedIn(guest.checked_in);
      setNavetteRequise(guest.navette_requise);
      setHebergementRequis(guest.hebergement_requis);
      setAccompagnants(guest.accompagnants_json || []);
      setMessageMaries(guest.message_maries || '');
    } else {
      setNom('');
      setPrenom('');
      setEmail('');
      setTelephone('');
      setStatutRsvp('en_attente');
      setMenuChoisi('viande_boeuf_rossini');
      setAllergies('');
      setTableId('');
      setCheckedIn(false);
      setNavetteRequise(false);
      setHebergementRequis(false);
      setAccompagnants([]);
      setMessageMaries('');
    }
  }, [guest, isOpen]);

  if (!isOpen) return null;

  const handleAddAccompagnant = () => {
    setAccompagnants([
      ...accompagnants,
      { nom: '', prenom: '', menu: 'viande_boeuf_rossini', allergies: '', age_category: 'adulte' },
    ]);
  };

  const handleRemoveAccompagnant = (index: number) => {
    setAccompagnants(accompagnants.filter((_, i) => i !== index));
  };

  const handleUpdateAccompagnant = (index: number, field: keyof Accompagnant, val: string) => {
    const next = [...accompagnants];
    next[index] = { ...next[index], [field]: val };
    setAccompagnants(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim()) return;

    setIsSaving(true);
    try {
      await onSave({
        id: guest?.id,
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim() || undefined,
        telephone: telephone.trim() || undefined,
        statut_rsvp: statutRsvp,
        menu_choisi: menuChoisi,
        allergies: allergies.trim() || undefined,
        table_id: tableId || null,
        checked_in: checkedIn,
        navette_requise: navetteRequise,
        hebergement_requis: hebergementRequis,
        accompagnants_json: accompagnants,
        message_maries: messageMaries.trim() || undefined,
        qr_code_uid: guest?.qr_code_uid || generateQrUid(),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-gold-300 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-serif-luxury text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {guest ? `Modifier : ${guest.prenom} ${guest.nom}` : 'Ajouter un Nouvel Invité'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Prénom *</label>
              <input
                type="text"
                required
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Téléphone</label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Statut RSVP</label>
              <select
                value={statutRsvp}
                onChange={(e) => setStatutRsvp(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 text-xs font-semibold"
              >
                <option value="en_attente">⏳ En attente</option>
                <option value="confirme">✅ Confirmé</option>
                <option value="decline">❌ Décliné</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Table Assignée</label>
              <select
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 text-xs"
              >
                <option value="">(Non assigné)</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nom_numero} ({t.capacite}p)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Menu Principal</label>
              <select
                value={menuChoisi}
                onChange={(e) => setMenuChoisi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 text-xs"
              >
                <option value="viande_boeuf_rossini">🥩 Bœuf Rossini</option>
                <option value="poisson_bar_sauvage">🐟 Bar Sauvage</option>
                <option value="vegetarien_truffe">🌱 Risotto Truffe</option>
                <option value="menu_enfant">🧒 Menu Enfant</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Allergies & Régimes</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Ex: Sans gluten, crustacés..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 text-xs"
            />
          </div>

          {/* Accompagnants */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                Accompagnants (+1) : {accompagnants.length}
              </span>
              <button
                type="button"
                onClick={handleAddAccompagnant}
                className="text-xs text-gold-700 font-semibold hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            {accompagnants.map((a, idx) => (
              <div key={idx} className="p-3 mb-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 flex items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={a.prenom}
                  onChange={(e) => handleUpdateAccompagnant(idx, 'prenom', e.target.value)}
                  className="flex-1 px-2 py-1 rounded bg-white dark:bg-zinc-900 border"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={a.nom}
                  onChange={(e) => handleUpdateAccompagnant(idx, 'nom', e.target.value)}
                  className="flex-1 px-2 py-1 rounded bg-white dark:bg-zinc-900 border"
                />
                <select
                  value={a.menu}
                  onChange={(e) => handleUpdateAccompagnant(idx, 'menu', e.target.value)}
                  className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border"
                >
                  <option value="viande_boeuf_rossini">🥩 Bœuf</option>
                  <option value="poisson_bar_sauvage">🐟 Poisson</option>
                  <option value="vegetarien_truffe">🌱 Végé</option>
                  <option value="menu_enfant">🧒 Enfant</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveAccompagnant(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedIn}
                onChange={(e) => setCheckedIn(e.target.checked)}
                className="rounded text-gold-600"
              />
              <span>Pointé au Jour J (Check-in)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={navetteRequise}
                onChange={(e) => setNavetteRequise(e.target.checked)}
                className="rounded text-gold-600"
              />
              <span>Navette requise</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-zinc-300 text-xs font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
