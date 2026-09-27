'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { KanbanBoard } from '@/components/admin/KanbanBoard';

export default function AdminKanbanPage() {
  return (
    <div>
      <AdminHeader
        title="Kanban & Suivi de Projet Mariage"
        subtitle="Organisation collaborative des tâches clés avant et pendant le Jour J."
      />
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <KanbanBoard />
      </div>
    </div>
  );
}
