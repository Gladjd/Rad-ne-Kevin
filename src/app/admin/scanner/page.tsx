'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { QrScannerCamera } from '@/components/admin/QrScannerCamera';

export default function AdminScannerPage() {
  return (
    <div>
      <AdminHeader
        title="Scanner Caméra - Jour J (Protocole)"
        subtitle="Pointez le pass de l'invité pour valider son arrivée et l'orienter instantanément vers sa table."
      />
      <div className="p-6 sm:p-8 max-w-4xl mx-auto">
        <QrScannerCamera />
      </div>
    </div>
  );
}
