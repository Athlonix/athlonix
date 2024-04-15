import { navLinks } from '@/app/lib/navlinks';
import { NavBar } from '@/app/ui/NavBar';
import { Button } from '@repo/ui/components/ui/button';

export default function Page(): JSX.Element {
  return (
    <>
      <NavBar links={navLinks} />
      <main className="flex flex-col items-center gap-y-8 py-6">blog</main>
    </>
  );
}
