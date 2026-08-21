## 2026-08-21 - [Rules of Hooks Violation in Memoization]

**Learning:** When using `useCallback` or `useMemo` to stabilize props for memoized components like `NoteViewer`, defining these hooks inline within JSX return statements or inside conditional rendering blocks violates the Rules of Hooks and causes fatal runtime crashes (e.g., "Rendered more hooks than during the previous render").

**Action:** Always declare hooks at the top level of the functional component before the return statement.
