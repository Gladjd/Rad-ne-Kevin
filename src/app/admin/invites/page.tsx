'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { GuestDataTable } from '@/components/admin/GuestDataTable';

export default function AdminInvitesPage() {
  return (
    <div>
      <AdminHeader
        title="Gestion Complète des Invités"
        subtitle="Suivi des statuts RSVP, choix des menus gastronomiques, régimes & export Excel/CSV."
      />
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <GuestDataTable />
      </div>
    </div>
  );
}
