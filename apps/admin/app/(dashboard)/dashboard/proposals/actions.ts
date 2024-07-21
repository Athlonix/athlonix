'use server';
import { cookies } from 'next/headers';

export type Proposal = {
  id: number;
  proposal: string;
  id_user: number;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
  } | null;
};

export async function getAllProposals(): Promise<{ data: Proposal[]; count: number }> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  if (!token || !API_URL) {
    return { data: [], count: 0 };
  }
  const response = await fetch(`${API_URL}/proposals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to get proposals');
  }
  return await response.json();
}

export async function deleteProposal(id: number): Promise<void> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  if (!token || !API_URL) {
    throw new Error('Missing data');
  }
  const response = await fetch(`${API_URL}/proposals/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete proposal');
  }
}
