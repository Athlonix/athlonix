'use server';

import type { Tournament } from '@/app/lib/type/Tournaments';
import { cookies } from 'next/headers';

const urlApi = process.env.ATHLONIX_API_URL;

export async function getTournament(
  page: number,
  searchTerm: string,
): Promise<{ data: { data: Tournament[]; count: number }; status: number }> {
  const queryParams = new URLSearchParams({
    skip: `${page - 1}`,
    take: '10',
    search: searchTerm,
  });

  const res = await fetch(`${urlApi}/tournaments?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function createTournament(formData: FormData): Promise<{ data: Tournament; status: number }> {
  const res = await fetch(`${urlApi}/tournaments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
    body: formData,
  });

  return { data: await res.json(), status: res.status };
}
