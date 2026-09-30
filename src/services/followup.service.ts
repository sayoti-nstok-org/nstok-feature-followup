import {
  FollowupDTO,
  TouchpointDTO,
  ScheduleFollowupInput,
} from "../schemas/followup.schema";

export interface FollowupRepositoryPort {
  getFollowups(status?: string): Promise<FollowupDTO[]>;
  scheduleFollowup(input: ScheduleFollowupInput): Promise<FollowupDTO>;
  markAsSent(id: string, responseSummary?: string): Promise<FollowupDTO>;
  cancelFollowup(id: string): Promise<void>;
  getTouchpoints(customerId?: string): Promise<TouchpointDTO[]>;
}

const STORAGE_KEY_FOLLOWUPS = "nstok_crm_followups_cache";

export const initialMockFollowups: FollowupDTO[] = [
  {
    id: "fol-01",
    organizationId: "org-01",
    customerId: "cust-01",
    customerName: "Budi Santoso",
    customerPhone: "081234567890",
    channel: "whatsapp",
    triggerType: "scheduled",
    scheduledDate: new Date(Date.now() + 3600000 * 2).toISOString(),
    messageTemplate: "Halo Bpk Budi, mengonfirmasi terkait penawaran kontrak pasokan beras 100 karung, apakah sudah sempat ditinjau manajemen?",
    status: "scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fol-02",
    organizationId: "org-01",
    customerId: "cust-02",
    customerName: "Siti Rahma",
    customerPhone: "082345678901",
    channel: "whatsapp",
    triggerType: "automated",
    scheduledDate: new Date(Date.now() + 3600000 * 24).toISOString(),
    messageTemplate: "Selamat pagi Ibu Siti, stok produk di outlet Melati diperkirakan menipis besok. Apakah ingin kami siapkan pengiriman restock?",
    status: "scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fol-03",
    organizationId: "org-01",
    customerId: "cust-04",
    customerName: "Dewi Lestari",
    customerPhone: "085678901234",
    channel: "whatsapp",
    triggerType: "recurring",
    scheduledDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    messageTemplate: "Terima kasih telah berbelanja di outlet kami. Dapatkan bonus poin loyalitas ganda minggu ini!",
    status: "sent",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

function getStoredFollowups(): FollowupDTO[] {
  if (typeof window === "undefined") return initialMockFollowups;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FOLLOWUPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_FOLLOWUPS, JSON.stringify(initialMockFollowups));
      return initialMockFollowups;
    }
    return JSON.parse(raw);
  } catch {
    return initialMockFollowups;
  }
}

function saveStoredFollowups(data: FollowupDTO[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_FOLLOWUPS, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const followupService: FollowupRepositoryPort = {
  async getFollowups(status?: string): Promise<FollowupDTO[]> {
    try {
      const url = status ? `/api/crm/followups?status=${status}` : "/api/crm/followups";
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const list = getStoredFollowups();
    return status ? list.filter((f) => f.status === status) : list;
  },

  async scheduleFollowup(input: ScheduleFollowupInput): Promise<FollowupDTO> {
    try {
      const res = await fetch("/api/crm/followups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const list = getStoredFollowups();
    const newFol: FollowupDTO = {
      ...input,
      id: `fol-${Date.now()}`,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newFol);
    saveStoredFollowups(list);
    return newFol;
  },

  async markAsSent(id: string, responseSummary?: string): Promise<FollowupDTO> {
    try {
      const res = await fetch(`/api/crm/followups/${id}/sent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseSummary }),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const list = getStoredFollowups();
    const idx = list.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error("Followup tidak ditemukan");
    const updated: FollowupDTO = {
      ...list[idx],
      status: "sent",
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredFollowups(list);
    return updated;
  },

  async cancelFollowup(id: string): Promise<void> {
    try {
      await fetch(`/api/crm/followups/${id}`, { method: "DELETE" });
    } catch {
      // fallback
    }
    const list = getStoredFollowups().filter((f) => f.id !== id);
    saveStoredFollowups(list);
  },

  async getTouchpoints(customerId?: string): Promise<TouchpointDTO[]> {
    return [];
  },
};
