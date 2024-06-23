'use client';

import { type User, checkSubscriptionStatus, deleteUserCookie, getUserFromCookie } from '@/app/lib/utils';
import { ModeToggle } from '@repo/ui/components/toggleTheme';
import { Avatar, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
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
        deleteUserCookie();
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
      const user = await getUserFromCookie();
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      }
      if (user && (await checkSubscriptionStatus(user)) === 'approved') {
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
    <nav className="w-full px-4 py-4 mb-8 relative">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="absolute left-0">
          <Link href="/" className="flex items-center">
            <Image src="/favicon.ico" alt="Accueil" width="32" height="32" />
            <h2 className="ml-2 font-bold">Athlonix</h2>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <ul className="flex gap-4 ml-40 mr-4">{navBarElements}</ul>
        </div>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Button asChild variant="ghost">
                <Link href="signup">Devenir membre</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="login">Se connecter</Link>
              </Button>
            </>
          ) : (
            <>
              <Link href="/account">
                <Avatar>
                  <AvatarFallback className="bg-slate-400">{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              {user !== undefined && subscription && (
                <Button className="bg-[#1e293b] text-white" asChild>
                  <Link href="/members">Espace membre</Link>
                </Button>
              )}
              <Button variant="ghost" onClick={() => LogoutUser()} className="hover:bg-slate-400 p-2">
                <LogOut color="#bf0808" size={24} />
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};
