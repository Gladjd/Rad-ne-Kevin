'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ReminderSenderModal } from '@/components/admin/ReminderSenderModal';

export default function AdminRelancesPage() {
  return (
    <div>
      <AdminHeader
        title="Relances Automatiques Email & SMS"
        subtitle="Rappels automatiques via Resend & Twilio / Supabase Edge Functions pour les invités en attente."
      />
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <ReminderSenderModal />
      </div>
    </div>
  );
}
