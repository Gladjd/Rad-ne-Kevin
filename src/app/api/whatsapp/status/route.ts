import { NextResponse } from 'next/server';
import { getCurrentWhatsAppStatus, initWhatsAppSocket } from '@/lib/whatsapp/baileys-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = getCurrentWhatsAppStatus();

    // If disconnected and not connecting, we don't automatically trigger connect, but report status
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: 'disconnected',
        error: error?.message || 'Erreur lors de la récupération du statut WhatsApp',
      },
      { status: 500 }
    );
  }
}
