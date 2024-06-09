'use client';

import { LogoutUser } from '@/app/lib/utils';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export function Logout(): JSX.Element {
  return (
    <Link href="/" onClick={() => LogoutUser()} className="cursor-pointer">
      <LogOut color="#bf0808" size={24} />
    </Link>
  );
}
