'use client';
import { returnUser } from '@/app/lib/utils';
import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { EditIcon, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import React from 'react';
import { type Files, deleteFile, getAllFiles, saveFile, updateFile } from './utils';

export default function Documents() {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<{ data: Files[]; count: number } | null>(null);
  const [editFile, setEditFile] = useState<Files | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const getFIles = async () => {
      const user = await returnUser();
      setUserId(user?.id || null);
      const files = await getAllFiles();
      setFiles(files);
    };
    getFIles();
  }, []);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsUploading(true);

    try {
      await saveFile(formData);
    } catch (error) {
      throw new Error('Failed to save file');
    } finally {
      setIsUploading(false);
      setFiles(await getAllFiles());
      setOpen(false);
    }
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>, fileId: number) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsUploading(true);

    try {
      await updateFile(formData, fileId);
    } catch (error) {
      throw new Error('Failed to update file');
    } finally {
      setIsUploading(false);
      setFiles(await getAllFiles());
      setOpen(false);
    }
  }

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un fichier</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editFile ? 'Modifier' : 'Ajouter'} un fichier</DialogTitle>
            </DialogHeader>
            <form onSubmit={editFile ? (e) => handleEdit(e, editFile.id) : handleUpload}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="file">Fichier</Label>
                  {editFile ? (
                    <Input id="file" type="file" name="file" />
                  ) : (
                    <Input id="file" type="file" name="file" required />
                  )}
                </div>
                <div>
                  <Label htmlFor="filename">Nom</Label>
                  <Input
                    id="filename"
                    type="text"
                    name="name"
                    required
                    defaultValue={editFile ? editFile.name : ''}
                    readOnly={!!editFile}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    defaultValue={editFile ? editFile.description : ''}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="isAdmin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Confidentiel
                  </Label>
                  <Checkbox id="isAdmin" name="isAdmin" defaultChecked={editFile ? editFile.isAdmin : false} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUploading}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      <div className="flex-1 overflow-auto p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Confidentiel</TableHead>
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
                <TableCell>{file.isAdmin ? 'Oui' : 'Non'}</TableCell>
                <TableCell>{`${new Date(file.created_at).toLocaleDateString()} ${new Date(
                  file.created_at,
                ).toLocaleTimeString()}`}</TableCell>
                <TableCell>{`${new Date(file.updated_at).toLocaleDateString()} ${new Date(
                  file.updated_at,
                ).toLocaleTimeString()}`}</TableCell>
                <TableCell className="flex gap-2">
                  <Eye className="cursor-pointer" onClick={() => viewFile(file.id)} />
                  <EditIcon
                    className="cursor-pointer"
                    color="#1f6feb"
                    onClick={() => {
                      setEditFile(file);
                      setOpen(true);
                    }}
                  />
                  {userId !== null && userId === file.owner && (
                    <Trash2
                      className="cursor-pointer"
                      color="#bf0808"
                      onClick={() => {
                        deleteFile(file.id, file.name);
                        setFiles({
                          data: files?.data.filter((f) => f.id !== file.id) || [],
                          count: files?.count - 1 || 0,
                        });
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
