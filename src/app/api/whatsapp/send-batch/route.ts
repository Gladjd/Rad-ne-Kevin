import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, formatInvitationMessage, getCurrentWhatsAppStatus } from '@/lib/whatsapp/baileys-service';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { INITIAL_GUESTS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const status = getCurrentWhatsAppStatus();
    if (status.status !== 'connected') {
      return NextResponse.json(
        {
          success: false,
          error: 'WhatsApp n’est pas connecté. Veuillez scanner le QR Code avant de lancer les envois.',
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { guestIds, template } = body;

    if (!Array.isArray(guestIds) || guestIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucun invité sélectionné' },
        { status: 400 }
      );
    }

    if (!template || typeof template !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Modèle de message manquant' },
        { status: 400 }
      );
    }

    // Fetch guest details from Supabase or fallback
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let guestsList: any[] = [];

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      });

      const { data } = await supabase.from('guests').select('*').in('id', guestIds);
      if (data && data.length > 0) {
        guestsList = data;
      }
    }

    if (guestsList.length === 0) {
      guestsList = INITIAL_GUESTS.filter((g) => guestIds.includes(g.id));
    }

    const origin = req.nextUrl.origin || 'https://radene-kevin.com';

    let successCount = 0;
    let failCount = 0;
    const errors: { guest: string; error: string }[] = [];

    for (let i = 0; i < guestsList.length; i++) {
      const guest = guestsList[i];

      if (!guest.telephone) {
        failCount++;
        errors.push({ guest: `${guest.prenom} ${guest.nom}`, error: 'Numéro de téléphone manquant' });
        continue;
      }

      const personalizedMessage = formatInvitationMessage(template, guest, origin);

      try {
        const sendResult = await sendWhatsAppMessage(guest.telephone, personalizedMessage);
        if (sendResult.success) {
          successCount++;
        } else {
          failCount++;
          errors.push({ guest: `${guest.prenom} ${guest.nom}`, error: sendResult.error || 'Erreur d’envoi' });
        }
      } catch (err: any) {
        failCount++;
        errors.push({ guest: `${guest.prenom} ${guest.nom}`, error: err?.message || 'Exception' });
      }

      // Small throttle interval (1.2s) between WhatsApp messages for anti-spam & delivery stability
      if (i < guestsList.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    }

    return NextResponse.json({
      success: true,
      total: guestsList.length,
      sent: successCount,
      failed: failCount,
      errors: errors.slice(0, 10), // return top errors
      message: `${successCount} invitation(s) WhatsApp envoyée(s) avec succès (${failCount} échec(s)).`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erreur interne lors de l’envoi groupé WhatsApp',
      },
      { status: 500 }
    );
  }
}
