## 2026-08-04 - [Input Validation and Payload Length Limits]

**Learning:** Next.js API routes and client-side forms can be vulnerable to resource exhaustion (e.g. DoS) if user inputs and payload sizes are not bounded. The codebase had some forms missing `.max()` constraints.

**Action:** Always enforce maximum length limits (e.g., `.max()`) on strings using `zod` in both client-side components (like `NoteModal.tsx`) and API routes (like `notify/route.ts`) to provide defense-in-depth against malicious payloads.
