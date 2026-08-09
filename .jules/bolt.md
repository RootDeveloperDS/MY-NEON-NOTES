## 2026-08-09 - [Dynamic Loading for Heavy Components]

**Learning:** Statically importing heavy client-side components with third-party dependencies (like `NoteCodeBlock` which uses `prismjs`) in heavily-used pages (like shared notes) bloats the initial JS bundle size and increases load times.

**Action:** Wrap heavy UI components, particularly those using large libraries like `prismjs`, with `next/dynamic` (`ssr: false`) in files such as `src/app/shared/[id]/page.tsx` to ensure they are lazy-loaded only when they are rendered. Additionally, remove any unused imports in components like `NoteModal.tsx` to further reduce parsing and execution overhead.
