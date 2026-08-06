## 2024-05-18 - [Prism.js Dynamic Import Waterfall]

**Learning:** Prism.js language components rely heavily on side effects and global object mutation. They possess strict inter-dependencies (e.g. `javascript` depends on `clike`). Attempting to optimize their dynamic imports using `Promise.all` causes race conditions that crash syntax highlighting.

**Action:** Always use sequential `await import(...)` for Prism.js language extensions in this codebase. Do not attempt to parallelize them.
