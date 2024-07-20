'use server';
import type { Tables } from '@repo/types';

export type Sport = Tables<'SPORTS'>;

export async function getSports(): Promise<{ data: Sport[]; count: number }> {
  const api_url = process.env.ATHLONIX_API_URL;
  if (!api_url) {
    throw new Error('ATHLONIX_API_URL is not defined');
  }
  const response = await fetch(`${api_url}/sports?all=true`, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des sports');
  }
  return await response.json();
}
