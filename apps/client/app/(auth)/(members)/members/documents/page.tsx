'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Files, getAllFiles } from './utils';

export default function Documents() {
  const [files, setFiles] = useState<{ data: Files[]; count: number } | null>(null);

  useEffect(() => {
    const getFIles = async () => {
      const files = await getAllFiles();
      setFiles(files);
    };
    getFIles();
  }, []);

  async function viewFile(id: number) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/edm/download/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  function fileTypes(input: string) {
    switch (input) {
      case 'application/pdf' || 'application/x-pdf':
        return 'PDF';
      case 'application/msword' || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Word';
      case input.includes('image') && input:
        return 'Image';
      default:
        return 'Other';
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Documents d'Athlonix</h1>
      </header>
      <div className="flex-1 overflow-auto p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files?.data.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.description || 'Aucune description'}</TableCell>
                <TableCell>{fileTypes(file.type)}</TableCell>
                <TableCell>{`${new Date(file.created_at).toLocaleDateString()} ${new Date(
                  file.created_at,
                ).toLocaleTimeString()}`}</TableCell>
                <TableCell>{`${new Date(file.updated_at).toLocaleDateString()} ${new Date(
                  file.updated_at,
                ).toLocaleTimeString()}`}</TableCell>
                <TableCell className="flex gap-2">
                  <Eye className="cursor-pointer" onClick={() => viewFile(file.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
