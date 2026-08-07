## 2026-08-07 - [Dynamic Import for Heavy Components]

**Learning:** Statically importing heavy client components (like `NoteCodeBlock` which relies on `prismjs`) in Next.js pages or modals bloats the initial JavaScript bundle, slowing down Time to Interactive (TTI).

**Action:** Always wrap heavy client components with `next/dynamic` (often with `ssr: false` if they don't need server rendering) to lazily load them and reduce the initial JS payload, especially for routes like public shared links.
