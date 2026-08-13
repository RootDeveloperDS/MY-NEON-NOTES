## 2026-08-13 - [Virtualizing Expensive Rendering in Lists]

**Learning:** Mapping over arrays where each item computes derived data (like relative time formatting via `formatDistanceToNow` or regex parsing) inside a large parent component causes O(n) re-evaluations for every unrelated state change in the parent.

**Action:** Always extract list items with expensive derived data calculations into separate, `React.memo` wrapped components.

## 2026-08-13 - [Stabilizing Callback Props for Memoized Components]

**Learning:** Wrapping a large component like `NoteViewer` with `React.memo` is ineffective if the parent (`NotesDashboard`) passes inline functions as event handlers (e.g., `onBack={() => setViewingNote(null)}`). The inline functions create new references on every parent render, breaking the memoization and causing the child to re-render anyway.

**Action:** When passing callback functions as props to `React.memo` components, strictly wrap those functions with `useCallback` in the parent component to provide stable references.
