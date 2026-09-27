'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TablePlanCanvas } from '@/components/admin/TablePlanCanvas';

export default function AdminPlanDeTablePage() {
  return (
    <div>
      <AdminHeader
        title="Plan de Table 2D Vectoriel & Placement"
        subtitle="Agencement dynamique des tables et répartition des convives dans la salle."
      />
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <TablePlanCanvas />
      </div>
    </div>
  );
}
