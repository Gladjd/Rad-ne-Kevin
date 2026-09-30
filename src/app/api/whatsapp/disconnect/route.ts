import { NextResponse } from 'next/server';
import { disconnectWhatsApp } from '@/lib/whatsapp/baileys-service';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await disconnectWhatsApp();
    return NextResponse.json({
      success: true,
      message: 'Session WhatsApp déconnectée avec succès.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erreur lors de la déconnexion de WhatsApp',
      },
      { status: 500 }
    );
  }
}
