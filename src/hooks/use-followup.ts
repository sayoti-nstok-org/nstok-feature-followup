import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followupService } from "../services/followup.service";
import { ScheduleFollowupInput } from "../schemas/followup.schema";

export const FOLLOWUPS_QUERY_KEY = ["crm", "followups"];

export function useFollowups(status?: string) {
  return useQuery({
    queryKey: status ? [...FOLLOWUPS_QUERY_KEY, status] : FOLLOWUPS_QUERY_KEY,
    queryFn: () => followupService.getFollowups(status),
  });
}

export function useScheduleFollowup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ScheduleFollowupInput) => followupService.scheduleFollowup(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLLOWUPS_QUERY_KEY });
    },
  });
}

export function useMarkFollowupSent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, summary }: { id: string; summary?: string }) =>
      followupService.markAsSent(id, summary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLLOWUPS_QUERY_KEY });
    },
  });
}
