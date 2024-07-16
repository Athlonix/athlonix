'use server';
import { cookies } from 'next/headers';

export type Assembly = {
  id: number;
  name: string;
  description: string;
  date: string;
  location: number | null;
  attendees:
    | [
        {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
        },
      ]
    | undefined;
  lawsuit: string;
  closed: boolean;
};

export async function getAssemblies(): Promise<{ data: Assembly[]; count: number }> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const res = await fetch(`${urlApi}/assemblies?all=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function getAssembly(id: number): Promise<Assembly> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const res = await fetch(`${urlApi}/assemblies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function createAssembly(formData: FormData): Promise<void> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    date: new Date(formData.get('date') as string).toISOString(),
    location: Number(formData.get('location')) || null,
    lawsuit: null,
  };
  const token = cookies().get('access_token')?.value;
  if (!token) {
    throw new Error('No token found');
  }

  const resp = await fetch(`${urlApi}/assemblies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    throw new Error('Failed to create assembly');
  }
}

export async function updateAssembly(formData: FormData, id: number): Promise<void> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    date: new Date(formData.get('date') as string).toISOString(),
    location: Number(formData.get('location')) || null,
    lawsuit: formData.get('lawsuit') || null,
  };
  const token = cookies().get('access_token')?.value;
  const res = await fetch(`${urlApi}/assemblies/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update assembly');
  }
}

export async function addAttendee(id_assembly: number, id_user: number): Promise<void> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const resp = await fetch(`${urlApi}/assemblies/${id_assembly}/confirm/${id_user}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!resp.ok) {
    throw new Error('Failed to add attendee');
  }
}

export async function closeAssembly(id: number, lawsuit: string): Promise<void> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  await fetch(`${urlApi}/assemblies/${id}/close`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lawsuit }),
  });
}

export async function getQrcode(id: number): Promise<string> {
  const urlApi = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const res = await fetch(`${urlApi}/assemblies/${id}/qr`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = (await res.json()) as { qrCode: string };
  return data.qrCode;
}
