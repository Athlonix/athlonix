'use server';
import { cookies } from 'next/headers';

export type Role =
  | 'PRESIDENT'
  | 'VICE_PRESIDENT'
  | 'SECRETARY'
  | 'TREASURER'
  | 'REDACTOR'
  | 'PROJECT_MANAGER'
  | 'COMMUNICATION_OFFICER';

export interface Hierarchy {
  role: Role;
  name: string;
  children?: Hierarchy[];
}

export async function getHierarchy(): Promise<Hierarchy> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${API_URL}/users/hierarchy`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  return await response.json();
}
