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
import { toast } from '@repo/ui/components/ui/sonner';
import { Card } from '@ui/components/ui/card';
import { Textarea } from '@ui/components/ui/textarea';
import { CircleArrowLeft, EditIcon, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import React from 'react';
import { type Files, deleteFile, getAllFiles, saveFile, updateFile } from './utils';

function FolderItem({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <Card className="m-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-48 h-24" onClick={onClick}>
      <h2>{name}</h2>
    </Card>
  );
}

function DisplayFolderAndFiles({
  folder,
  onFolderClick,
  files,
  onFileClick,
  currrentPath,
  setEditFile,
  setOpen,
}: {
  folder: { [key: string]: unknown };
  onFolderClick: (name: string) => void;
  files?: Files[];
  onFileClick?: (id: number) => void;
  currrentPath: string;
  setEditFile: React.Dispatch<React.SetStateAction<Files | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      {Object.entries(folder).map(([name, value]) => {
        if (typeof value === 'object') {
          return <FolderItem key={name} name={name} onClick={() => onFolderClick(name)} />;
        }
      })}
      {files
        ?.filter((file) => file.path.split('/').slice(0, -1).join('/') === currrentPath)
        .map((file) => {
          return (
            <Card key={file.id} className="m-2 p-2 w-48 h-24 flex items-center justify-between">
              <p>{file.name}</p>
              <div className="flex space-x-2">
                <Eye className="w-6 h-6 cursor-pointer" onClick={() => onFileClick?.(file.id)} />
                <EditIcon
                  className="cursor-pointer"
                  color="#1f6feb"
                  onClick={() => {
                    setEditFile(file);
                    setOpen(true);
                  }}
                />
                <Trash2 className="w-6 h-6 cursor-pointer" onClick={() => deleteFile(file.id, file.name)} />
              </div>
            </Card>
          );
        })}
    </>
  );
}

export default function Documents() {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<{ data: Files[]; count: number } | null>(null);
  const [folders, setFolders] = useState<{ [key: string]: unknown } | null>(null);
  const [saveFolder, setSaveFolder] = useState<{ [key: string]: unknown } | null>(null);
  const [currrentPath, setCurrentPath] = useState<string | null>(null);

  const [editFile, setEditFile] = useState<Files | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const getFiles = async () => {
      const user = await returnUser();
      setUserId(user?.id || null);
      const files = await getAllFiles();
      setFiles(files);
      setFolders(files.folders);
      setSaveFolder(files.folders);
    };
    getFiles();
  }, []);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsUploading(true);
    formData.set('path', currrentPath || '');
    formData.set('assembly', 'null');
    formData.set('path', `${currrentPath}/${formData.get('name')}`);

    try {
      await saveFile(formData);
    } catch (error) {
      toast.error('Erreur', {
        duration: 2000,
        description: 'Impossible de sauvegarder le fichier',
      });
      throw new Error('Failed to save file');
    } finally {
      setIsUploading(false);
      setFiles(await getAllFiles());
      setOpen(false);
      toast.success('Succès', {
        duration: 2000,
        description: 'Le fichier a été sauvegardé avec succès',
      });
    }
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>, fileId: number) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsUploading(true);

    try {
      await updateFile(formData, fileId);
    } catch (error) {
      toast.error('Erreur', {
        duration: 2000,
        description: 'Impossible de mettre à jour le fichier',
      });
      throw new Error('Failed to update file');
    } finally {
      setIsUploading(false);
      setFiles(await getAllFiles());
      setOpen(false);
      toast.success('Succès', {
        duration: 2000,
        description: 'Le fichier a été mis à jour avec succès',
      });
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

  function onFolderClick(name: string): void {
    if (folders?.[name]) {
      setFolders(folders[name] as { [key: string]: unknown });
      setCurrentPath((prev) => (prev ? `${prev}/${name}` : name));
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
                  <Textarea id="description" name="description" defaultValue={editFile ? editFile.description : ''} />
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
      <CircleArrowLeft
        className="w-8 h-8"
        onClick={() => {
          setFolders(saveFolder);
          setCurrentPath(null);
        }}
      />
      <div className="flex flex-wrap gap-4 p-4">
        <DisplayFolderAndFiles
          folder={folders || {}}
          onFolderClick={(name) => onFolderClick(name)}
          files={files?.data}
          onFileClick={(id) => viewFile(id)}
          currrentPath={currrentPath || ''}
          setEditFile={setEditFile}
          setOpen={setOpen}
        />
      </div>
    </div>
  );
}
