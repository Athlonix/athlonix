import { Button } from '@repo/ui/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/ui/sheet';
import {
  Building,
  Dumbbell,
  File,
  Home,
  LandPlot,
  Landmark,
  Menu,
  Newspaper,
  Package2,
  PencilRuler,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';

function CollapsedNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Athlonix</span>
          </Link>
          <Link
            href="/dashboard"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Acceuil
          </Link>
          <Link
            href="/dasboard/users"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
          >
            <Users className="h-5 w-5" />
            Utilisateurs
          </Link>
          <Link
            href="/dashboard/documents"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <File className="h-5 w-5" />
            Documents
          </Link>
          <Link
            href="/dashboard/posts"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <Newspaper className="h-5 w-5" />
            Articles
          </Link>
          <Link
            href="/dashboard/sports"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <Dumbbell className="h-5 w-5" />
            Sports
          </Link>
          <Link
            href="/dashboard/activities"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <LandPlot className="h-4 w-4" />
            Activités
          </Link>
          <Link
            href="/dashboard/tournaments"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <Trophy className="h-4 w-4" />
            Tournois
          </Link>
          <Link
            href="/dashboard/votes"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <Landmark className="h-4 w-4" />
            Donations
          </Link>
          <Link
            href="/dashboard/addresses"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <Building className="h-4 w-4" />
            Adresses
          </Link>
          <Link
            href="/dashboard/materials"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <PencilRuler className="h-4 w-4" />
            Fournitures
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default CollapsedNav;
