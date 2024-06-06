'use server';
import { cookies } from 'next/headers';
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  subscription: string | null;
  status: 'applied' | 'approved' | 'rejected' | null;
  date_validity: string | null;
  roles: { id: number; name: string }[];
}

export async function getUserInfo(): Promise<User> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  const user = (await response.json()) as User;
  cookies().set('user', JSON.stringify(user), { path: '/', secure: true, sameSite: 'strict' });
  return user;
}

export async function checkSubscription(user: User): Promise<'applied' | 'approved' | 'rejected' | null> {
  if (user.status === null) {
    return null;
  }

  if (user.status === 'applied') {
    return 'applied';
  }

  if (user.status === 'rejected') {
    return 'rejected';
  }

  if (user.date_validity === null || new Date(user.date_validity) < new Date()) {
    return null;
  }

  return 'approved';
}

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

export async function updateUserInformation(id: number, username: string, first_name: string, last_name: string) {
  const token = cookies().get('access_token')?.value;
  const url = process.env.ATHLONIX_API_URL;
  fetch(`${url}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      first_name,
      last_name,
    }),
  })
    .then(async (response) => await response.json())
    .then((data: { user: User }) => {
      if ('error' in data) {
        return;
      }
      cookies().set('user', JSON.stringify(data.user), { path: '/', secure: true, sameSite: 'strict' });
    })
    .catch((error: Error) => console.error(error));
}
