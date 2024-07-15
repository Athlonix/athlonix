'use client';

import { Button } from '@ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/components/ui/select';
import { toast } from '@ui/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/components/ui/table';
import { Textarea } from '@ui/components/ui/textarea';
import { EditIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type Address, getAdresses } from '../addresses/utils';
import { type Assembly, createAssembly, getAssemblies, updateAssembly } from './utils';

export default function AssembliesPage(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [assemblies, setAssemblies] = useState<Assembly[] | null>(null);
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [editAssembly, setEditAssembly] = useState<Assembly | null>(null);
  const [location, setLocation] = useState<Address[] | null>(null);

  useEffect(() => {
    const fetchAssemblies = async () => {
      const assemblies = await getAssemblies();
      setAssemblies(assemblies.data);
      setCount(assemblies.count);
    };
    const fetchLocations = async () => {
      const location = await getAdresses();
      setLocation(location.data);
    };
    fetchAssemblies();
    fetchLocations();
    setLoading(false);
  }, []);

  async function handleAddAssembly(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await createAssembly(formData);
      const assemblies = await getAssemblies();
      setAssemblies(assemblies.data);
      setCount(assemblies.count);
      toast.success("L'assemblée a été créée avec succès");
    } catch (_error) {
      toast.error("Erreur lors de la création de l'assemblée");
    }
    setOpen(false);
  }

  async function handleUpdateAssembly(event: React.FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await updateAssembly(formData, id);
    const assemblies = await getAssemblies();
    setAssemblies(assemblies.data);
    setCount(assemblies.count);
    setOpen(false);
  }

  return (
    <div className="p-6 space-y-6">
      <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Assemblées Générales</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Programmer une assemblée</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editAssembly ? 'Modifier' : 'Ajouter'} une assemblée</DialogTitle>
            </DialogHeader>
            <form onSubmit={editAssembly ? (event) => handleUpdateAssembly(event, editAssembly.id) : handleAddAssembly}>
              <div className="grid gap-4 py-4">
                <Label htmlFor="name">Titre</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editAssembly ? editAssembly.name : ''}
                  required
                  placeholder="Titre de l'assemblée générale"
                />
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 16)}
                  maxLength={16}
                  defaultValue={editAssembly ? new Date(editAssembly.date).toISOString().slice(0, 16) : ''}
                  required
                />
                <Select name="location" required>
                  <SelectTrigger className="w-full rounded-lg bg-background pl-8 text-black border border-gray-300">
                    <SelectValue placeholder="Lieu" />
                  </SelectTrigger>
                  <SelectContent defaultValue={editAssembly?.location ? String(editAssembly.location) : '0'}>
                    {location?.map((loc) => (
                      <SelectItem key={loc.id} value={String(loc.id)}>
                        {loc.road} {loc.number}, {loc.city}
                      </SelectItem>
                    ))}
                    <SelectItem value={'0'}>En ligne</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editAssembly ? editAssembly.description : ''}
                  placeholder="Description de l'assemblée générale"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading || !location}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      <div className="flex items-center gap-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assemblies?.map((assembly) => (
              <TableRow key={assembly.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <TableCell>
                  <Link href={`/dashboard/assemblies/details?id=${assembly.id}`}>{assembly.name}</Link>
                </TableCell>
                <TableCell>
                  {new Date(assembly.date).toLocaleDateString()} {new Date(assembly.date).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  {assembly.description && assembly.description.length > 50
                    ? `${assembly.description.slice(0, 50)}...`
                    : assembly.description || 'Pas de description'}
                </TableCell>
                <TableCell>
                  {assembly.location ? location?.find((loc) => loc.id === assembly.location)?.city : 'En ligne'}
                </TableCell>
                <TableCell>
                  {assembly.closed ? (
                    <span className="text-red-500">Terminée</span>
                  ) : new Date(assembly.date).getTime() < Date.now() ? (
                    <span className="text-green-500">En cour</span>
                  ) : (
                    <span className="text-blue-500">Programmer</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditIcon
                      className="cursor-pointer"
                      color="#1f6feb"
                      onClick={() => {
                        setEditAssembly(assembly);
                        setOpen(true);
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
