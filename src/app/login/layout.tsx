import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Access Protocol | Neon Notes',
  description: 'Sign in or create a secure account to access your encrypted Neon Notes workspace.',
  alternates: {
    canonical: 'https://neon-notes.vercel.app/login',
  },
  openGraph: {
    title: 'Sign In | Neon Notes',
    description: 'Sign in or create a secure account to access your encrypted Neon Notes workspace.',
    url: 'https://neon-notes.vercel.app/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
