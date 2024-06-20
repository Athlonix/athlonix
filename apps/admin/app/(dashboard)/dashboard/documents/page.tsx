'use client';
import { returnUser } from '@/app/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@repo/ui/components/ui/breadcrumb';
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
import { CircleArrowLeft, EditIcon, File, FileImage, FolderOpen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type React from 'react';
import {
  type Files,
  type Folders,
  addFolder,
  deleteFile,
  deleteFolder,
  getAllFiles,
  saveFile,
  updateFile,
} from './utils';

function getParentFolders(folders: Folders[], folderId: number): Folders[] {
  const folder = folders.find((f) => f.id === folderId);
  if (!folder) {
    return [];
  }
  if (!folder.parent) {
    return [folder];
  }
  return [...getParentFolders(folders, folder.parent), folder];
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

function FolderItem({
  id,
  name,
  onClick,
  deleteFolder,
}: { id: number; name: string; onClick: () => void; deleteFolder(id: number): void }) {
  return (
    <Card
      className="m-2 p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 folder-card w-48 h-24 rounded-lg shadow-md border-2 border-blue-200 dark:border-blue-400"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <FolderOpen className="w-8 text-blue-400" />
        <Trash2
          className="w-8 text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            deleteFolder(id);
          }}
        />
      </div>
      <h2>{name}</h2>
    </Card>
  );
}

function AddFileDialog({
  open,
  setOpen,
  editFile,
  handleEdit,
  handleUpload,
  isUploading,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editFile: Files | null;
  handleEdit: (event: FormEvent<HTMLFormElement>, fileId: number) => void;
  handleUpload: (event: FormEvent<HTMLFormElement>) => void;
  isUploading: boolean;
}): JSX.Element {
  return (
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
  );
}

function AddFolderDialog({
  open,
  setOpen,
  handleAddFolder,
  isUploading,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddFolder: (event: FormEvent<HTMLFormElement>) => void;
  isUploading: boolean;
}): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un dossier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un dossier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddFolder}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="foldername">Nom</Label>
              <Input id="foldername" type="text" name="name" required />
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="isAdmin"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Confidentiel
              </Label>
              <Checkbox id="isAdmin" name="isAdmin" />
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
  deleteFile,
  deleteFolder,
}: {
  folder: Folders[] | null;
  onFolderClick: (name: string) => void;
  files: Files[] | null;
  onFileClick: (id: number) => void;
  currrentPath: number | null;
  setEditFile: React.Dispatch<React.SetStateAction<Files | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteFile: (id: number, name: string) => void;
  deleteFolder: (id: number) => void;
}) {
  return (
    <>
      {currrentPath === null
        ? folder
            ?.filter((f) => !f.parent)
            .map((f) => (
              <FolderItem
                key={f.id}
                id={f.id}
                name={f.name}
                onClick={() => onFolderClick(f.name)}
                deleteFolder={() => deleteFolder(f.id)}
              />
            ))
        : folder
            ?.filter((f) => f.parent === currrentPath)
            .map((f) => (
              <FolderItem
                key={f.id}
                id={f.id}
                name={f.name}
                onClick={() => onFolderClick(f.name)}
                deleteFolder={() => deleteFolder(f.id)}
              />
            ))}

      {files
        ?.filter((f) => f.folder === currrentPath)
        .map((f) => (
          <Card
            key={f.id}
            className={
              'w-64 m-2 p-4 cursor-pointer transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700'
            }
            onClick={() => onFileClick?.(f.id)}
          >
            <div className="flex items-center space-x-2 mb-2">
              {fileTypes(f.type) === 'Image' ? <FileImage /> : <File />}
              <div className="w-full flex justify-end items-center space-x-2">
                <EditIcon
                  className="w-5 h-5 text-green-500"
                  cursor={'pointer'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditFile(f);
                    setOpen(true);
                  }}
                />
                <Trash2
                  className="w-5 h-5 text-red-500"
                  cursor={'pointer'}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(f?.id, f?.name);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold pr-4">{f.name}</h2>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {f.description.length > 25 ? `${f.description.slice(0, 25)}...` : f.description}
            </p>
            <p className="text-sm text-gray-500 mt-2">{fileTypes(f.type)}</p>
            <p className="text-xs text-gray-400 mt-2">
              {`${new Date(f.created_at).toLocaleDateString()} ${new Date(f.created_at).toLocaleTimeString()}`}
            </p>
          </Card>
        ))}
    </>
  );
}

export default function Documents() {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<Files[] | null>(null);
  const [folders, setFolders] = useState<Folders[] | null>(null);
  const [currrentPath, setCurrentPath] = useState<number | null>(null);
  const [editFile, setEditFile] = useState<Files | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openFolder, setOpenFolder] = useState<boolean>(false);

  useEffect(() => {
    const getFiles = async () => {
      const user = await returnUser();
      setUserId(user?.id || null);
      const data = await getAllFiles();
      setFiles(data.files);
      setFolders(data.folders);
    };
    getFiles();
  }, []);

  async function handleUpload(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsUploading(true);
    formData.set('assembly', 'null');
    formData.set('folder', currrentPath?.toString() || 'null');

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
      const data = await getAllFiles();
      setFiles(data.files);
      setFolders(data.folders);
      setOpen(false);
      toast.success('Succès', {
        duration: 2000,
        description: 'Le fichier a été sauvegardé avec succès',
      });
    }
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>, fileId: number): Promise<void> {
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
      const data = await getAllFiles();
      setFiles(data.files);
      setFolders(data.folders);
      setOpen(false);
      toast.success('Succès', {
        duration: 2000,
        description: 'Le fichier a été mis à jour avec succès',
      });
    }
  }

  async function handleAddFolder(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsUploading(true);
    const name = formData.get('name') as string;
    const parent = currrentPath;
    const isAdmin = formData.get('isAdmin') === 'true';

    try {
      await addFolder(name, parent, isAdmin);
    } catch (error) {
      toast.error('Erreur', {
        duration: 2000,
        description: 'Impossible de sauvegarder le dossier',
      });
      throw new Error('Failed to save folder');
    } finally {
      setIsUploading(false);
      const data = await getAllFiles();
      setFiles(data.files);
      setFolders(data.folders);
      setOpen(false);
      toast.success('Succès', {
        duration: 2000,
        description: 'Le dossier a été sauvegardé avec succès',
      });
    }
  }

  async function viewFile(id: number): Promise<void> {
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

  async function HandleDeleteFile(id: number, name: string): Promise<void> {
    await deleteFile(id, name);
    setFiles(files?.filter((f) => f.id !== id) || null);
    toast.success('Succès', {
      duration: 2000,
      description: 'Le fichier a été supprimé avec succès',
    });
  }

  async function HandleDeleteFolder(id: number): Promise<void> {
    await deleteFolder(id);
    setFolders(folders?.filter((f) => f.id !== id) || null);
    toast.success('Succès', {
      duration: 2000,
      description: 'Le dossier a été supprimé avec succès',
    });
  }

  function onFolderClick(name: string): void {
    const folder = folders?.find((f) => f.name === name);
    setCurrentPath(folder?.id || null);
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Documents d'Athlonix</h1>
        <div className="flex items-center space-x-4">
          <AddFileDialog
            open={open}
            setOpen={setOpen}
            editFile={editFile}
            handleEdit={handleEdit}
            handleUpload={handleUpload}
            isUploading={isUploading}
          />
          <AddFolderDialog
            open={openFolder}
            setOpen={setOpenFolder}
            handleAddFolder={handleAddFolder}
            isUploading={isUploading}
          />
        </div>
      </header>
      <div className="flex items-center space-x-2 p-4">
        {currrentPath !== null && (
          <CircleArrowLeft
            className="w-8 h-8"
            cursor={'pointer'}
            onClick={() => {
              setCurrentPath(currrentPath ? folders?.find((f) => f.id === currrentPath)?.parent || null : null);
            }}
          />
        )}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="cursor-pointer">
              <BreadcrumbLink onClick={() => setCurrentPath(null)}>Documents</BreadcrumbLink>
            </BreadcrumbItem>
            {currrentPath !== null && (
              <>
                {folders?.map &&
                  getParentFolders(folders, currrentPath).map((f) => (
                    <>
                      <BreadcrumbSeparator key={`separator-${f.id}`} />
                      <BreadcrumbItem key={f.id} className="cursor-pointer">
                        <BreadcrumbLink onClick={() => setCurrentPath(f.id)}>{f.name}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  ))}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-wrap">
        <DisplayFolderAndFiles
          folder={folders}
          onFolderClick={onFolderClick}
          files={files}
          onFileClick={viewFile}
          currrentPath={currrentPath}
          setEditFile={setEditFile}
          setOpen={setOpen}
          deleteFile={HandleDeleteFile}
          deleteFolder={HandleDeleteFolder}
        />
      </div>
    </div>
  );
}
