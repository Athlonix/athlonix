'use server';
import { cookies } from 'next/headers';
import type { User } from './LoginForm';

export async function saveCookie(user: User, token: string): Promise<void> {
  cookies().set('user', JSON.stringify(user), { path: '/', secure: true, sameSite: 'strict' });
  cookies().set('access_token', token, { path: '/', secure: true, sameSite: 'strict' });
}

export async function returnUserId(): Promise<number | null> {
  const user = cookies().get('user')?.value;
  if (!user) {
    return null;
  }
  return JSON.parse(user).id;
}
