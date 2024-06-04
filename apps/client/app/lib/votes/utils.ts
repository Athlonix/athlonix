import type { Vote } from '../type/Votes';

export async function getAllVotes(): Promise<{ data: Vote[]; count: number }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/polls?all=true`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch votes');
  }
  return await response.json();
}
