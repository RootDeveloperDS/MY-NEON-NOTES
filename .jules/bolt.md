## 2026-08-11 - [List Item Formatting Cost]

**Learning:** When rendering large lists (like note lists in `NotesDashboard`), inline functions that process time formatting (like `formatDistanceToNow`) for every item cause significant O(n) re-calculations during any dashboard re-render, creating a performance bottleneck.

**Action:** Always extract list items with expensive formatting into standalone `React.memo` components (like `SidebarNoteItem`) to isolate rendering and prevent O(n) recalculations across the entire list when unrelated state changes.

## 2026-08-11 - [Heavy Component Callbacks]

**Learning:** Heavy components (like `NoteViewer`) that rely on expensive syntax highlighting re-render entirely when passed inline callback functions (like `() => setViewingNote(null)`) from a parent, as these functions change reference on every render.

**Action:** Always wrap heavy child components with `React.memo` and strictly supply them with stable callbacks using `useCallback` to prevent unrelated parent state changes from causing cascading re-renders.
