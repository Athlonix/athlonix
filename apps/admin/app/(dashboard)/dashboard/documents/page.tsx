'use client';
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
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { type Files, getAllFiles, saveFile } from './utils';

export default function Documents() {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<{ data: Files[]; count: number } | null>(null);

  useEffect(() => {
    const getFIles = async () => {
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
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }
  return (
    <div className="flex flex-col h-full">
      <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Documents d'Athlonix</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nouveau fichier</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enregistrer un fichier</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} method="POST">
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="file">Fichier</Label>
                  <Input id="file" type="file" name="file" required />
                </div>
                <div>
                  <Label htmlFor="filename">Nom</Label>
                  <Input id="filename" type="text" name="name" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" type="text" name="description" />
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
      </header>
      <div className="flex-1 overflow-auto p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files?.data.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{`${new Date(file.created_at).toLocaleDateString()} ${new Date(
                  file.created_at,
                ).toLocaleTimeString()}`}</TableCell>
                <TableCell>{`${new Date(file.updated_at).toLocaleDateString()} ${new Date(
                  file.updated_at,
                ).toLocaleTimeString()}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
