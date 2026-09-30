import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  fetchLatestBaileysVersion,
  proto,
} from '@whiskeysockets/baileys';
import pino from 'pino';
import path from 'path';
import fs from 'fs';

export interface WhatsAppStatus {
  status: 'disconnected' | 'connecting' | 'qr_ready' | 'connected';
  qrCode: string | null;
  user: {
    id: string;
    name?: string;
  } | null;
  lastUpdate: string;
  error?: string | null;
}

// Global container to persist Baileys instance in Next.js development and server processes
declare global {
  var __whatsapp_sock: WASocket | null;
  var __whatsapp_status: WhatsAppStatus | null;
  var __whatsapp_connecting: boolean;
}

const AUTH_DIR = path.resolve(process.cwd(), '.wweb_auth');

export function getAuthDir(): string {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
  return AUTH_DIR;
}

export function getCurrentWhatsAppStatus(): WhatsAppStatus {
  if (!global.__whatsapp_status) {
    global.__whatsapp_status = {
      status: 'disconnected',
      qrCode: null,
      user: null,
      lastUpdate: new Date().toISOString(),
    };
  }
  return global.__whatsapp_status;
}

export function setWhatsAppStatus(update: Partial<WhatsAppStatus>) {
  const current = getCurrentWhatsAppStatus();
  global.__whatsapp_status = {
    ...current,
    ...update,
    lastUpdate: new Date().toISOString(),
  };
}

export async function initWhatsAppSocket(): Promise<WASocket> {
  if (global.__whatsapp_sock && global.__whatsapp_status?.status === 'connected') {
    return global.__whatsapp_sock;
  }

  if (global.__whatsapp_connecting) {
    if (global.__whatsapp_sock) return global.__whatsapp_sock;
  }

  global.__whatsapp_connecting = true;
  setWhatsAppStatus({ status: 'connecting', error: null });

  try {
    const authDir = getAuthDir();
    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307] as [number, number, number] }));

    const logger = pino({ level: 'silent' });

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      logger,
      browser: ['Radène & Kévin Mariage', 'Chrome', '1.0.0'],
      syncFullHistory: false,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 25000,
      generateHighQualityLinkPreview: true,
    });

    global.__whatsapp_sock = sock;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        setWhatsAppStatus({
          status: 'qr_ready',
          qrCode: qr,
          error: null,
        });
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log('WhatsApp connection closed, reason statusCode:', statusCode, 'shouldReconnect:', shouldReconnect);

        global.__whatsapp_sock = null;
        global.__whatsapp_connecting = false;

        if (statusCode === DisconnectReason.loggedOut) {
          // Clean session files
          try {
            if (fs.existsSync(authDir)) {
              fs.rmSync(authDir, { recursive: true, force: true });
            }
          } catch (e) {
            console.error('Error cleaning auth dir:', e);
          }
          setWhatsAppStatus({
            status: 'disconnected',
            qrCode: null,
            user: null,
            error: 'Session WhatsApp déconnectée. Veuillez scanner à nouveau le QR Code.',
          });
        } else {
          setWhatsAppStatus({
            status: 'disconnected',
            qrCode: null,
            error: (lastDisconnect?.error as any)?.message || 'Connexion interrompue.',
          });
        }
      } else if (connection === 'open') {
        global.__whatsapp_connecting = false;
        const user = sock.user;
        console.log('WhatsApp connection opened for user:', user);
        setWhatsAppStatus({
          status: 'connected',
          qrCode: null,
          user: {
            id: user?.id || '',
            name: user?.name || user?.notify || 'Numéro WhatsApp',
          },
          error: null,
        });
      }
    });

    return sock;
  } catch (error: any) {
    global.__whatsapp_connecting = false;
    global.__whatsapp_sock = null;
    setWhatsAppStatus({
      status: 'disconnected',
      qrCode: null,
      error: error?.message || 'Erreur lors de l’initialisation de WhatsApp.',
    });
    throw error;
  }
}

export async function disconnectWhatsApp(): Promise<void> {
  try {
    if (global.__whatsapp_sock) {
      await global.__whatsapp_sock.logout().catch(() => {});
      global.__whatsapp_sock.end(undefined);
      global.__whatsapp_sock = null;
    }
  } catch (e) {
    console.error('Error disconnecting whatsapp socket:', e);
  } finally {
    global.__whatsapp_sock = null;
    global.__whatsapp_connecting = false;
    const authDir = getAuthDir();
    try {
      if (fs.existsSync(authDir)) {
        fs.rmSync(authDir, { recursive: true, force: true });
      }
    } catch (e) {
      console.error('Error deleting auth dir:', e);
    }
    setWhatsAppStatus({
      status: 'disconnected',
      qrCode: null,
      user: null,
      error: null,
    });
  }
}

export function formatPhoneForWhatsApp(phone: string): string {
  let clean = phone.replace(/[^\d]/g, '');
  if (clean.startsWith('00')) clean = clean.slice(2);
  return clean;
}

export async function sendWhatsAppMessage(
  phoneNumber: string,
  messageText: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const currentStatus = getCurrentWhatsAppStatus();
  if (currentStatus.status !== 'connected' || !global.__whatsapp_sock) {
    return {
      success: false,
      error: 'WhatsApp n’est pas connecté. Veuillez d’abord scanner le QR Code.',
    };
  }

  const cleanPhone = formatPhoneForWhatsApp(phoneNumber);
  if (!cleanPhone || cleanPhone.length < 8) {
    return {
      success: false,
      error: `Numéro de téléphone invalide : ${phoneNumber}`,
    };
  }

  const jid = `${cleanPhone}@s.whatsapp.net`;

  try {
    const sock = global.__whatsapp_sock;
    const sentMsg = await sock.sendMessage(jid, { text: messageText });
    return {
      success: true,
      messageId: sentMsg?.key?.id || undefined,
    };
  } catch (error: any) {
    console.error(`Failed to send WhatsApp message to ${jid}:`, error);
    return {
      success: false,
      error: error?.message || 'Erreur lors de l’envoi WhatsApp',
    };
  }
}

export function formatInvitationMessage(
  template: string,
  guest: {
    prenom: string;
    nom: string;
    qr_code_uid: string;
    message_maries?: string | null;
  },
  baseUrl = 'https://radene-kevin.com'
): string {
  const code = guest.qr_code_uid;
  const link = `${baseUrl}/#rsvp?code=${encodeURIComponent(code)}`;
  const provenance = guest.message_maries?.replace(/^Provenance:\s*/i, '') || 'Dakar';

  return template
    .replace(/\{Prénom\}|\{prenom\}|\{PRENOM\}/g, guest.prenom)
    .replace(/\{Nom\}|\{nom\}|\{NOM\}/g, guest.nom)
    .replace(/\{Code\}|\{code\}|\{CODE\}/g, code)
    .replace(/\{Lien\}|\{lien\}|\{LIEN\}/g, link)
    .replace(/\{Provenance\}|\{provenance\}/g, provenance);
}
