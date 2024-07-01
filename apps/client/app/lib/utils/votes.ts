'use server';
import { cookies } from 'next/headers';
import type { Vote } from '../type/Votes';

const urlApi = process.env.ATHLONIX_API_URL;

export async function getAllVotes(): Promise<{ data: Vote[]; count: number }> {
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${urlApi}/polls?all=true`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch votes');
  }
  return await response.json();
}

export async function getVote(id: number): Promise<{ data: Vote; status: number }> {
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${urlApi}/polls/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-cache',
  });

  return { data: await response.json(), status: response.status };
}

export async function getUserVoted(id: number): Promise<{ data: { voted: boolean }; status: number }> {
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${urlApi}/polls/${id}/voted`, {
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
