import { navLinks } from '@/app/lib/navlinks';
import { NavBar } from '@/app/ui/NavBar';
import { PostFiltering } from '@/app/ui/components/PostFiltering';
import { SearchBar } from '@/app/ui/components/SearchBar';
import { AutoComplete } from '@repo/ui/components/ui/AutoComplete';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';

export default function Page(): JSX.Element {
  return (
    <>
      <NavBar links={navLinks} />
      <main className="flex flex-col items-center gap-y-8 py-6">blog</main>
      <PostFiltering />
      <SearchBar />
    </>
  );
}
