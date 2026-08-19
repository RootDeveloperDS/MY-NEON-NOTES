## 2026-08-18 - [Search State Synchronization]

**Learning:** Implementing local search state in UI header components while the parent component also controls filtering and clear actions leads to state desynchronization (e.g., input remains populated after clearing results externally).

**Action:** Use controlled components by passing the parent's state down as a prop (e.g., passing `searchTerm` to `NotesHeader`) to keep search inputs perfectly synchronized with external actions.

## 2026-08-18 - [Search Input Clear Actions]

**Learning:** Custom search inputs that hide the native webkit cancel button (`[&::-webkit-search-cancel-button]:hidden`) require a reliable, accessible way to clear text to prevent user friction.

**Action:** Implement a custom 'Clear' (X) button that explicitly clears the search state, resets any debounce timers, and immediately returns focus to the input field (`inputRef.current?.focus()`) for continuous interaction.

## 2026-08-18 - [Visual Overlap Prevention]

**Learning:** Adding absolutely positioned action buttons inside input fields can visually overlap with existing absolute elements (like shortcut badges) across different responsive breakpoints.

**Action:** When adding new inline input actions, explicitly adjust the input's padding (e.g., `md:pr-24`) and the right-offsets of the elements (e.g., `md:right-20`) to ensure sufficient spacing for all inline items without overlap.
