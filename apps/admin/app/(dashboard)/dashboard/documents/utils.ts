'use server';
import { cookies } from 'next/headers';

export type Files = {
  id: number;
  name: string;
  description: string;
  owner: number;
  isAdmin: boolean;
  updated_at: string;
  created_at: string;
  type: string;
  assembly: number | null;
  path: string;
};

export async function saveFile(form: FormData): Promise<void> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  if (form.get('isAdmin') === 'on') {
    form.set('isAdmin', 'true');
  } else {
    form.set('isAdmin', 'false');
  }

  const response = await fetch(`${API_URL}/edm/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  if (!response.ok) {
    console.log(await response.json());
    throw new Error('Failed to save file');
  }
}

export async function getAllFolders(data: Files[]): Promise<{ [key: string]: unknown }> {
  const tree: { [key: string]: unknown } = {};
  for (const file of data) {
    const folders = file.path.split('/').filter(Boolean);
    let currentNode: { [key: string]: unknown } = tree;
    for (const folder of folders) {
      if (!folder.includes('.')) {
        if (!currentNode[folder]) {
          currentNode[folder] = {};
        }
        if (typeof currentNode[folder] !== 'object') {
          currentNode[folder] = {};
        } else {
          currentNode = currentNode[folder] as { [key: string]: unknown };
        }
      }
    }
  }
  console.log(tree);
  return tree;
}

export async function getAllFiles(): Promise<{ data: Files[]; count: number; folders: { [key: string]: unknown } }> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${API_URL}/edm/listFiles?all=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  const data = await response.json();
  return { data: data.data, count: data.count, folders: await getAllFolders(data.data) };
}

export async function deleteFile(id: number, name: string): Promise<void> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${API_URL}/edm/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, name }),
  });
  if (!response.ok) {
    throw new Error('Failed to delete file');
  }
}

export async function updateFile(form: FormData, id: number): Promise<void> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  if (form.get('isAdmin') === 'on') {
    form.set('isAdmin', 'true');
  } else {
    form.set('isAdmin', 'false');
  }
  const response = await fetch(`${API_URL}/edm/update/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  if (!response.ok) {
    throw new Error('Failed to update file');
  }
}
