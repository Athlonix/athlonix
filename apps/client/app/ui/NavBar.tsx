'use client';

import { Button } from '@repo/ui/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type React from 'react';

interface LinkProp {
  name: string;
  href: string;
}

interface NavBarProps {
  links: LinkProp[];
}

function LogoutUser() {
  const urlApi = process.env.ATHLONIX_API_URL;
  fetch(`${urlApi}/auth/logout`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      response.json();
      if (response.status === 200) {
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    })
    .catch((error) => console.log(error));
}

export const NavBar: React.FC<NavBarProps> = ({ links }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(user !== null);
  }, []);

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
    <nav className="flex items-center justify-center mb-8">
      <div className="w-full flex items-center justify-between">
        <ul className="flex gap-4">{navBarElements}</ul>
        {!isAuthenticated ? (
          <div>
            <Button asChild className="w-[120px] mr-4">
              <Link href="signup">S'inscrire</Link>
            </Button>
            <Button asChild className="w-[120px]">
              <Link href="login">Se connecter</Link>
            </Button>
          </div>
        ) : (
          <Button className="w-[120px]">
            <Link href={''} onClick={() => LogoutUser()}>
              Se déconnecter
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
};
