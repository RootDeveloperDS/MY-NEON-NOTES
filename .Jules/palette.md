## 2024-03-05 - Added ARIA label to User Profile Avatar
**Learning:** Found that the `Avatar` component inside the dropdown menu trigger for the user profile was missing an accessible name, making it opaque to screen readers.
**Action:** Always verify that avatar buttons used as dropdown triggers have a descriptive `aria-label` (e.g., "Open user profile menu") to clarify their interactive purpose.