## 2026-08-17 - [LCP Image Optimization]

**Learning:** Core layout images above the fold (like the logo in `NotesHeader`) that lack the `priority` attribute delay Largest Contentful Paint (LCP).

**Action:** Always add the `priority` attribute to `next/image` components used for structural above-the-fold elements.

## 2026-08-17 - [Memoizing Heavy Dynamic Components]

**Learning:** Dynamically imported, heavy display components (like `NoteViewer`) suffer from unnecessary cascading re-renders of complex underlying DOM trees when unrelated parent state changes.

**Action:** Wrap these components in `React.memo` and strictly provide them with stable callback props using `useCallback`.
