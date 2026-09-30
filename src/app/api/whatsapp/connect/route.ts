import { NextResponse } from 'next/server';
import { initWhatsAppSocket, getCurrentWhatsAppStatus } from '@/lib/whatsapp/baileys-service';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const current = getCurrentWhatsAppStatus();
    if (current.status === 'connected') {
      return NextResponse.json({
        success: true,
        message: 'WhatsApp est déjà connecté.',
        ...current,
      });
    }

    // Launch connection asynchronously
    initWhatsAppSocket().catch((err) => {
      console.error('Error starting WhatsApp socket:', err);
    });

    // Wait up to 3 seconds for QR code or connected status to be ready
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 200));
      const s = getCurrentWhatsAppStatus();
      if (s.qrCode || s.status === 'connected' || s.error) {
        break;
      }
    }

    const updated = getCurrentWhatsAppStatus();

    return NextResponse.json({
      success: true,
      message: 'Initialisation de la session WhatsApp...',
      ...updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Impossible de démarrer la session WhatsApp',
      },
      { status: 500 }
    );
  }
}
