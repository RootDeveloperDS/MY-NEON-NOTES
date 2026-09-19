1. **Optimize note searching with WeakMap caching**
   - Edit `src/components/notes/NotesDashboard.tsx`.
   - Add a module-level `WeakMap<Note, string>` to cache the `.toLowerCase()` concatenated strings of note title and content.
   - Update the `filteredNotes` `useMemo` to use this cache, preventing O(n) string lowercasing operations on every keystroke during search filtering, and avoiding referential equality issues with `React.memo`.

2. **Cache expensive regex operations in `detectContentType`**
   - Edit `src/lib/code-detect.ts`.
   - Implement a FIFO `Map` cache (e.g., `detectionCache`) for `detectContentType` to store results of expensive text detection regex operations.
   - Enforce a max cache size (e.g., 500) and evict the oldest entry using strict `undefined` check (`if (firstKey !== undefined)`) to prevent memory leaks from empty strings.
   - Bypass caching for extremely large text inputs (e.g., > 50,000 characters) to prevent excessive memory bloat.

3. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
   - Run verification scripts (pnpm install, build) to ensure no regressions were introduced.

4. **Submit PR**
   - Commit the changes and open a PR with the performance improvement details.
