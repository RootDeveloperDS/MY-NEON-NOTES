# AGENTS.md - PR & Code Generation Rules

When creating a Pull Request or submitting code changes, you MUST structure the PR description with the following sections:

1. **Executive Summary**: 2-3 sentences max explaining WHAT was changed and WHY.

2. **Impact & Safety Matrix**:

| File Changed / Removed | Action | Technical Reason | Post-Removal/Update Impact | Risk Level |
| :--- | :--- | :--- | :--- | :--- |
| `path/to/file` | Modified/Deleted | Why it was changed | What improves or changes | 🟢 Low / 🟡 Med / 🔴 High |

3. **Verification**: State tests run or how you verified this won't break existing IPC/UI threads.

4. **Clean Artifacts**: NEVER commit `.patch`, `.log`, or `.tmp` files.
