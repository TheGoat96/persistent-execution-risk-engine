/**
 * SHOWCASE SNIPPET — Firestore path constants
 * Illustrative only. Collection names, not payloads or secrets.
 */

export const fsConst = {
  // Accounts
  ACCOUNTS: "Accounts",
  AC_ORDERSLIST: "Orders_List",
  AC_POSITIONSLIST: "Positions_List",
  AC_SYMBOLS: "Symbols_List",
  AC_TRADE_VIOLATION: "Trade_Violations",
  AC_EA_VIOLATION: "EA_Violations",
  AC_PENDING_COMMANDS: "Pending_Commands",

  // Orders tree
  ORDERS: "Orders",
  OR_CONDITIONS: "Order_Conditions",
  OR_LTF_CONDITION: "Order_LTF_Conditions",
  OR_HTF_CONDITION: "Order_HTF_Conditions",

  // Positions tree
  POSITIONS: "Positions",
  POS_MODIFY: "Position_Modified",
  POS_CONDITIONS: "Position_Conditions",
  POS_HTF_CONDITION: "Position_HTF_Conditions",
  POS_LTF_CONDITION: "Position_LTF_Conditions",
  POS_EA_SETTING: "Position_EA_Setting",

  // Media
  IMAGES: "Images",

  /**
   * Shared outbox: chart-condition payloads waiting for parent
   * Orders/Positions documents (race-safe ingestion).
   */
  PENDING_CHART_CONDITIONS: "Pending_Chart_Conditions"
} as const;
