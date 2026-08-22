## 2026-08-22 - [Controlled Input Performance Regression]

**Learning:** Converting an uncontrolled, debounced search input into a controlled component without managing the main thread causes major UI blocking when typing if the parent triggers heavy list filtering.

**Action:** When tightly binding search inputs to parent state (e.g., via `searchTerm`), either maintain a local state in the input with a debounced update callback, or aggressively defer the parent's filtering operation using `useDeferredValue` to preserve typing responsiveness.
