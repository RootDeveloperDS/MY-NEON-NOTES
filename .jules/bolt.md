## 2026-08-05 - [Next.js Lazy Loading Heavy Components]

**Learning:** Heavy components such as modals (NoteModal), viewers (NoteViewer), or components integrating large libraries like prismjs (NoteCodeBlock) unnecessarily inflate the main client JavaScript bundle if statically imported, increasing Time To Interactive.

**Action:** Always use `next/dynamic` (often with `ssr: false`) for heavy, interactive, or conditionally rendered components to defer their loading until they are actually needed in the application state.
