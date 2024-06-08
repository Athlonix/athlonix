'use server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { User } from '../ui/LoginForm';

export async function saveCookie(user: User, token?: string): Promise<void> {
  cookies().set('user', JSON.stringify(user), { path: '/', secure: true, sameSite: 'strict' });
  if (token) {
    cookies().set('access_token', token, { path: '/', secure: true, sameSite: 'strict' });
  }
}

export async function deleteUserCookie(): Promise<void> {
  cookies().delete('user');
  cookies().delete('access_token');
}

export async function LogoutUser() {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  fetch(`${urlApi}/auth/logout`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      response.json();
      if (response.status === 200) {
        deleteUserCookie();
      }
    })
    .catch((error: Error) => console.error(error));
}

export async function returnUser(): Promise<User | null> {
  const user = cookies().get('user')?.value;
  return user ? JSON.parse(user) : null;
}
