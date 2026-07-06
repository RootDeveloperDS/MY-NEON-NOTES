# 🌌 Neon Notes

<div align="center">

[![MIT License](https://img.shields.io/github/license/RootDeveloperDS/MY-NEON-NOTES?style=flat-square&color=blue)](https://github.com/RootDeveloperDS/MY-NEON-NOTES/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/RootDeveloperDS/MY-NEON-NOTES?style=flat-square&color=FFD700&logo=github)](https://github.com/RootDeveloperDS/MY-NEON-NOTES/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/RootDeveloperDS/MY-NEON-NOTES?style=flat-square&color=8c52ff&logo=github)](https://github.com/RootDeveloperDS/MY-NEON-NOTES/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/RootDeveloperDS/MY-NEON-NOTES?style=flat-square&color=FF4B4B)](https://github.com/RootDeveloperDS/MY-NEON-NOTES/issues)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)

*A zero-trust, cyberpunk-inspired cloud notebook built for developers using shared computers.*

</div>

<br />

![Neon Notes Dashboard](https://raw.githubusercontent.com/RootDeveloperDS/CDN/refs/heads/main/neonnotes/dashboard-v2.png)

---

## 🌐 Live Demo

**[Try Neon Notes Live](https://neon-notes.vercel.app/)**

---

## ✨ Why Neon Notes?

Unlike traditional note-taking apps, Neon Notes is designed around public computer security.

✔ **Zero-trust session model**  
✔ **Fast code snippet workflow**  
✔ **Auto logout protection**  
✔ **Cloud synchronization**  
✔ **Developer-first interface**  
✔ **Futuristic cyberpunk design**

---

## 💡 Design Philosophy

Neon Notes is built around one principle:

*"Your primary account should never be the price you pay for quickly saving code."*

The application assumes every shared computer is untrusted and prioritizes secure, frictionless note-taking for developers.

---

## 🚀 Features

- **Secure isolated login flow** for shared/public systems
- **Aggressive auto-logout** after inactivity
- **Dual-session authentication** for public vs trusted devices with secure custom token handoff
- **Smart code-first editor behavior** for quick snippet handling
- **Auto-detect syntax highlighting** supporting 10+ programming languages powered by a robust code classifier
- **Public Note Sharing Architecture** with standalone read-only viewers and real-time dashboard sync
- **Global Search Shortcut** (Ctrl/Cmd + K) with transition animations
- **Multi-theme support** including Cyberpunk and System preferences
- **Responsive UI** optimized for both desktop and mobile layouts
- **Real-time cloud-backed notes** with Firebase integration

---

## 🛡 Security

- Zero-trust authentication
- Public computer mode
- Trusted device mode
- Session isolation
- Idle timeout
- Firebase Authentication
- Firestore Security Rules

---

## 📸 Screenshots


- **Login Page**: ![Login Screen](https://raw.githubusercontent.com/RootDeveloperDS/CDN/refs/heads/main/neonnotes/login-page-v11.1.png)
- **Dashboard**: ![Dashboard](https://raw.githubusercontent.com/RootDeveloperDS/CDN/refs/heads/main/neonnotes/dashboard-v2.png)
- **Note Editor**: ![Note Editor](https://raw.githubusercontent.com/RootDeveloperDS/CDN/refs/heads/main/neonnotes/note-editor-v11.1.png)
- **Mobile View**: ![Mobile View](https://raw.githubusercontent.com/RootDeveloperDS/CDN/refs/heads/main/neonnotes/mobile-view-v11.1.jpg)
- **Syntax Highlighting**: ![Syntax Highlighting](https://raw.githubusercontent.com/RootDeveloperDS/CDN/refs/heads/main/neonnotes/syntax-highlighting-v11.1.png)
- **Settings**: ![Settings](https://raw.githubusercontent.com/RootDeveloperDS/CDN/refs/heads/main/neonnotes/settings-v11.1.png)

---

## 🏗 Architecture

```text
Browser
   │
   ▼
Next.js
   │
   ▼
Firebase Authentication
   │
   ▼
Firestore
```

---

## 🚧 Roadmap

- [x] Authentication & Custom Token Security
- [x] Cloud Sync
- [x] Heuristic Code Classifier & Highlighting (10+ Languages)
- [x] Mobile Responsive Optimization
- [x] Keyboard Shortcuts (Ctrl/Cmd + K Global Search)
- [x] Public Note Sharing Architecture (v11.0)

**Upcoming**
- [ ] Markdown Preview
- [ ] Folder Organization
- [ ] File Attachments
- [ ] AI Note Summaries
- [ ] Offline Mode (PWA)
- [ ] Version History

---

## 1) The Origin & Motive

Neon Notes exists to solve a real security and UX problem in college computer labs.

Students often need to save programming code quickly, but logging into a **primary Google/Gmail account on shared public hardware** is risky and inefficient.

Neon Notes fixes this by offering:
- an **isolated, low-risk login boundary**
- a **fast note workspace** for coding sessions
- a practical way to save snippets instantly without exposing primary accounts

---

## 2) Core Use Cases

### 🔐 Primary
- A secure vault for saving, formatting, and copying programming code during lab sessions.
- Optimized for quick save → quick edit → quick copy workflow.

### 📝 Secondary
- A responsive general notepad for text notes, tasks, reminders, and quick thoughts.
- Accessible from any device with a clean and consistent experience.

---

## 3) Latest Production Updates (Changelog)

### Version 11.0 (July 6, 2026)
*Engineered a comprehensive architectural upgrade introducing public note sharing through standalone read-only viewers and real-time state synchronization. Refactored the authentication engine to deploy secure custom token verification, eliminating unsecured UID parameter queries and mitigating inactive session memory leaks. Polished application UX with custom Tailwind dark-mode theme selectors, interactive global search telemetry, and a multi-language heuristic classifier.*

* **Note Sharing & Public Access**: Created `src/app/shared/[id]/page.tsx` routing for public, unauthenticated read-only access to specific notes. Modified components to ingest, mutate, and render the optional `isPublic` flag. Enhanced `NotesDashboard.tsx` to reactively capture and update the viewer panel state. Upgraded asynchronous clipboard operations with robust error handling.
* **Heuristic Code Classifier & Highlighting Engine**: Developed custom regex heuristics mapping 10 programming languages. Optimized regex match boundaries for global namespaces to eliminate false-positives. Configured code fence parser regex to correctly process special character language tags (e.g., C++). Integrated `prism-c` for rich syntax highlighting in `NoteCodeBlock.tsx` and `NoteModal.tsx`.
* **Authentication & Session Persistence**: Integrated secure token handoff backend endpoint (`/api/verify_uid_return_customtoken_for_neon_notes`). Engineered dynamic token updates in `api-client.ts`, replacing legacy token management. Sandboxed `sessionStorage` accesses to prevent incognito script crashes and resolved active auth listener memory leaks in the URL authentication lifecycle.
* **Theme Engine & UI/UX Optimizations**: Decoupled legacy theme code into a centralized `theme-provider.tsx`. Configured Tailwind custom selectors to support class-based dark overrides (`.legacy`, `.cyberpunk`). Developed a customizable settings dialog with fallback modes. Added visual polish to toast notifications (`backdrop-blur-md`, top-center positioning, `2500ms` auto-dismiss) and embedded `Ctrl/Cmd + K` search focus hooks.
* **Bug Fixes & Stability**: Fixed `activeUid` updates in `use-auth.tsx` for custom token logins to prevent dashboard sync issues. Pruned deprecated package `fluorite`. Purged unused import references and dead code across components.

### Aggressive Auto-Logout
- Client-side idle detection now destroys the session after **15 minutes** of inactivity.
- Helps protect forgotten sessions on lab computers.

### Dual-Session Authentication
- Dynamic token routing based on trust level:
  - **Default:** temporary `sessionStorage` for shared/public devices
  - **Optional:** persistent `localStorage` / cookie session when **Trust this device** is enabled
- Supports a zero-trust default without hurting personal-device usability.

### Auto-Detect Code Highlighting
- Heuristic classifier auto-detects **JavaScript**, **TypeScript**, **Python**, **C++**, **Java**, **C#**, **Go**, **Rust**, **PHP**, and **Ruby**.
- Applies read-only syntax highlighting without heavy editor-library overhead.

---

## 4) Tech Stack & Production Practices

### Core Stack
- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, ShadCN UI
- **Backend:** Firebase Authentication, Firestore

### Production Practices
- **Zero-trust security mindset** for shared-machine environments
- **Strict session lifecycle management** with inactivity kill switch
- **Performance-focused rendering** in React/Next.js
- **Lean client behavior** to keep UX fast and predictable

---

## ⚙️ Setup & Local Development

### Prerequisites
- Node.js (18+ recommended)
- npm

### 1. Clone
```bash
git clone https://github.com/RootDeveloperDS/MY-NEON-NOTES.git
cd MY-NEON-NOTES
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Run development server
```bash
npm run dev
```

Open: **http://localhost:3000**

### Useful scripts
```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

---

## 🧭 Project Structure

```text
MY-NEON-NOTES/
├─ public/                 # Static assets
├─ src/
│  ├─ app/                 # Next.js App Router pages/layouts
│  ├─ components/          # Reusable UI + feature components
│  ├─ lib/                 # Shared utilities (including Firebase setup)
│  └─ ai/                  # AI/Genkit related modules
├─ README.md
├─ package.json
└─ next.config.ts
```

---

## 🌍 Open Source

Neon Notes is an open-source project.  
You can use it, improve it, and adapt it for your own workflows.

---

## 🤝 Contributions Welcome

Contributions are welcome and appreciated.

1. Fork the repository
2. Create your branch (`feature/your-feature-name`)
3. Commit your changes
4. Open a Pull Request with clear context

Please keep changes focused, tested, and easy to review.

---

## 📜 License

MIT License

---

## ❤️ Credits

Made with ❤️ by **rootdeveloper — Devansh Sharma**.
