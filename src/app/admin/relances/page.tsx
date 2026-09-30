'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { WhatsAppManager } from '@/components/admin/WhatsAppManager';
import { ReminderSenderModal } from '@/components/admin/ReminderSenderModal';
import { MessageCircle, Mail, Sparkles } from 'lucide-react';

export default function AdminRelancesPage() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email_sms'>('whatsapp');

  return (
    <div>
      <AdminHeader
        title="Faire-Parts, Invitations & Relances"
        subtitle="Expédition de faire-parts WhatsApp Web en 1 clic et relances automatiques par Email / SMS."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-gold-200/60 dark:border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-gold-50 dark:hover:bg-zinc-700'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Web & Faire-Parts</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">
              Nouveau
            </span>
          </button>

          <button
            onClick={() => setActiveTab('email_sms')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'email_sms'
                ? 'bg-gold-500 text-white shadow-md shadow-gold-500/20'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-gold-50 dark:hover:bg-zinc-700'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email & SMS (Resend / Twilio)</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'whatsapp' ? <WhatsAppManager /> : <ReminderSenderModal />}
      </div>
    </div>
  );
}
