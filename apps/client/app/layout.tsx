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
  description: 'Site web de la société Athlonix',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body
        className={cn('min-h-screen bg-background font-sans antialiased flex flex-col items-center', fontSans.variable)}
      >
        {children}
      </body>
    </html>
  );
}
