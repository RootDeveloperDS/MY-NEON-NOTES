## 2026-08-17 - [URL Parameter Injection]

**Learning:** Directly embedding unencoded client-provided variables into API URLs (e.g., `?uid=${urlUid}`) allows malicious actors to inject arbitrary query parameters.

**Action:** Always wrap dynamic query parameters with `encodeURIComponent` before constructing fetch URLs to prevent parameter injection attacks.
