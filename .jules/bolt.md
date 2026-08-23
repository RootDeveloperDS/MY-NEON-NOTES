## 2026-08-24 - [List Referential Equality in Search]

**Learning:** Precomputing search strings by mapping and spreading original objects creates new object references on every calculation, breaking `React.memo` for child components (like `NoteCard`) and causing O(n) rendering regressions.

**Action:** When precomputing data to optimize filtering, store the computed data in a separate lookup map (e.g., `{ noteId: searchString }`) rather than cloning the original objects to preserve referential equality.

## 2026-08-24 - [Caching Expensive Regex Functions]

**Learning:** Re-executing heavy regex functions like `detectCodeBlock` on identical text content during frequent mounting/unmounting wastes CPU cycles and blocks the main thread.

**Action:** Use a module-level LRU/FIFO `Map` cache with a max size limit to store and retrieve past results for identical text inputs, preventing redundant regex calculations.
