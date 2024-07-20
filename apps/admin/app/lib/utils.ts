'use server';
import type { User } from '@/app/lib/type/User';
import { cookies } from 'next/headers';

export async function saveCookie(user: User, token?: string): Promise<void> {
  cookies().set('user', JSON.stringify(user), { path: '/', secure: true, sameSite: 'strict', maxAge: 604800 });
  if (token) {
    cookies().set('access_token', token, { path: '/', secure: true, sameSite: 'strict', maxAge: 604800 });
  }
}

export async function deleteUserCookie(): Promise<void> {
  cookies().delete('user');
  cookies().delete('access_token');
}

export async function LogoutUser(): Promise<void> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  fetch(`${urlApi}/auth/logout`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        await deleteUserCookie();
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    })
    .catch((error: Error) => console.error(error));
}

export async function getAllMembersForAssembly(): Promise<{ data: User[]; count: number }> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${urlApi}/users?all=true&role=MEMBER`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch members');
  }
  const data = (await response.json()) as { data: User[]; count: number };
  const members = data.data.filter(
    (member: User) => member.date_validity && new Date(member.date_validity) > new Date(),
  );
  return {
    data: members,
    count: data.count,
  };
}

export async function returnUser(): Promise<User | null> {
  const user = cookies().get('user')?.value;
  return user ? JSON.parse(user) : null;
}
