## 2026-08-09 - [JSON-LD XSS Prevention]

**Learning:** Injecting JSON-LD into `<script>` tags using `dangerouslySetInnerHTML` is vulnerable to XSS if the JSON contains unescaped `<` characters (e.g., `</script><script>alert(1)</script>`).

**Action:** Always sanitize stringified JSON by replacing `<` with `\u003C` (e.g., `JSON.stringify(schema).replace(/</g, '\\u003C')`) before injecting it via `dangerouslySetInnerHTML`.

## 2026-08-09 - [Token Leakage Prevention / SSRF]

**Learning:** Blindly appending authentication tokens (like Firebase ID tokens) to all requests made via a wrapper (like `apiFetch`) can leak tokens to third-party domains if an external URL is passed to the wrapper.

**Action:** When creating generic fetch wrappers that append auth headers, always validate that the target URL is first-party (e.g., matching the current origin) before appending the header. Ensure the validation safely handles SSR environments where `window` is undefined.
