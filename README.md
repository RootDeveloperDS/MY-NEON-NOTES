# 🌌 Neon Notes

**Neon Notes** is a futuristic, note-taking web app designed with a sleek, cyberpunk-inspired aesthetic & dark neon-cyan glassmorphism UI.  
It is built for **secure coding sessions**, **fast note capture**, and **cross-device access**.

<br />

![Neon Notes Dashboard](https://i.imgur.com/ggyaWOM.png)

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
Create `/home/runner/work/MY-NEON-NOTES/MY-NEON-NOTES/.env.local`:

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

Open: **http://localhost:9002**

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

## ❤️ Credits

Made with ❤️ by **rootdeveloper — Devansh Sharma**.
