# Architecture

Deeper system design for the portfolio showcase. No proprietary signal logic is described here.

---

## End-to-end data flow

### 1. EA → Cloud (write path)

MT5 Expert Advisors post lifecycle events over HTTPS (`WebRequest`) into Cloud Functions:

- Account heartbeat / verify
- Orders and positions
- EA settings + chart-condition snapshots (per-EA route namespaces)
- Violations (account / EA / news / session)
- Chart screenshots (binary → Base64 → Storage + Firestore metadata)

Uplink is **queued and non-blocking** on the EA side so trade management is not stalled by network I/O.

### 2. Cloud → Firestore document model

Canonical shape (names only):

```
Accounts/{accountId}
  Orders_List/
  Positions_List/
  Symbols_List/
  Trade_Violations/
  EA_Violations/
  Pending_Commands/

Orders/{id}
  Order_Conditions/ …

Positions/{id}
  Position_Modified/
  Position_Conditions/ …
  Position_EA_Setting/

Pending_Chart_Conditions/   ← shared outbox (TTL)
```

### 3. Dashboards → Firestore / API (read path)

- **Accounts Dashboard** — Firebase Auth + AngularFire realtime reads; multi-account scoping; journal adapters for heterogeneous EAs
- **EA Command Dashboard** — live position listeners + command issuance against the REST API

### 4. Dashboard → EA (command path)

Operators issue ops commands (`PAUSE_EA`, `RESUME_EA`, hibernation, close-all, day shutdown, etc.).

Commands land in `Accounts/{id}/Pending_Commands`. EAs:

1. Poll (legacy) or long-poll with lease
2. Execute locally
3. Acknowledge
4. Record a command-id hash in a terminal `GlobalVariable` so peer charts do not double-apply

---

## EA internal layering

```
EA root (.mq5 entry)
├── Master_Files/          ← shared platform
│   ├── risk / account gates
│   ├── orders / positions / trade monitor
│   ├── sessions / news
│   └── cloud uplink + remote commands
└── <Strategy>/            ← per-EA strategy plugin
    ├── models
    ├── setup / monitor
    └── EA cloud adapter hooks
```

### Runtime control flow

| Hook | Role |
|------|------|
| `OnInit` | Validate inputs → seed modules → optional cloud bootstrap → news/session setup |
| `OnTick` | Trading-allowed gate → manage open positions → strategy plugin hooks → bar-time schedulers |
| `OnTimer` | Drain HTTPS queue; poll remote commands (~10s) |
| `OnTrade` | Event-driven sync of terminal deals/orders/positions into internal state |

Strategy code is invoked only through plugin hooks. The public snippets stub those calls.

---

## Communication mechanisms

| Mechanism | Role |
|-----------|------|
| HTTP `WebRequest` | Primary remote I/O to Cloud Functions |
| Terminal `GlobalVariable`s | Cross-chart locks: pause, day/account P/L, exposure, hibernation, command dedupe |
| File I/O | `ChartScreenShot` → binary read → Base64 upload |
| MetaTrader push | Optional account/trade alerts |

---

## Frontend adapter pattern

The Accounts Dashboard journal UI does not hard-code one EA’s payload shape.

1. `EaJournalAdapter` defines parse + display section contracts
2. Per-EA adapters map each product’s settings/conditions into shared display sections
3. A registry resolves by EA name, with a safe default fallback

That keeps the journal page stable as new EAs are added.

---

## Race-safe chart telemetry

Chart-condition payloads can arrive before the parent order/position document exists.

Pattern:

1. Write to `Pending_Chart_Conditions` outbox with a TTL
2. When the parent trade document appears, flush matching pending rows
3. Scheduled job purges expired outbox docs
