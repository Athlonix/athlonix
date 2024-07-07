'use server';
import { cookies } from 'next/headers';

export type Message = {
  id: number;
  message: string;
  id_sender: number;
  created_at: string;
  updated_at: string | null;
  name: string;
};

export async function getMessages(): Promise<{ data: Message[]; count: number }> {
  const user = cookies().get('user');
  if (!user) {
    return { data: [], count: 0 };
  }
  const token = cookies().get('access_token')?.value;
  const urlApi = process.env.ATHLONIX_API_URL as string;

  const res = await fetch(`${urlApi}/messages?all=true`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch messages');
  }

  return await res.json();
}

export async function sendMessage(message: { id_sender: number; message: string }): Promise<Message | null> {
  const token = cookies().get('access_token')?.value;
  const urlApi = process.env.ATHLONIX_API_URL;

  const res = await fetch(`${urlApi}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(message),
  });
  return await res.json();
}

export async function updateMessage(id: number, message: string): Promise<Message | null> {
  const token = cookies().get('access_token')?.value;
  const urlApi = process.env.ATHLONIX_API_URL;

  const res = await fetch(`${urlApi}/messages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  return await res.json();
}

export async function deleteMessage(id: number): Promise<void> {
  const token = cookies().get('access_token')?.value;
  const urlApi = process.env.ATHLONIX_API_URL;

  const res = await fetch(`${urlApi}/messages/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete message');
  }
}
