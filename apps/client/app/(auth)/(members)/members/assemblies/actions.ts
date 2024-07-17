'use server';
import type { Tables } from '@repo/types';
import { cookies } from 'next/headers';

export type Address = Tables<'ADDRESSES'>;

type Assembly = {
  id: number;
  name: string;
  description: string | null;
  date: string;
  location: number | null;
  attendees: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  lawsuit: string | null;
  closed: boolean;
};

export async function getOneAddress(id: number): Promise<Address> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const res = await fetch(`${urlApi}/addresses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Address not found');
  }
  return await res.json();
}

export async function getAssembly(): Promise<{ assembly: Assembly; status: 'current' | 'upcoming' | 'past' } | null> {
  const user = cookies().get('user');
  if (!user) {
    return null;
  }
  const token = cookies().get('access_token')?.value;
  const urlApi = process.env.ATHLONIX_API_URL;

  const res = await fetch(`${urlApi}/assemblies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch assembly');
  }

  const data = (await res.json()) as { data: Assembly[] };
  if (data.data.length === 0) {
    return null;
  }

  const now = new Date();
  const assemblies = data.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentAssembly = assemblies.find((assembly) => {
    const assemblyDate = new Date(assembly.date);
    return assemblyDate <= now && !assembly.closed;
  });

  if (currentAssembly) {
    return { assembly: currentAssembly, status: 'current' };
  }

  const upcomingAssembly = assemblies.find((assembly) => new Date(assembly.date) > now);

  if (upcomingAssembly) {
    return { assembly: upcomingAssembly, status: 'upcoming' };
  }

  const lastAssembly = assemblies[0];
  if (!lastAssembly) {
    return null;
  }
  return { assembly: lastAssembly, status: 'past' };
}
