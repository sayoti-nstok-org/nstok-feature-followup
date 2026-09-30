"use client";

import React, { useState } from "react";
import {
  useFollowups,
  useScheduleFollowup,
  useMarkFollowupSent,
} from "../hooks/use-followup";
import { useFollowupStore } from "../stores/followup.store";
import { FollowupDTO, FollowupChannel } from "../schemas/followup.schema";
import {
  BellRing,
  Send,
  Calendar,
  MessageCircle,
  Phone,
  CheckCircle,
  Clock,
  Plus,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function FollowupManagerView() {
  const { statusFilter, setStatusFilter, isScheduleModalOpen, setScheduleModalOpen } =
    useFollowupStore();
  const { data: followups = [], isLoading } = useFollowups();
  const markSentMutation = useMarkFollowupSent();

  const filtered = followups.filter((f) => {
    if (statusFilter === "all") return true;
    return f.status === statusFilter;
  });

  const handleSendWhatsApp = (item: FollowupDTO) => {
    if (!item.customerPhone) return;
    const cleanPhone = item.customerPhone.replace(/[^0-9]/g, "");
    const encodedMsg = encodeURIComponent(item.messageTemplate || "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    window.open(waUrl, "_blank");

    // Automatically mark as sent
    markSentMutation.mutate({ id: item.id, summary: "Pesan terkirim via Web WhatsApp" });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/70">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-base font-bold text-foreground">
              Pengingat &amp; Otomasi Followup
            </h2>
            <p className="text-xs text-muted-foreground">
              Jadwalkan pesan touchpoint WhatsApp dan pantau status keterikatan pelanggan
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["all", "scheduled", "sent"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border/80 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {s === "all" ? "Semua Status" : s === "scheduled" ? "Terjadwal" : "Terkirim"}
            </button>
          ))}
          <button
            onClick={() => setScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 ml-2"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Jadwalkan Followup</span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-xl border border-border/80 p-4 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <MessageCircle className="h-3 w-3" />
                  WhatsApp
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    item.status === "sent"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground">{item.customerName}</h4>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {item.customerPhone || "Tanpa No. HP"}
                </p>
              </div>

              {item.messageTemplate && (
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs text-foreground italic leading-relaxed">
                  "{item.messageTemplate}"
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/40 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Jadwal:
                </span>
                <span className="font-semibold text-foreground">
                  {formatDate(item.scheduledDate)}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {item.status === "scheduled" && (
                  <button
                    onClick={() => handleSendWhatsApp(item)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Kirim via WA</span>
                  </button>
                )}
                {item.status === "sent" && (
                  <div className="w-full py-1 text-center text-xs font-medium text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Telah Dihubungi</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-8 text-center border-2 border-dashed border-border/60 rounded-xl text-xs text-muted-foreground">
            Tidak ada daftar followup dengan filter ini.
          </div>
        )}
      </div>

      <ScheduleModal />
    </div>
  );
}

function ScheduleModal() {
  const { isScheduleModalOpen, setScheduleModalOpen } = useFollowupStore();
  const scheduleMutation = useScheduleFollowup();

  const [customerName, setCustomerName] = useState("Budi Santoso");
  const [customerPhone, setCustomerPhone] = useState("081234567890");
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 3600000 * 24).toISOString().slice(0, 16)
  );
  const [messageTemplate, setMessageTemplate] = useState(
    "Halo Bpk/Ibu, terima kasih sudah berkunjung ke outlet kami. Apakah ada kebutuhan stok tambahan yang bisa kami siapkan?"
  );

  if (!isScheduleModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleMutation.mutate(
      {
        customerId: "cust-01",
        customerName,
        customerPhone,
        channel: "whatsapp",
        triggerType: "scheduled",
        scheduledDate: new Date(scheduledDate).toISOString(),
        messageTemplate,
        status: "scheduled",
      },
      {
        onSuccess: () => {
          setScheduleModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <h3 className="text-base font-bold text-foreground">Jadwalkan Followup WhatsApp</h3>
          <button
            onClick={() => setScheduleModalOpen(false)}
            className="text-muted-foreground hover:text-foreground text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground block mb-1">Nama Pelanggan</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground block mb-1">Nomor WhatsApp</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">Waktu &amp; Tanggal Followup</label>
            <input
              type="datetime-local"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">Template Pesan WhatsApp</label>
            <textarea
              rows={3}
              required
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-border/80 font-medium text-muted-foreground hover:bg-muted/50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={scheduleMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              {scheduleMutation.isPending ? "Menjadwalkan..." : "Simpan Jadwal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
