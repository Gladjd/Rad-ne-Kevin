'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PhotoModerationCard } from '@/components/admin/PhotoModerationCard';

export default function AdminModerationPage() {
  return (
    <div>
      <AdminHeader
        title="Modération des Photos du Mariage"
        subtitle="Approuvez ou rejetez en un clic les clichés pris par vos invités avant publication."
      />
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <PhotoModerationCard />
      </div>
    </div>
  );
}
