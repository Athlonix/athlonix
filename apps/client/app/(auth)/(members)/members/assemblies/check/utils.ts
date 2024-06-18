'use server';
import { cookies } from 'next/headers';

export async function confirmMemberPresence(code: string): Promise<boolean> {
  const user = cookies().get('user');
  if (!user) {
    return false;
  }
  const token = cookies().get('access_token')?.value;
  const urlApi = process.env.ATHLONIX_API_URL;

  const res = await fetch(`${urlApi}/assemblies/check-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  return res.ok;
}

export async function checkIfMemberIsConfirmed(code: string): Promise<boolean> {
  const user = cookies().get('user');
  if (!user) {
    return false;
  }
  const token = cookies().get('access_token')?.value;
  const urlApi = process.env.ATHLONIX_API_URL;

  const res = await fetch(`${urlApi}/assemblies/check-confirm-member`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  const data = (await res.json()) as { confirmed: boolean } | { error: string; status: number };
  if ('error' in data) {
    throw new Error(data.error);
  }
  return data.confirmed;
}
