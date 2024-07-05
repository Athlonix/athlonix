'use server';

import type { FullPoll } from '@/app/lib/type/Votes';
import { cookies } from 'next/headers';

const urlApi = process.env.ATHLONIX_API_URL;

export async function getPolls(
  page: number,
  searchTerm: string,
): Promise<{ data: { data: FullPoll[]; count: number }; status: number }> {
  const queryParams = new URLSearchParams({
    skip: `${page - 1}`,
    take: '10',
    search: searchTerm,
  });

  const res = await fetch(`${urlApi}/polls?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function getOnePoll(id: number, hidden: boolean): Promise<{ data: FullPoll; status: number }> {
  const queryParams = new URLSearchParams({
    hidden: `${hidden}`,
  });

  const res = await fetch(`${urlApi}/polls/${id}?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return { data: await res.json(), status: res.status };
}
