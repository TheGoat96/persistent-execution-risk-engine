/**
 * SHOWCASE SNIPPET — remote command queue contracts
 * Illustrative only. Zod shapes for issue / pull-with-lease / ack.
 */

import { z } from "zod";

/** Dashboard → cloud: enqueue an ops command for one account or ALL. */
export const IssueRequestSchema = z.object({
  accountNumber: z.union([z.number().int().positive(), z.literal("ALL"), z.string().min(1)]),
  command: z.string().min(1)
  // Known commands (names only): PAUSE_EA | RESUME_EA | HIBERNATION_ON |
  // HIBERNATION_OFF | CLOSE_ALL | SHUT_DOWN_DAY | DISABLE_EA
});

/** EA → cloud: long-poll pull with consumer lease. */
export const PullRequestSchema = z.object({
  accountNumber: z.number().int().positive(),
  eaName: z.string().min(1),
  consumerId: z.string().min(1),
  waitSeconds: z.number().int().min(1).max(30).default(20)
});

/** EA → cloud: acknowledge execution result. */
export const AckRequestSchema = z.object({
  accountNumber: z.number().int().positive(),
  consumerId: z.string().min(1).optional(),
  deliveryId: z.string().min(1).optional(),
  commandId: z.string().min(1),
  result: z.enum(["executed", "failed"]).default("executed"),
  resultMessage: z.string().optional()
});

/** Legacy simple poll (existing MQL5 clients). */
export const LegacyPendingQuerySchema = z.object({
  account: z.string().min(1)
});

export const LegacyAckSchema = z.object({
  accountNumber: z.union([z.number().int().positive(), z.string().min(1)]),
  commandId: z.string().min(1)
});

export type IssueRequest = z.infer<typeof IssueRequestSchema>;
export type PullRequest = z.infer<typeof PullRequestSchema>;
export type AckRequest = z.infer<typeof AckRequestSchema>;

/** What a successful pull returns to the EA. */
export type CommandDelivery = {
  deliveryId: string;
  commandId: string;
  command: string;
  issuedAt: string;
  leaseUntil: string;
  attempt: number;
};
