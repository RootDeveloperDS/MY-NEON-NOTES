## 2026-08-18 - [URL Parameter Injection]

**Learning:** Directly embedding unencoded client-provided variables into API URLs (e.g., `?uid=${urlUid}`) allows malicious actors to inject arbitrary query parameters.

**Action:** Always wrap dynamic query parameters with `encodeURIComponent` before constructing fetch URLs to prevent parameter injection attacks.

## 2026-08-18 - [IP Spoofing Prevention]

**Learning:** Relying on client-provided IP addresses in API payloads (e.g., for analytics or notifications) allows IP spoofing by malicious actors.

**Action:** Always prioritize server-detected IP addresses extracted from HTTP headers like `x-forwarded-for` or `x-real-ip` over client-provided values in API routes.
