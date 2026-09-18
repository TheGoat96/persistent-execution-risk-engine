/**
 * SHOWCASE SNIPPET — multi-account selection
 * Illustrative only. Shows single-account vs ALL scoping.
 */

import { BehaviorSubject, Observable } from "rxjs";

export type DashboardAccount = {
  id: string;
  label: string;
  // Real account numbers / broker metadata omitted from showcase
};

export type AccountSelection = DashboardAccount | "ALL" | null;

/**
 * Header / global selection drives every Firestore query and analytics
 * aggregation in the Accounts Dashboard.
 */
export class AccountSelectionService {
  private readonly selectedAccountSubject = new BehaviorSubject<AccountSelection>(null);
  readonly selectedAccount$: Observable<AccountSelection> =
    this.selectedAccountSubject.asObservable();

  setSelectedAccount(account: AccountSelection): void {
    this.selectedAccountSubject.next(account);
  }

  getSelectedAccount(): AccountSelection {
    return this.selectedAccountSubject.value;
  }

  /** Scope a positions query to one account or fan out for ALL. */
  buildPositionsScope(selection: AccountSelection): { mode: "one" | "all" | "none"; accountId?: string } {
    if (selection === "ALL") {
      return { mode: "all" };
    }
    if (selection && typeof selection === "object") {
      return { mode: "one", accountId: selection.id };
    }
    return { mode: "none" };
  }
}

/**
 * Usage sketch (not wired to real AngularFire):
 *
 * selection$ → switchMap(sel => {
 *   const scope = svc.buildPositionsScope(sel);
 *   if (scope.mode === "all") return collectionGroup(db, "Positions_List");
 *   if (scope.mode === "one") return collection(db, `Accounts/${scope.accountId}/Positions_List`);
 *   return of([]);
 * })
 */
