## 2026-08-17 - [URL Parameter Injection]\n\n**Learning:** Directly embedding unencoded client-provided variables into API URLs (e.g., `?uid=${urlUid}`) allows malicious actors to inject arbitrary query parameters.\n\n**Action:** Always wrap dynamic query parameters with `encodeURIComponent` before constructing fetch URLs to prevent parameter injection attacks.


## 2026-08-17 - [IP Spoofing Mitigation]

**Learning:** Trusting a user-provided IP in the payload before checking server-provided HTTP headers allows IP spoofing and bypasses tracking.

**Action:** Always prioritize the server-detected IP address (e.g., from `x-forwarded-for` or `x-real-ip`) over any client-provided `ip` when logging or processing requests.
