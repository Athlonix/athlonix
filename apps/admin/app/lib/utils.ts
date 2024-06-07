'use server';
import { cookies } from 'next/headers';
import type { User } from '../ui/LoginForm';

export async function saveCookie(user: User, token?: string): Promise<void> {
  cookies().set('user', JSON.stringify(user), { path: '/', secure: true, sameSite: 'strict' });
  if (token) {
    cookies().set('access_token', token, { path: '/', secure: true, sameSite: 'strict' });
  }
}

export async function returnUser(): Promise<User | null> {
  const user = cookies().get('user')?.value;
  return user ? JSON.parse(user) : null;
}
