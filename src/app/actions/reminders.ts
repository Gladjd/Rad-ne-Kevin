'use server';

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import twilio from 'twilio';
import { GuestItem, ReminderLogItem } from '@/lib/database.types';
import { generateUUID } from '@/lib/supabase/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

const resendApiKey = process.env.RESEND_API_KEY || '';
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'mariage@radene-kevin.com';

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '';

function getSupabaseServerClient() {
  if (!supabaseUrl.startsWith('https://')) return null;
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
}

export interface SendRemindersParams {
  guestIds: string[];
  channel: 'email' | 'sms';
}

export interface SendRemindersResult {
  success: boolean;
  count: number;
  message: string;
  logs: ReminderLogItem[];
}

/**
 * Server Action : Envoi de relances par lot (Email via Resend / SMS via Twilio)
 */
export async function sendBatchRemindersAction(
  params: SendRemindersParams
): Promise<SendRemindersResult> {
  const { guestIds, channel } = params;

  if (!guestIds || guestIds.length === 0) {
    return {
      success: false,
      count: 0,
      message: 'Aucun invité sélectionné pour la relance.',
      logs: [],
    };
  }

  const supabase = getSupabaseServerClient();
  const createdLogs: ReminderLogItem[] = [];

  // Clients API
  const hasResend = Boolean(resendApiKey && !resendApiKey.startsWith('re_123456'));
  const resendClient = hasResend ? new Resend(resendApiKey) : null;

  const hasTwilio = Boolean(
    twilioAccountSid &&
    !twilioAccountSid.startsWith('AC1234567890') &&
    twilioAuthToken &&
    twilioPhoneNumber
  );
  const twilioClient = hasTwilio ? twilio(twilioAccountSid, twilioAuthToken) : null;

  try {
    // Récupérer les invités concernés
    let guests: GuestItem[] = [];
    if (supabase) {
      const { data } = await supabase.from('guests').select('*').in('id', guestIds);
      if (data) guests = data as GuestItem[];
    }

    for (const guestId of guestIds) {
      const guest = guests.find((g) => g.id === guestId);
      const guestName = guest ? `${guest.prenom} ${guest.nom}` : `Invité (${guestId.slice(0, 8)})`;
      const guestEmail = guest?.email;
      const guestPhone = guest?.telephone;
      const qrCode = guest?.qr_code_uid || 'RK-2026';
      const rsvpLink = `https://mariage-radene-kevin.com/#rsvp?code=${qrCode}`;

      let sendStatus: 'envoye' | 'echec' = 'envoye';
      let detailsMessage = '';

      if (channel === 'email') {
        if (!guestEmail) {
          sendStatus = 'echec';
          detailsMessage = `Échec email : Adresse email manquante pour ${guestName}`;
        } else if (resendClient) {
          try {
            await resendClient.emails.send({
              from: `Mariage Radene & Kevin <${resendFromEmail}>`,
              to: [guestEmail],
              subject: `✨ Radene & Kevin — Votre réponse souhaitée pour le 5 Décembre 2026 🥂`,
              html: `
                <div style="font-family: 'Georgia', serif; background-color: #FDFBF7; padding: 36px 16px; color: #271C0B; margin: 0;">
                  <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 36px 28px; border: 1px solid #E8D8BF; box-shadow: 0 10px 30px rgba(184,147,85,0.15); text-align: center;">
                    <div style="font-size: 12px; letter-spacing: 3px; color: #B89355; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">
                      MARIAGE DE
                    </div>
                    <h1 style="font-size: 38px; color: #B89355; margin: 0 0 10px 0; font-weight: normal; font-family: 'Georgia', serif;">
                      Radene &amp; Kevin
                    </h1>
                    <p style="text-transform: uppercase; font-size: 11px; letter-spacing: 2px; color: #7E5E2E; margin-bottom: 24px;">
                      Samedi 5 D&eacute;cembre 2026 &bull; Dakar, S&eacute;n&eacute;gal
                    </p>
                    
                    <h2 style="font-size: 20px; color: #271C0B; margin: 0 0 14px 0; font-weight: normal;">
                      Ch&egrave;re / Cher ${guest?.prenom || 'invité(e)'},
                    </h2>
                    <p style="font-size: 15px; line-height: 1.6; color: #443217; margin-bottom: 24px;">
                      Le grand jour approche &agrave; grands pas ! Nous finalisons les pr&eacute;paratifs pour notre c&eacute;l&eacute;bration. Nous serions tr&egrave;s honor&eacute;s de vous compter parmi nous.
                    </p>

                    <div style="background-color: #FAF7F0; border-radius: 16px; padding: 20px; margin-bottom: 28px; border: 1px dashed #CAAB79;">
                      <p style="font-size: 12px; font-weight: bold; color: #604722; margin: 0 0 8px 0; letter-spacing: 1px;">
                        VOTRE CODE INVITATION
                      </p>
                      <p style="font-size: 24px; font-family: monospace; font-weight: bold; color: #9C793F; letter-spacing: 4px; margin: 0;">
                        ${qrCode}
                      </p>
                    </div>

                    <a href="${rsvpLink}" style="display: inline-block; background: linear-gradient(135deg, #CAAB79 0%, #B89355 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 13px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(184,147,85,0.35);">
                      Confirmer ma pr&eacute;sence (RSVP)
                    </a>

                    <p style="font-size: 12px; color: #8D4739; margin-top: 32px; font-style: italic;">
                      Avec toute notre tendresse et notre affection,<br>
                      <strong>Radene &amp; Kevin</strong>
                    </p>
                  </div>
                </div>
              `,
            });
            detailsMessage = `Email Resend envoyé avec succès à ${guestEmail}`;
          } catch (e: any) {
            sendStatus = 'echec';
            detailsMessage = `Erreur Resend: ${e?.message || 'Échec d\'envoi'}`;
          }
        } else {
          // Simulation / Fallback
          detailsMessage = `Relance Email simulée envoyée à ${guestName} (${guestEmail || 'email par défaut'})`;
        }
      } else {
        // SMS Channel
        if (!guestPhone) {
          sendStatus = 'echec';
          detailsMessage = `Échec SMS : Numéro de téléphone manquant pour ${guestName}`;
        } else if (twilioClient) {
          try {
            await twilioClient.messages.create({
              body: `Mariage Radene & Kevin : Bonjour ${guest?.prenom || ''} ! Nous finalisons les préparatifs pour le 5 Décembre 2026 à Dakar. Merci de nous confirmer votre présence : ${rsvpLink} 💍`,
              from: twilioPhoneNumber,
              to: guestPhone,
            });
            detailsMessage = `SMS Twilio envoyé avec succès au ${guestPhone}`;
          } catch (e: any) {
            sendStatus = 'echec';
            detailsMessage = `Erreur Twilio: ${e?.message || 'Échec SMS'}`;
          }
        } else {
          // Simulation / Fallback
          detailsMessage = `Relance SMS simulée envoyée à ${guestName} (${guestPhone || 'téléphone'})`;
        }
      }

      // 3. Logger dans reminders_log
      const logRecord: ReminderLogItem = {
        id: generateUUID(),
        guest_id: guestId,
        guest_name: guestName,
        channel,
        status: sendStatus,
        details: detailsMessage,
        sent_at: new Date().toISOString(),
      };

      createdLogs.push(logRecord);

      if (supabase) {
        try {
          await supabase.from('reminders_log').insert(logRecord as any);
        } catch (err) {
          console.warn('Erreur insertion reminders_log:', err);
        }
      }
    }

    return {
      success: true,
      count: createdLogs.length,
      message: `${createdLogs.filter((l) => l.status === 'envoye').length} relance(s) ${channel.toUpperCase()} traitée(s).`,
      logs: createdLogs,
    };
  } catch (error: any) {
    console.error('Batch Reminders Exception:', error);
    return {
      success: false,
      count: 0,
      message: error?.message || 'Erreur lors du traitement des relances.',
      logs: createdLogs,
    };
  }
}
