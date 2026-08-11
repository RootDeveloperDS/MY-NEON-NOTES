import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { jsonLd, softwareApplicationJsonLd, websiteJsonLd, faqJsonLd, breadcrumbJsonLd } from './metadata';
import { Orbitron, Source_Code_Pro, Roboto } from 'next/font/google';

export { metadata } from './metadata';

// Bolt Optimization: Replace external Google Fonts with next/font/google for zero-layout-shift and self-hosted fonts
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-orbitron',
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-source-code-pro',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {[jsonLd, websiteJsonLd, softwareApplicationJsonLd, faqJsonLd, breadcrumbJsonLd].map((schema, index) => (
          <script
            key={`structured-data-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003C') }}
          />
        ))}
      </head>
      <body className={`${orbitron.variable} ${sourceCodePro.variable} ${roboto.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="cyberpunk"
          enableSystem={false}
          themes={['legacy', 'cyberpunk']}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
