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

![Neon Notes Dashboard](https://raw.githubusercontent.com/RootDeveloperDS/CDN/refs/heads/main/neonnotes/dashboard-v1.png)

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
- **Dual-session authentication** for public vs trusted devices
- **Smart code-first editor behavior** for quick snippet handling
- **Auto-detect syntax highlighting** for C++, Python, and JavaScript
- **Responsive UI** for desktop and mobile use
- **Real-time cloud-backed notes** with Firebase

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

*(Replace with actual screenshot URLs when ready)*

- **Login Page**: `[Add Image]`
- **Dashboard**: ![Dashboard](https://raw.githubusercontent.com/RootDeveloperDS/CDN/refs/heads/main/neonnotes/dashboard-v1.png)
- **Note Editor**: `[Add Image]`
- **Mobile View**: `[Add Image]`
- **Syntax Highlighting**: `[Add Image]`
- **Settings**: `[Add Image]`

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

- [x] Authentication
- [x] Cloud Sync
- [x] Syntax Highlighting
- [x] Mobile Responsive

**Upcoming**
- [ ] Markdown Preview
- [ ] File Attachments
- [ ] Folder Organization
- [ ] AI Note Summaries
- [ ] Offline Mode (PWA)
- [ ] Tags & Search
- [ ] Version History
- [ ] Keyboard Shortcuts

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

### Aggressive Auto-Logout
- Client-side idle detection now destroys the session after **15 minutes** of inactivity.
- Helps protect forgotten sessions on lab computers.

### Dual-Session Authentication
- Dynamic token routing based on trust level:
  - **Default:** temporary `sessionStorage` for shared/public devices
  - **Optional:** persistent `localStorage` / cookie session when **Trust this device** is enabled
- Supports a zero-trust default without hurting personal-device usability.

### Auto-Detect Code Highlighting
- Debounce-wrapped regex engine auto-detects **C++**, **Python**, and **JavaScript**.
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
