'use server';
import { cookies } from 'next/headers';

export type Stats = {
  totalMembers: number;
  totalSports: number;
  totalActivities: number;
  totalTournaments: number;
  membersByMonth: { month: string; members: number }[];
  donations: { month: string; amount: number }[];
};

export async function getStats(): Promise<Stats> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${API_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return await response.json();
}
