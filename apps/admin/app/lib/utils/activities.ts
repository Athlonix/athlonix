'use server';

import type { Activity, ActivityWithOccurences, Address, Sport, User } from '@/app/lib/type/Activities';
import { cookies } from 'next/headers';

const urlApi = process.env.ATHLONIX_API_URL;

export async function getActivities(
  page: number,
  searchTerm: string,
): Promise<{ data: { data: Activity[]; count: number }; status: number }> {
  const queryParams = new URLSearchParams({
    skip: `${page - 1}`,
    take: '10',
    search: searchTerm,
  });

  const res = await fetch(`${urlApi}/activities?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return { data: await res.json(), status: res.status };
}

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
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function getActivity(id: number): Promise<{ data: Activity; status: number }> {
  const res = await fetch(`${urlApi}/activities/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
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
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
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
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
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
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return { data: await res.json(), status: res.status };
}

export async function validateUsers(
  id_activity: number,
  id_user: number,
  date: string,
): Promise<{ data: string; status: number }> {
  const formattedDate = date.split('T')[0];

  if (!formattedDate) {
    return { data: '', status: 400 };
  }

  const res = await fetch(`${urlApi}/activities/${id_activity}/validApply`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
    body: JSON.stringify({
      id_user,
      date: formattedDate,
    }),
  });

  return { data: await res.json(), status: res.status };
}
