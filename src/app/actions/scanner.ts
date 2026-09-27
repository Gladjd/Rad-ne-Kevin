'use server';

import { createClient } from '@supabase/supabase-js';
import { GuestItem, TableItem } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

function getSupabaseServerClient() {
  if (!supabaseUrl.startsWith('https://')) return null;
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
}

export interface CheckInResult {
  success: boolean;
  status: 'SUCCESS' | 'ALREADY_CHECKED_IN' | 'NOT_FOUND' | 'DECLINED' | 'ERROR';
  message: string;
  guest?: GuestItem;
  table?: TableItem | null;
}

/**
 * Server Action : Pointage automatique de l'invité au Jour J via son QR Code
 */
export async function checkInGuestAction(
  qrCodeUid: string,
  protocolName: string = 'Protocole Scanner'
): Promise<CheckInResult> {
  const cleanCode = qrCodeUid.trim().toUpperCase();

  if (!cleanCode) {
    return {
      success: false,
      status: 'NOT_FOUND',
      message: 'Code QR invalide ou vide.',
    };
  }

  const supabase = getSupabaseServerClient();

  // If Supabase is not reachable, client-side fallback store handles it
  if (!supabase) {
    return {
      success: false,
      status: 'ERROR',
      message: 'Base de données Supabase non connectée côté serveur.',
    };
  }

  try {
    // 1. Rechercher l'invité par son code QR UID ou ID
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .or(`qr_code_uid.ilike.${cleanCode},id.eq.${cleanCode}`)
      .maybeSingle();

    if (guestError || !guestData) {
      return {
        success: false,
        status: 'NOT_FOUND',
        message: `Aucun invité trouvé pour le code « ${cleanCode} ».`,
      };
    }

    const guest = guestData as GuestItem;

    // 2. Vérifier si l'invité avait décliné l'invitation
    if (guest.statut_rsvp === 'decline') {
      return {
        success: false,
        status: 'DECLINED',
        message: `${guest.prenom} ${guest.nom} avait décliné l'invitation (RSVP Décliné).`,
        guest,
      };
    }

    // 3. Récupérer les informations de la table assignée
    let table: TableItem | null = null;
    if (guest.table_id) {
      const { data: tableData } = await supabase
        .from('tables')
        .select('*')
        .eq('id', guest.table_id)
        .maybeSingle();

      if (tableData) {
        table = tableData as TableItem;
      }
    }

    // 4. Vérifier si l'invité a déjà été pointé
    const wasAlreadyCheckedIn = Boolean(guest.checked_in);
    const checkInTime = new Date().toISOString();

    // 5. Effectuer la mise à jour (UPDATE checked_in = true)
    const { error: updateError } = await supabase
      .from('guests')
      .update({
        checked_in: true,
        checked_in_at: wasAlreadyCheckedIn ? guest.checked_in_at : checkInTime,
        checked_in_by: protocolName,
        updated_at: checkInTime,
      })
      .eq('id', guest.id);

    if (updateError) {
      console.error('Erreur lors du pointage Supabase:', updateError);
      return {
        success: false,
        status: 'ERROR',
        message: 'Erreur lors de la mise à jour du pointage en base de données.',
        guest,
        table,
      };
    }

    const updatedGuest: GuestItem = {
      ...guest,
      checked_in: true,
      checked_in_at: wasAlreadyCheckedIn ? guest.checked_in_at : checkInTime,
      checked_in_by: protocolName,
    };

    if (wasAlreadyCheckedIn) {
      return {
        success: true,
        status: 'ALREADY_CHECKED_IN',
        message: `Invité déjà pointé précédemment (${guest.checked_in_at ? new Date(guest.checked_in_at).toLocaleTimeString('fr-FR') : 'Aujourd\'hui'}).`,
        guest: updatedGuest,
        table,
      };
    }

    return {
      success: true,
      status: 'SUCCESS',
      message: `Bienvenue ${guest.prenom} ${guest.nom} ! Pointage validé avec succès.`,
      guest: updatedGuest,
      table,
    };
  } catch (error: any) {
    console.error('CheckIn Action Exception:', error);
    return {
      success: false,
      status: 'ERROR',
      message: error?.message || 'Erreur inattendue lors du scan QR.',
    };
  }
}
