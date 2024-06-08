import type { User } from '@/app/lib/utils';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = cookies().get('user')?.value;
  if (!user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const userObj = JSON.parse(user) as User;
  if (!userObj.roles.some((role: { id: number }) => role.id === 5)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (userObj.status !== 'approved') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (userObj.date_validity && new Date(userObj.date_validity) < new Date()) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/members/:path*',
};
