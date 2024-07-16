'use server';
import { cookies } from 'next/headers';

export type Address = {
  id: number;
  road: string;
  postal_code: string;
  complement: string | null;
  city: string;
  number: number;
  name: string | null;
  id_lease: number | null;
};

export async function getAdresses(): Promise<{ data: Address[]; count: number }> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const res = await fetch(`${urlApi}/addresses?all=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Addresses not found');
  }
  return await res.json();
}

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
