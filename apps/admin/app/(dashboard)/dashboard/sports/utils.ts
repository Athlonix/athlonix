'use server';

import { cookies } from 'next/headers';

export type Sports = {
  id: number;
  name: string;
  description: string | null;
  min_players: number;
  max_players: number | null;
  image: string | null;
};

export async function getAllSports(): Promise<{ data: Sports[]; count: number }> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const response = await fetch(`${urlApi}/sports?all=true`);
  return response.json();
}

export async function addSport(formData: FormData): Promise<void> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const data = {
    name: formData.get('name'),
    description: formData.get('description') || null,
    min_players: Number(formData.get('min_players')),
    max_players: Number(formData.get('max_players')) || null,
    image: formData.get('image') || null,
  };
  const token = cookies().get('access_token')?.value;
  await fetch(`${urlApi}/sports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteSport(id: number): Promise<void> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  await fetch(`${urlApi}/sports/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateSport(formData: FormData, id: number): Promise<void> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const data = {
    name: formData.get('name'),
    description: formData.get('description') || null,
    min_players: Number(formData.get('min_players')),
    max_players: Number(formData.get('max_players')) || null,
    image: formData.get('image') || null,
  };
  const token = cookies().get('access_token')?.value;
  await fetch(`${urlApi}/sports/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}
