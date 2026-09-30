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

    // Short wait to capture initial QR if ready quickly
    await new Promise((r) => setTimeout(r, 1200));

    const updated = getCurrentWhatsAppStatus();

    return NextResponse.json({
      success: true,
      message: 'Initialisation de la session WhatsApp en cours...',
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
