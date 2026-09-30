import { z } from "zod";

export const FollowupChannelSchema = z.enum(["whatsapp", "phone", "email", "visit"]);
export type FollowupChannel = z.infer<typeof FollowupChannelSchema>;

export const FollowupStatusSchema = z.enum(["scheduled", "sent", "missed", "cancelled"]);
export type FollowupStatus = z.infer<typeof FollowupStatusSchema>;

export const FollowupDTOSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional(),
  customerId: z.string(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  dealId: z.string().optional(),
  channel: FollowupChannelSchema.default("whatsapp"),
  triggerType: z.enum(["scheduled", "automated", "recurring"]).default("scheduled"),
  scheduledDate: z.string(),
  messageTemplate: z.string().optional(),
  status: FollowupStatusSchema.default("scheduled"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type FollowupDTO = z.infer<typeof FollowupDTOSchema>;

export const TouchpointDTOSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional(),
  followupId: z.string().optional(),
  customerId: z.string(),
  channel: FollowupChannelSchema,
  sentMessage: z.string(),
  responseSummary: z.string().optional(),
  sentiment: z.enum(["positive", "neutral", "negative", "interested"]).optional(),
  createdAt: z.string().optional(),
});
export type TouchpointDTO = z.infer<typeof TouchpointDTOSchema>;

export const ScheduleFollowupInputSchema = FollowupDTOSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type ScheduleFollowupInput = z.infer<typeof ScheduleFollowupInputSchema>;
