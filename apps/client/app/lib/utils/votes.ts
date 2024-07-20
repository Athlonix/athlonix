'use server';
import { cookies } from 'next/headers';
import type { Assembly, FullPoll } from '../type/Votes';

const urlApi = process.env.ATHLONIX_API_URL;

export async function getAllVotes(): Promise<{ data: { data: FullPoll[]; count: number }; status: number }> {
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${urlApi}/polls`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-cache',
  });

  return { data: await response.json(), status: response.status };
}

export async function getVote(id: number): Promise<{ data: FullPoll; status: number }> {
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${urlApi}/polls/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-cache',
  });

  return { data: await response.json(), status: response.status };
}

export async function getUserVoted(): Promise<{ data: { voted: number[] }; status: number }> {
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${urlApi}/polls/voted`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-cache',
  });

  return { data: await response.json(), status: response.status };
}

export async function voteToPoll(
  id: number,
  options: number[],
): Promise<{ data: { message: string }; status: number }> {
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${urlApi}/polls/${id}/vote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ options }),
  });

  return { data: await response.json(), status: response.status };
}

export async function getAssembly(id: number): Promise<{ data: Assembly; status: number }> {
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${urlApi}/assemblies/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-cache',
  });

  return { data: await response.json(), status: response.status };
}
