
## 2026-08-16 - [Deferring Expensive Filter Operations]

**Learning:** Real-time search inputs that directly trigger O(n) list filtering in heavily populated views (like `NotesDashboard`) block the main thread and degrade typing responsiveness.

**Action:** Wrap rapid state updates tied to heavy recalculations (like `searchTerm`) with `useDeferredValue` to ensure React prioritizes user input over the filtering render cycle.

## 2026-08-16 - [LCP Image Optimization]

**Learning:** Core layout images above the fold (like the logo in `NotesHeader`) that lack the `priority` attribute delay Largest Contentful Paint (LCP).

**Action:** Always add the `priority` attribute to `next/image` components used for structural above-the-fold elements.
