'use server';
import { cookies } from 'next/headers';
import type { User } from './LoginForm';

export async function saveCookie(user: User, token: string) {
  cookies().set('user', JSON.stringify(user), { path: '/', secure: true, sameSite: 'strict' });
  cookies().set('access_token', token, { path: '/', secure: true, sameSite: 'strict' });
}
