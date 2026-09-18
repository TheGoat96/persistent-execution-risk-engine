/**
 * SHOWCASE SNIPPET — EA journal adapter contract
 * Illustrative only. Demonstrates polymorphic journal display.
 *
 * Production adapters map EA-specific settings/conditions into
 * generic display sections. Proprietary field catalogs are omitted.
 */

export type JournalDisplayRow = {
  label: string;
  value: string;
};

export type JournalDisplaySection = {
  title: string;
  rows: JournalDisplayRow[];
};

/** Minimal shared settings shape — extend per EA privately. */
export type BaseEaSettings = {
  eaName?: string;
  // … shared ops fields only in showcase
};

/** Minimal shared condition shape — extend per EA privately. */
export type BaseLtfCondition = {
  symbol?: string;
  // … shared ops fields only in showcase
};

/**
 * Each EA implements this so the journal UI stays decoupled from
 * any one strategy's payload layout.
 */
export interface EaJournalAdapter {
  readonly eaKeys: string[];
  matches(eaName: string): boolean;
  parseSettings(raw: Record<string, unknown>): BaseEaSettings;
  parseLtfCondition(raw: Record<string, unknown>): BaseLtfCondition;
  getSettingsDisplaySections(settings: BaseEaSettings): JournalDisplaySection[];
  getConditionDisplaySections(condition: BaseLtfCondition): JournalDisplaySection[];
  getConditionHeadline(condition: BaseLtfCondition): string;
  /** Human label for position modify / close reason codes. */
  formatModifyReason(reason: string | null | undefined): string;
}
