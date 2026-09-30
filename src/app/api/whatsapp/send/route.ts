import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, formatInvitationMessage } from '@/lib/whatsapp/baileys-service';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guestId, phone, message, template, guest } = body;

    let targetPhone = phone;
    let messageContent = message;

    // If template and guest object provided, format dynamically
    if (template && guest) {
      targetPhone = guest.telephone;
      const origin = req.nextUrl.origin || 'https://radene-kevin.com';
      messageContent = formatInvitationMessage(template, guest, origin);
    }

    if (!targetPhone) {
      return NextResponse.json(
        { success: false, error: 'Numéro de téléphone manquant pour cet invité' },
        { status: 400 }
      );
    }

    if (!messageContent) {
      return NextResponse.json(
        { success: false, error: 'Contenu du message vide' },
        { status: 400 }
      );
    }

    const result = await sendWhatsAppMessage(targetPhone, messageContent);

    if (result.success) {
      // Log to Supabase reminders_log if guestId is present
      if (guestId) {
        try {
          const cookieStore = cookies();
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

          if (supabaseUrl && supabaseServiceKey) {
            const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
              cookies: {
                get(name: string) {
                  return cookieStore.get(name)?.value;
                },
              },
            });

            await supabase.from('reminders_log').insert({
              guest_id: guestId,
              channel: 'sms', // Using sms/whatsapp channel
              status: 'envoye',
              details: `Invitation WhatsApp envoyée au ${targetPhone}`,
            });
          }
        } catch (dbErr) {
          console.warn('Could not log reminder to database:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'Message WhatsApp envoyé avec succès !',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Échec de l’envoi WhatsApp' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erreur interne lors de l’envoi WhatsApp',
      },
      { status: 500 }
    );
  }
}
