import { ModeToggle } from '@repo/ui/components/toggleTheme';
import '@repo/ui/globals.css';
import { BookUser, FileSearch, Flame, Home, LineChart, MessageSquareMore, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Flame className="h-6 w-6 text-primary" />
              <span className="">Escape membre Athlonix</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/members"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Accueil
              </Link>
              <Link
                href="/members/activities"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Activités
              </Link>
              <Link
                href="/members/tournaments"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Trophy className="h-4 w-4" />
                Tournois
              </Link>
              <Link
                href="/members/chat"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <MessageSquareMore className="h-4 w-4" />
                Messagerie
              </Link>
              <Link
                href="/members/documents"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FileSearch className="h-4 w-4" />
                Documents
              </Link>
              <Link
                href="/members/votes"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Votes
              </Link>
              <Link
                href="/members/assemblies"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground"
              >
                <BookUser className="h-4 w-4" />
                Assemblée générale
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
        </header>
        {children}
      </div>
    </div>
  );
}
