# Notification System Design

## Stage 1

### Problem

Users are overwhelmed by the volume of campus notifications. They lose track of important ones — especially placement updates and results — in a sea of event announcements. We need a **Priority Inbox** that surfaces the top N most important unread notifications.

### Priority Algorithm

Each notification type gets a fixed weight reflecting its importance to students:

| Type | Weight | Reasoning |
|------|--------|-----------|
| Placement | 3 | Directly affects career — time-sensitive, high stakes |
| Result | 2 | Academic outcomes — important but less urgent than placements |
| Event | 1 | General campus events — nice to know, lower urgency |

**Sorting logic:**
1. Sort by type weight (descending) — placements first
2. Within the same type, sort by timestamp (descending) — most recent first
3. Slice the top N from the sorted list

```
score(notification) = (weight × 10^12) + unix_timestamp
```

This single-score approach makes comparison fast and deterministic.

### Handling Incoming Notifications

New notifications keep arriving. Rebuilding the priority list from scratch every time is wasteful. Two approaches depending on scale:

**Current approach (small-medium scale, <1000 notifications):**
- Fetch all → sort → slice top N
- Simple, correct, fast enough at this scale
- O(n log n) per refresh

**Scalable approach (thousands+ notifications):**
- Maintain a **min-heap of size N**
- For each new notification, compare its score against the heap's minimum
- If higher, remove the min and insert the new one
- Top N is always the heap contents
- O(log N) per new notification instead of O(n log n)

### Read/Unread Tracking

Since the API doesn't provide read status, we track it client-side:
- Store read notification IDs in `localStorage`
- On click, add the ID to the read set
- Priority Inbox only shows unread notifications
- Persists across page refreshes without needing a database

### Data Flow

```
API (GET /notifications)
    ↓
Fetch notifications (with optional type filter + pagination)
    ↓
Filter out read IDs (from localStorage)
    ↓
Sort by priority weight + recency
    ↓
Slice top N
    ↓
Render in Priority Inbox
```

### Trade-offs

| Decision | Rationale |
|----------|-----------|
| Client-side priority sorting | No backend changes needed, works with existing API |
| localStorage for read status | Simple, no auth/DB required, sufficient for single-device use |
| Fixed weights per type | Easy to understand and adjust — could be made configurable later |
| Recency as tiebreaker | Ensures fresh notifications surface within the same type |
