import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import type React from 'react';

interface LinkProp {
  name: string;
  href: string;
}

interface NavBarProps {
  links: LinkProp[];
}

export const NavBar: React.FC<NavBarProps> = ({ links }) => {
  const navBarElements = links.map((link) => {
    return (
      <li key={link.name}>
        <Button className="font-semibold hover:bg-slate-200 hover:text-black text-lg" variant={'ghost'} asChild>
          <Link href={link.href}>{link.name}</Link>
        </Button>
      </li>
    );
  });

  return (
    <nav className="flex items-center justify-center mb-20">
      <div className="w-full flex items-center justify-between">
        <ul className="flex gap-4">{navBarElements}</ul>
        <Button className="w-[120px]">Login</Button>
      </div>
    </nav>
  );
};
