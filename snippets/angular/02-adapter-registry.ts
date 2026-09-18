/**
 * SHOWCASE SNIPPET — journal adapter registry
 * Illustrative only. Resolve display logic by EA name.
 */

import type {
  BaseEaSettings,
  BaseLtfCondition,
  EaJournalAdapter,
  JournalDisplaySection
} from "./01-ea-journal-adapter";

const defaultEaJournalAdapter: EaJournalAdapter = {
  eaKeys: ["*"],
  matches: () => true,
  parseSettings: (raw) => ({ ...raw }) as BaseEaSettings,
  parseLtfCondition: (raw) => ({ ...raw }) as BaseLtfCondition,
  getSettingsDisplaySections: (): JournalDisplaySection[] => [
    { title: "EA Settings", rows: [{ label: "Note", value: "Default adapter fallback" }] }
  ],
  getConditionDisplaySections: (): JournalDisplaySection[] => [],
  getConditionHeadline: () => "Condition",
  formatModifyReason: (reason) => reason ?? "—"
};

/** Showcase stubs — real adapters live in the private dashboard repo. */
const marketWatchJournalAdapter: EaJournalAdapter = {
  ...defaultEaJournalAdapter,
  eaKeys: ["Market_Watch", "market_watch"],
  matches(eaName: string) {
    return eaName.trim().toLowerCase().replace(/\s+/g, "_").includes("market_watch");
  },
  getSettingsDisplaySections: (): JournalDisplaySection[] => [
    { title: "Market Watch", rows: [{ label: "Adapter", value: "market-watch" }] }
  ]
};

const srTrendJournalAdapter: EaJournalAdapter = {
  ...defaultEaJournalAdapter,
  eaKeys: ["SR_Trend", "sr_trend"],
  matches(eaName: string) {
    return eaName.trim().toLowerCase().replace(/\s+/g, "_").includes("sr_trend");
  },
  getSettingsDisplaySections: (): JournalDisplaySection[] => [
    { title: "SR Trend", rows: [{ label: "Adapter", value: "sr-trend" }] }
  ]
};

const EA_JOURNAL_ADAPTERS: EaJournalAdapter[] = [
  marketWatchJournalAdapter,
  srTrendJournalAdapter
];

export function resolveEaJournalAdapter(eaName: string | null | undefined): EaJournalAdapter {
  if (!eaName) {
    return defaultEaJournalAdapter;
  }
  return EA_JOURNAL_ADAPTERS.find((a) => a.matches(eaName)) ?? defaultEaJournalAdapter;
}

export function parseEaSettings(
  eaName: string | null | undefined,
  raw: Record<string, unknown>
): BaseEaSettings {
  return resolveEaJournalAdapter(eaName).parseSettings(raw);
}

export function parseLtfCondition(
  eaName: string | null | undefined,
  raw: Record<string, unknown>
): BaseLtfCondition {
  return resolveEaJournalAdapter(eaName).parseLtfCondition(raw);
}
