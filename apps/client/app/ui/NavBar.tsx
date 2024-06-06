'use client';

import { Avatar, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type React from 'react';
import { type User, checkSubscription, returnUser } from '../lib/user/utils';

interface LinkProp {
  name: string;
  href: string;
}

interface NavBarProps {
  links: LinkProp[];
}

function LogoutUser() {
  const urlApi = process.env.NEXT_PUBLIC_API_URL;
  fetch(`${urlApi}/auth/logout`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
    .then((response) => {
      response.json();
      if (response.status === 200) {
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    })
    .catch((error: Error) => console.error(error));
}

export const NavBar: React.FC<NavBarProps> = ({ links }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<boolean>(false);

  useEffect(() => {
    async function checkUser() {
      const user = await returnUser();
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      }
      if (user && (await checkSubscription(user)) === 'approved') {
        setSubscription(true);
      }
    }
    checkUser();
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
      <div className="absolute top-2 left-0 mt-4 ml-4">
        <Link href="/" className="flex items-center">
          <Image src="/favicon.ico" alt="Accueil" width="32" height="32" />
          <h2 className="ml-2 font-bold">Athlonix</h2>
        </Link>
      </div>
      <div className="w-full flex items-center justify-between">
        <ul className="flex gap-4">{navBarElements}</ul>
        {!isAuthenticated ? (
          <div>
            <Button asChild className="w-[140px] mr-4">
              <Link href="signup">Devenir membre</Link>
            </Button>
            <Button asChild className="w-[120px]">
              <Link href="login">Se connecter</Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link href="/account">
              <Avatar>
                <AvatarFallback className="bg-slate-400">{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            {user !== undefined && subscription && (
              <Button className="w-[120px]" asChild>
                <Link href="/members">Espace membre</Link>
              </Button>
            )}
            <Button className="w-[120px] bg-red-900">
              <Link href={''} onClick={() => LogoutUser()}>
                Se déconnecter
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
