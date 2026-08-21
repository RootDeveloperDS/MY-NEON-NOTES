## 2026-08-21 - [URL Parameter Injection]

**Learning:** Directly interpolating client-provided variables (like `urlUid`) into API URLs (`?uid=${urlUid}`) opens the door for URL parameter injection attacks.

**Action:** Always wrap dynamic URL parameters with `encodeURIComponent` before embedding them into request URLs.

## 2026-08-21 - [IP Spoofing Prevention]

**Learning:** Relying on client-provided IP addresses in API payloads (like `ip`) allows attackers to spoof their origin easily.

**Action:** Always prioritize the server-detected IP address (extracted from `x-forwarded-for` or `x-real-ip` headers) over client-provided values.
