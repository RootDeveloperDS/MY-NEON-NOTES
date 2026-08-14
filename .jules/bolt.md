## 2026-08-15 - [Memoizing List Items with Derived State]

**Learning:** When rendering large lists where items compute expensive derived state (e.g., date formatting via `formatDistanceToNow`), inline rendering causes O(n) recalculations across the whole array when parent state changes.

**Action:** Extract the list item into a separate `React.memo` component to prevent expensive O(n) recalculations.

## 2026-08-15 - [Memoizing Heavy Dynamic Components]

**Learning:** Dynamically imported, heavy display components (like `NoteViewer`) suffer from unnecessary cascading re-renders of complex underlying DOM trees when unrelated parent state changes.

**Action:** Wrap these components in `React.memo` and strictly provide them with stable callback props using `useCallback`.
