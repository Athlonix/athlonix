import { ThemeProvider } from '@repo/ui/components/themes';
import { Toaster } from '@repo/ui/components/ui/sonner';
import '@repo/ui/globals.css';
import { cn } from '@repo/ui/lib/utils';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Athlonix',
  description: "Dashboard d'Athlonix",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="fr">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster richColors closeButton visibleToasts={1} />
      </body>
    </html>
  );
}
