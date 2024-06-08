'use server';
import { cookies } from 'next/headers';

export type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  id_referer: number | null;
  id_auth: string | null;
  date_validity: string | null;
  created_at: string;
  deleted_at: string | null;
  invoice: string | null;
  subscription: string | null;
  status: 'applied' | 'approved' | 'rejected' | null;
  roles: { id: number; name: string }[];
};

// Always up to date but less performant
export async function getUserFromDB(): Promise<User> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  const user = (await response.json()) as User;
  // Save user in cookie for faster access
  cookies().set('user', JSON.stringify(user), { path: '/', secure: true, sameSite: 'strict' });
  return user;
}

// Faster but might be outdated
export async function getUserFromCookie(): Promise<User | null> {
  const user = cookies().get('user')?.value;
  return user ? JSON.parse(user) : null;
}

export async function checkSubscriptionStatus(user: User): Promise<'applied' | 'approved' | 'rejected' | null> {
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

export async function saveUserCookie(user: User, token?: string): Promise<void> {
  cookies().set('user', JSON.stringify(user), { path: '/', secure: true, sameSite: 'strict' });
  if (token) {
    cookies().set('access_token', token, { path: '/', secure: true, sameSite: 'strict' });
  }
}

export async function deleteUserCookie(): Promise<void> {
  cookies().delete('user');
  cookies().delete('access_token');
}

export async function updateUserInformation(
  id: number,
  username: string,
  first_name: string,
  last_name: string,
): Promise<User | null> {
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
      return data.user;
    })
    .catch((error: Error) => console.error(error));

  return null;
}
