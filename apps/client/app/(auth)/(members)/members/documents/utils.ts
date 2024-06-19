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
