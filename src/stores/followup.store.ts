import { create } from "zustand";
import { FollowupDTO } from "../schemas/followup.schema";

interface FollowupState {
  statusFilter: string;
  isScheduleModalOpen: boolean;
  selectedFollowup: FollowupDTO | null;
  setStatusFilter: (filter: string) => void;
  setScheduleModalOpen: (open: boolean) => void;
  setSelectedFollowup: (fol: FollowupDTO | null) => void;
}

export const useFollowupStore = create<FollowupState>((set) => ({
  statusFilter: "all",
  isScheduleModalOpen: false,
  selectedFollowup: null,
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setScheduleModalOpen: (isScheduleModalOpen) => set({ isScheduleModalOpen }),
  setSelectedFollowup: (selectedFollowup) => set({ selectedFollowup }),
}));
