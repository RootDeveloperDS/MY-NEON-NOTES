## 2026-08-08 - [Protocol-Relative URL Bypass]

**Learning:** Checking if a URL is relative using `startsWith('/')` is an insecure boundary check because protocol-relative URLs (e.g., `//attacker.com`) can bypass it, potentially leaking sensitive authorization headers to third-party domains.

**Action:** When validating if an API URL is first-party (e.g., to conditionally append Auth tokens), always construct a `URL` object using a base origin (like `new URL(urlString, window.location.origin)`) and explicitly check the `.origin` property against the current environment.
