'use server';
import { cookies } from 'next/headers';

export type Folders = {
  id: number;
  name: string;
  parent: number | null;
  creator: number;
  isAdmin: boolean;
  created_at: string;
};

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
  folder: Folders | null;
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
    throw new Error('Failed to save file');
  }
}

export async function getAllFiles(): Promise<{
  files: Files[];
  countFiles: number;
  folders: Folders[];
  countFolders: number;
}> {
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
  return { files: data.files, countFiles: data.filesCount, folders: data.folders, countFolders: data.foldersCount };
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

export async function addFolder(name: string, parent: number | null, isAdmin: boolean): Promise<void> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${API_URL}/edm/folder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, parent, isAdmin }),
  });
  if (!response.ok) {
    throw new Error('Failed to add folder');
  }
}

export async function deleteFolder(id: number): Promise<void> {
  const API_URL = process.env.ATHLONIX_API_URL;
  const token = cookies().get('access_token')?.value;
  const response = await fetch(`${API_URL}/edm/folder/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete folder');
  }
}
