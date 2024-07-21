'use server';
import { cookies } from 'next/headers';

export async function sendProposal(proposal: string): Promise<boolean> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  if (!token || !proposal || !API_URL) {
    return false;
  }
  const response = await fetch(`${API_URL}/proposals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ proposal }),
  });
  if (!response.ok) {
    throw new Error('Failed to send proposal');
  }
  return true;
}
