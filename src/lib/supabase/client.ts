import { createClient } from '@supabase/supabase-js';
import { Database, GuestItem, PhotoItem, GuestbookItem, ProjectTaskItem, TableItem, EventItem, ReminderLogItem } from '../database.types';
import { INITIAL_EVENTS, INITIAL_GUESTS, INITIAL_GUESTBOOK, INITIAL_PHOTOS, INITIAL_TABLES, INITIAL_TASKS, INITIAL_REMINDERS } from '../mock-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('placeholder-project') && 
  Boolean(supabaseAnonKey) &&
  !supabaseAnonKey.includes('placeholder');

export const supabase = isSupabaseConfigured
  ? createClient<any>(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// LOCAL REACTIVE STORE (HYBRID SYSTEM: SUPABASE OR LOCALSTORAGE PERSISTENCE)
// ==============================================================================

class WeddingDataStore {
  private static STORAGE_KEY_PREFIX = 'radene_kevin_wedding_';

  private getItem<T>(key: string, initial: T): T {
    if (typeof window === 'undefined') return initial;
    try {
      const stored = localStorage.getItem(WeddingDataStore.STORAGE_KEY_PREFIX + key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return initial;
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(WeddingDataStore.STORAGE_KEY_PREFIX + key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('wedding_data_changed', { detail: { key } }));
    } catch {
      // ignore
    }
  }

  // --- EVENTS ---
  async getEvents(): Promise<EventItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('events').select('*').order('ordre', { ascending: true });
      if (!error && data && data.length) return data;
    }
    return this.getItem('events', INITIAL_EVENTS);
  }

  // --- TABLES ---
  async getTables(): Promise<TableItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('tables').select('*');
      if (!error && data && data.length) return data;
    }
    return this.getItem('tables', INITIAL_TABLES);
  }

  async saveTable(table: Partial<TableItem>): Promise<TableItem> {
    const current = await this.getTables();
    let updated: TableItem;
    if (table.id) {
      const existing = current.find(t => t.id === table.id);
      updated = { ...existing, ...table } as TableItem;
      const index = current.findIndex(t => t.id === table.id);
      if (index !== -1) current[index] = updated;
      else current.push(updated);
    } else {
      updated = {
        id: 't-' + Date.now(),
        nom_numero: table.nom_numero || 'Nouvelle Table',
        capacite: table.capacite || 8,
        forme: table.forme || 'ronde',
        coordonnees_x_y: table.coordonnees_x_y || { x: 300, y: 300, rotation: 0 },
        couleur: table.couleur || '#B89355',
        zone: table.zone || 'Salle Principale',
        notes: table.notes || '',
        created_at: new Date().toISOString(),
      };
      current.push(updated);
    }

    if (supabase) {
      await supabase.from('tables').upsert(updated as any);
    }
    this.setItem('tables', current);
    return updated;
  }

  async deleteTable(tableId: string): Promise<void> {
    const current = await this.getTables();
    const filtered = current.filter(t => t.id !== tableId);
    if (supabase) {
      await supabase.from('tables').delete().eq('id', tableId);
    }
    this.setItem('tables', filtered);
  }

  // --- GUESTS ---
  async getGuests(): Promise<GuestItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('guests').select('*').order('nom', { ascending: true });
      if (!error && data && data.length) return data;
    }
    return this.getItem('guests', INITIAL_GUESTS);
  }

  async findGuestByQuery(query: string): Promise<GuestItem | null> {
    const guests = await this.getGuests();
    const clean = query.trim().toLowerCase();
    if (!clean) return null;

    // Search by exact QR Code UID
    const byQr = guests.find(g => g.qr_code_uid.toLowerCase() === clean);
    if (byQr) return byQr;

    // Search by Full Name or Email
    const byName = guests.find(g => 
      `${g.prenom} ${g.nom}`.toLowerCase().includes(clean) ||
      `${g.nom} ${g.prenom}`.toLowerCase().includes(clean) ||
      (g.email && g.email.toLowerCase() === clean)
    );
    return byName || null;
  }

  async saveGuest(guest: Partial<GuestItem>): Promise<GuestItem> {
    const guests = await this.getGuests();
    let updated: GuestItem;

    if (guest.id) {
      const index = guests.findIndex(g => g.id === guest.id);
      const existing = index !== -1 ? guests[index] : ({} as GuestItem);
      updated = {
        ...existing,
        ...guest,
        updated_at: new Date().toISOString(),
      } as GuestItem;
      if (index !== -1) guests[index] = updated;
      else guests.push(updated);
    } else {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "RK-";
      for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));

      updated = {
        id: 'g-' + Date.now(),
        nom: guest.nom || '',
        prenom: guest.prenom || '',
        email: guest.email || '',
        telephone: guest.telephone || '',
        statut_rsvp: guest.statut_rsvp || 'en_attente',
        menu_choisi: guest.menu_choisi,
        allergies: guest.allergies,
        accompagnants_json: guest.accompagnants_json || [],
        qr_code_uid: guest.qr_code_uid || code,
        table_id: guest.table_id || null,
        checked_in: guest.checked_in || false,
        checked_in_at: guest.checked_in_at || null,
        checked_in_by: guest.checked_in_by || null,
        nombre_invites: 1 + (guest.accompagnants_json?.length || 0),
        navette_requise: guest.navette_requise || false,
        hebergement_requis: guest.hebergement_requis || false,
        message_maries: guest.message_maries || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      guests.push(updated);
    }

    if (supabase) {
      await supabase.from('guests').upsert(updated as any);
    }
    this.setItem('guests', guests);
    return updated;
  }

  async checkInGuest(guestIdOrQr: string, protocolName: string = 'Protocole'): Promise<GuestItem | null> {
    const guests = await this.getGuests();
    const target = guests.find(g => g.id === guestIdOrQr || g.qr_code_uid.toUpperCase() === guestIdOrQr.toUpperCase());
    if (!target) return null;

    target.checked_in = true;
    target.checked_in_at = new Date().toISOString();
    target.checked_in_by = protocolName;
    target.updated_at = new Date().toISOString();

    if (supabase) {
      await supabase.from('guests').update({
        checked_in: true,
        checked_in_at: target.checked_in_at,
        checked_in_by: protocolName,
      } as any).eq('id', target.id);
    }
    this.setItem('guests', guests);
    return target;
  }

  async deleteGuest(guestId: string): Promise<void> {
    const guests = await this.getGuests();
    const filtered = guests.filter(g => g.id !== guestId);
    if (supabase) {
      await supabase.from('guests').delete().eq('id', guestId);
    }
    this.setItem('guests', filtered);
  }

  // --- PHOTOS & MODERATION ---
  async getPhotos(includePending: boolean = false): Promise<PhotoItem[]> {
    if (supabase) {
      let query = supabase.from('photos').select('*').order('created_at', { ascending: false });
      if (!includePending) {
        query = query.eq('statut', 'valide');
      }
      const { data, error } = await query;
      if (!error && data) return data;
    }
    const photos = this.getItem('photos', INITIAL_PHOTOS);
    if (includePending) return photos;
    return photos.filter(p => p.statut === 'valide');
  }

  async addPhoto(photo: Omit<PhotoItem, 'id' | 'created_at' | 'likes_count'>): Promise<PhotoItem> {
    const current = this.getItem('photos', INITIAL_PHOTOS);
    const newPhoto: PhotoItem = {
      id: 'p-' + Date.now(),
      url: photo.url,
      storage_path: photo.storage_path,
      uploaded_by: photo.uploaded_by || 'Invité Anonyme',
      event_id: photo.event_id,
      caption: photo.caption,
      statut: photo.statut || 'en_attente',
      likes_count: 0,
      created_at: new Date().toISOString(),
    };
    current.unshift(newPhoto);

    if (supabase) {
      await supabase.from('photos').insert(newPhoto as any);
    }
    this.setItem('photos', current);
    return newPhoto;
  }

  async updatePhotoStatus(photoId: string, statut: 'valide' | 'rejete'): Promise<void> {
    const photos = this.getItem('photos', INITIAL_PHOTOS);
    const target = photos.find(p => p.id === photoId);
    if (target) {
      target.statut = statut;
      if (supabase) {
        await supabase.from('photos').update({ statut } as any).eq('id', photoId);
      }
      this.setItem('photos', photos);
    }
  }

  // --- GUESTBOOK ---
  async getGuestbook(): Promise<GuestbookItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length) return data;
    }
    return this.getItem('guestbook', INITIAL_GUESTBOOK);
  }

  async addGuestbookEntry(entry: Omit<GuestbookItem, 'id' | 'created_at' | 'is_pinned'>): Promise<GuestbookItem> {
    const current = await this.getGuestbook();
    const newEntry: GuestbookItem = {
      id: 'b-' + Date.now(),
      guest_name: entry.guest_name,
      email: entry.email,
      message: entry.message,
      emoji: entry.emoji || '🥂',
      is_pinned: false,
      created_at: new Date().toISOString(),
    };
    current.unshift(newEntry);

    if (supabase) {
      await supabase.from('guestbook').insert(newEntry as any);
    }
    this.setItem('guestbook', current);
    return newEntry;
  }

  // --- KANBAN TASKS ---
  async getTasks(): Promise<ProjectTaskItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('project_tasks').select('*').order('ordre', { ascending: true });
      if (!error && data && data.length) return data;
    }
    return this.getItem('project_tasks', INITIAL_TASKS);
  }

  async saveTask(task: Partial<ProjectTaskItem>): Promise<ProjectTaskItem> {
    const tasks = await this.getTasks();
    let updated: ProjectTaskItem;

    if (task.id) {
      const index = tasks.findIndex(t => t.id === task.id);
      const existing = index !== -1 ? tasks[index] : ({} as ProjectTaskItem);
      updated = { ...existing, ...task } as ProjectTaskItem;
      if (index !== -1) tasks[index] = updated;
      else tasks.push(updated);
    } else {
      updated = {
        id: 'k-' + Date.now(),
        titre: task.titre || 'Nouvelle Tâche',
        description: task.description || '',
        assigne_a: task.assigne_a || 'Kevin',
        priorite: task.priorite || 'moyenne',
        echeance: task.echeance || '',
        statut: task.statut || 'a_faire',
        ordre: tasks.length + 1,
        created_at: new Date().toISOString(),
      };
      tasks.push(updated);
    }

    if (supabase) {
      await supabase.from('project_tasks').upsert(updated as any);
    }
    this.setItem('project_tasks', tasks);
    return updated;
  }

  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    if (supabase) {
      await supabase.from('project_tasks').delete().eq('id', taskId);
    }
    this.setItem('project_tasks', filtered);
  }

  // --- REMINDERS LOG ---
  async getReminders(): Promise<ReminderLogItem[]> {
    return this.getItem('reminders_log', INITIAL_REMINDERS);
  }

  async sendReminder(guestId: string, channel: 'email' | 'sms', guestName: string): Promise<ReminderLogItem> {
    const logs = await this.getReminders();
    const newLog: ReminderLogItem = {
      id: 'r-' + Date.now(),
      guest_id: guestId,
      guest_name: guestName,
      channel,
      status: 'envoye',
      details: `Relance ${channel.toUpperCase()} envoyée avec succès à ${guestName}`,
      sent_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    this.setItem('reminders_log', logs);
    return newLog;
  }
}

export const weddingStore = new WeddingDataStore();
