## 2024-05-18 - [React Rendering Optimization in Dashboard]

**Learning:** Unnecessary component re-renders were identified as a bottleneck in the Note Dashboard list. When state changes occurred in `NotesDashboard` (such as opening a modal or selecting a note for viewing), it triggered a re-render of all `NoteCard` components. Additionally, the code syntax detection regex (`detectCodeBlock`) was running on every render for every card, further compounding the issue.

**Action:** Wrap list item components like `NoteCard` with `React.memo` to prevent re-renders when their props have not changed. Ensure callback props passed to list items from parent components are wrapped in `useCallback` to maintain stable references. Use `useMemo` to cache the results of expensive calculations or regex evaluations within components.
