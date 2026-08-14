## 2026-08-16 - [IP Spoofing Prevention]

**Learning:** Relying on client-provided IP addresses in API payloads (e.g., for analytics or notifications) allows IP spoofing by malicious actors.

**Action:** Always prioritize server-detected IP addresses extracted from HTTP headers like `x-forwarded-for` or `x-real-ip` over client-provided values in API routes.

## 2026-08-16 - [Form AutoComplete Accessibility and Security]

**Learning:** Authentication forms lacking proper `autoComplete` attributes prevent password managers and browser autofill from functioning correctly, creating unnecessary friction for users trying to sign in or register and reducing security by discouraging password manager use.

**Action:** Always include standard `autoComplete` attributes (e.g., `email`, `current-password`, `new-password`) on authentication form inputs to support accessibility and autofill tools.
