## 2026-08-19 - [Controlled Search Input with Debounce]

**Learning:** When a search input is changed to a controlled component (i.e. maintaining local state and passing up the value via an event handler) without retaining its original debounce logic, it can cause severe main-thread blocking if parent components re-render heavily on each keystroke.

**Action:** Always verify that converting an uncontrolled or internally debounced search input to a fully controlled one retains a local debounce timer for external state updates, while updating the local value immediately for a responsive UI.
