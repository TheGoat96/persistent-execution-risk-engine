/**
 * SHOWCASE SNIPPET — pending chart-condition outbox
 * Illustrative only. Shows the race/TTL pattern, not field-level alpha.
 *
 * Problem: an EA may POST chart conditions before the parent
 * order/position document exists.
 *
 * Solution: write to a TTL outbox, flush when the parent appears,
 * scheduled job purges expired rows.
 */

export type PendingTradeConditionSource = "market_watch" | "sr_trend";

/** Retention window for deferred payloads. */
export const PENDING_TRADE_CONDITION_TTL_MS = 48 * 60 * 60 * 1000;

/** Composite key used to match outbox rows to a trade. */
export const pendingTradeKey = (accountNumber: unknown, ticket: unknown) =>
  `${Number(accountNumber)}_${Number(ticket)}`;

/**
 * When a chart-condition POST cannot find its parent trade doc:
 * 1. Persist a Pending_Chart_Conditions row with expireAt
 * 2. Return 202 / accepted
 */
export async function deferChartCondition(input: {
  accountNumber: number;
  ticket: number;
  source: PendingTradeConditionSource;
  // payload intentionally omitted from showcase — may encode strategy state
}): Promise<void> {
  const key = pendingTradeKey(input.accountNumber, input.ticket);
  // await pendingCollection.doc(key).set({
  //   ...metadata,
  //   source: input.source,
  //   expireAt: now + PENDING_TRADE_CONDITION_TTL_MS,
  //   createdAt: serverTimestamp()
  // });
  void key;
}

/**
 * After positionOpen / orderInit succeeds, flush matching outbox rows
 * into Positions/{id}/Position_Conditions (or Orders equivalent).
 */
export async function flushPendingTradeConditionsForTrade(
  accountNumber: number,
  ticket: number
): Promise<void> {
  const key = pendingTradeKey(accountNumber, ticket);
  // const pending = await pendingCollection.where("tradeKey", "==", key).get();
  // for each → write under parent → delete pending doc
  void key;
}

/**
 * Scheduled (e.g. daily): delete Pending_Chart_Conditions older than TTL.
 */
export async function purgeExpiredPendingTradeConditions(): Promise<number> {
  // const cutoff = Timestamp.fromMillis(Date.now() - PENDING_TRADE_CONDITION_TTL_MS);
  // query where expireAt <= cutoff → batch delete
  return 0;
}
