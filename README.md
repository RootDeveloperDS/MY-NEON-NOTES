# 🌃 NEON NOTES

Welcome to **Neon Notes**, a futuristic online notes saver designed with a sleek, cyberpunk-inspired aesthetic. This application provides a secure, real-time environment for you to create, manage, and access your notes from anywhere.

<br />

![Neon Notes Dashboard](https://i.imgur.com/ggyaWOM.png)

---

## ✨ Features

- **Secure Authentication**: Sign up and log in securely using your Email & Password or with a single click via Google OAuth.
- **Dual Login Modes**:
    - **Standard Auth**: Normal user login for a persistent, secure session.
    - **URL UID Login**: A special mode for seamless integration with external services (like VISAR Edge), allowing users to access notes via a verified URL parameter (`?UID=<your_uid>`).
- **Real-time Note Sync**: Built on Google Firestore, all your notes are saved and synchronized in real-time across all your sessions.
- **Full CRUD Functionality**: Create new notes, edit existing ones, and delete what you no longer need through a clean and intuitive interface.
- **Futuristic UI**: A responsive and immersive user interface built with Tailwind CSS and ShadCN UI, featuring a distinct neon color palette and custom fonts.
- **Instant Search**: Quickly find the notes you're looking for with a responsive search bar that filters your notes as you type.
- **System Status Check**: A built-in utility page (`/status`) to diagnose and troubleshoot your connection to Firebase services.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Database**: [Google Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Getting Started

To run Neon Notes on your local machine, follow these steps.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 2. Clone the Repository

First, clone the project repository to your local machine.

```bash
git clone https://github.com/your-username/my-neon-notes.git
cd my-neon-notes
```

### 3. Install Dependencies

Install all the required packages for the project.

```bash
npm install
```

### 4. Configure Firebase

This project requires a Firebase project to handle authentication and the database.

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2.  **Create a Web App**: Inside your new project, create a new Web App and copy the `firebaseConfig` object.

3.  **Enable Firestore**: In the Firebase console, go to **Build > Firestore Database** and create a new database. Start in **test mode** for initial development (we will add security rules later).

4.  **Enable Authentication**:
    - Go to **Build > Authentication** and click "Get started".
    - In the "Sign-in method" tab, enable both **Email/Password** and **Google** providers.
    - Add your development domain (e.g., `localhost`) to the list of "Authorized domains".

5.  **Create Environment File**:
    - In the root of your project, create a file named `.env.local`.
    - Paste your Firebase config into it, formatting it as follows:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    ```

### 5. Add Firestore Security Rules

To ensure users can only access their own notes, update your Firestore rules:

1.  Go to the **Firestore Database** section in the Firebase Console.
2.  Click on the **Rules** tab.
3.  Replace the default rules with the following and click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 6. Create a Firestore Index

The application requires a composite index to filter and sort notes. Firebase will provide a one-click link to create this in your browser's developer console the first time you run the app and log in.

- **Open the app**, log in, and open the developer console.
- **Click the link** provided in the Firestore error message to automatically create the required index. The index creation will take a few minutes.

### 7. Run the Development Server

You are now ready to start the application!

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see Neon Notes live.

