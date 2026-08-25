## 2026-08-25 - [Map Cache Key Truthiness]

**Learning:** When implementing Map-based caches with string keys, using a truthiness check for the key (e.g., `if (firstKey)`) fails when the key is an empty string `""`. This prevents cache eviction and causes memory leaks.

**Action:** Always use strict undefined checks (e.g., `if (firstKey !== undefined)`) when retrieving and deleting the first key from a Map.

## 2026-08-24 - [Caching Expensive Regex Functions]

**Learning:** Re-executing heavy regex functions like `detectCodeBlock` on identical text content during frequent mounting/unmounting wastes CPU cycles and blocks the main thread.

**Action:** Use a module-level LRU or FIFO `Map` cache (e.g., in `src/lib/code-detect.ts` with a max size limit) to store and retrieve past results for identical text inputs, preventing redundant regex calculations.

## 2026-08-24 - [List Referential Equality in Search]

**Learning:** Precomputing search strings by mapping and spreading original objects (e.g., `notes.map(note => ({ ...note, _searchString }))`) creates new object references on every calculation, completely breaking `React.memo` for child components (like `NoteCard`) and causing severe O(n) rendering regressions. Additionally, eagerly computing these derived strings into a standard `Map` during render blocks the main thread.

**Action:** Instead of mutating objects or eagerly precomputing a Map, use a module-level `WeakMap` to lazily cache the computed strings (like `.toLowerCase()`) for each object instance during the filter loop. This preserves referential equality, prevents redundant calculations on subsequent keystrokes, and allows automatic garbage collection when object references change.
