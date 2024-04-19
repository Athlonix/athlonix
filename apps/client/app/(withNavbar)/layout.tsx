import '@repo/ui/globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { navLinks } from '../lib/navlinks';
import { NavBar } from '../ui/NavBar';

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
    <>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 w-full max-w-7xl">
        <header>
          <NavBar links={navLinks} />
        </header>
        {children}
      </div>
    </>
  );
}
