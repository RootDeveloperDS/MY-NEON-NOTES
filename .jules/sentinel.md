## 2026-08-11 - [Client-Side Authorization Checks]

**Learning:** Relying solely on external Firestore rules for document modification authorization creates a single point of failure. Client-side state tampering could allow passing an incorrect `userId` or modifying unowned documents if not explicitly validated.

**Action:** Implement defense-in-depth by always adding explicit client-side authorization boundary checks (e.g., `if (note.userId !== activeUid) return;`) before executing database updates or deletions across the application.
