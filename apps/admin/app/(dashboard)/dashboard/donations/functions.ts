'use server';
import { cookies } from 'next/headers';

export interface Donates {
  id: number;
  amount: number;
  receipt_url: string;
  created_at: string;
  id_user: number;
}

export async function getAllDonations(): Promise<{ data: Donates[]; count: number }> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${API_URL}/stripe/donations?all=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
      cache: 'no-cache',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  return await response.json();
}
