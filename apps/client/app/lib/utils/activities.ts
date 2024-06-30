'use server';

import type { ActivityWithOccurences, Address, Sport, User } from '@/app/lib/type/Activities';
import { cookies } from 'next/headers';

const urlApi = process.env.ATHLONIX_API_URL;

export async function getActivityOccurences(id: number): Promise<{ data: ActivityWithOccurences; status: number }> {
  const startDate = new Date().toISOString().split('T')[0] ?? '';
  const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0] ?? '';

  const queryParams = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  const res = await fetch(`${urlApi}/activities/${id}/occurences?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data: await res.json(), status: res.status };
}
export async function getSports(): Promise<{ data: { data: Sport[]; count: number }; status: number }> {
  const queryParams = new URLSearchParams({
    all: 'true',
  });

  const res = await fetch(`${urlApi}/sports?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function getAddresses(): Promise<{ data: { data: Address[]; count: number }; status: number }> {
  const queryParams = new URLSearchParams({
    all: 'true',
  });

  const res = await fetch(`${urlApi}/addresses?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function getActivityUsers(
  id: number,
  date: string,
): Promise<{ data: { data: User[]; count: number }; status: number }> {
  const formattedDate = date.split('T')[0];

  if (!formattedDate) {
    return { data: { data: [], count: 0 }, status: 400 };
  }

  const queryParams = new URLSearchParams({
    date: formattedDate,
  });

  const res = await fetch(`${urlApi}/activities/${id}/users?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function joinActivity(id: number, date: string): Promise<{ data: User; status: number }> {
  const formattedDate = date.split('T')[0];

  if (!formattedDate) {
    return { data: {} as User, status: 400 };
  }

  const queryParams = new URLSearchParams({
    date: formattedDate,
  });

  const res = await fetch(`${urlApi}/activities/${id}/apply?${queryParams}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return { data: await res.json(), status: res.status };
}
