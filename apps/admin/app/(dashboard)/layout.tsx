import '@repo/ui/globals.css';
import CollapsedNav from '@/app/ui/CollapsedNav';
import { ModeToggle } from '@repo/ui/components/toggleTheme';
import { cn } from '@repo/ui/lib/utils';
import { Toaster } from '@ui/components/ui/sonner';
import {
  Building,
  Dumbbell,
  File,
  Flame,
  Home,
  LandPlot,
  Landmark,
  Newspaper,
  PencilRuler,
  Trophy,
  Users,
  Vote,
} from 'lucide-react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import Link from 'next/link';
import { Logout } from './logout';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Dashboard',
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
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <Flame className="h-6 w-6" />
                  <span className="">Athlonix</span>
                </Link>
                <div className="ml-auto">
                  <Logout />
                </div>
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Home className="h-4 w-4" />
                    Acceuil
                  </Link>
                  <Link
                    href="/dashboard/users"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Users className="h-4 w-4" />
                    Utilisateurs
                  </Link>
                  <Link
                    href="/dashboard/documents"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <File className="h-4 w-4" />
                    Documents
                  </Link>
                  <Link
                    href="/dashboard/posts"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Newspaper className="h-4 w-4" />
                    Articles
                  </Link>
                  <Link
                    href="/dashboard/sports"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Dumbbell className="h-4 w-4" />
                    Sports
                  </Link>
                  <Link
                    href="/dashboard/activities"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <LandPlot className="h-4 w-4" />
                    Activités
                  </Link>
                  <Link
                    href="/dashboard/tournaments"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Trophy className="h-4 w-4" />
                    Tournois
                  </Link>
                  <Link
                    href="/dashboard/donations"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Landmark className="h-4 w-4" />
                    Donations
                  </Link>
                  <Link
                    href="/dashboard/votes"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Vote className="h-4 w-4" />
                    Votes
                  </Link>
                  <Link
                    href="/dashboard/addresses"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Building className="h-4 w-4" />
                    Adresses
                  </Link>
                  <Link
                    href="/dashboard/materials"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <PencilRuler className="h-4 w-4" />
                    Matériaux & Fournitures
                  </Link>
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
              <div className="flex items-center gap-4 ml-auto">
                <ModeToggle />
              </div>
              <CollapsedNav />
            </header>
            {children}
          </div>
        </div>
        <Toaster richColors closeButton visibleToasts={1} />
      </body>
    </html>
  );
}
