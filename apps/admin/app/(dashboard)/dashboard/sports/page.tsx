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
import Loading from '@ui/components/ui/loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/components/ui/table';
import { Textarea } from '@ui/components/ui/textarea';
import { EditIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Sports, addSport, deleteSport, getAllSports, updateSport } from './utils';

export default function SportsPage(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [sports, setSports] = useState<Sports[] | null>(null);
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [editSport, setEditSport] = useState<Sports | null>(null);

  useEffect(() => {
    const fetchSports = async () => {
      const sports = await getAllSports();
      setSports(sports.data);
      setCount(sports.count);
    };
    fetchSports();
    setLoading(false);
  }, []);

  async function handleAddSport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await addSport(formData);
    const sports = await getAllSports();
    setSports(sports.data);
    setCount(sports.count);
    setOpen(false);
  }

  async function handleDeleteSport(id: number) {
    await deleteSport(id);
    const new_count = count - 1;
    setCount(new_count);
  }

  async function handleUpdateSport(event: React.FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await updateSport(formData, id);
    const sports = await getAllSports();
    setSports(sports.data);
    setCount(sports.count);
    setEditSport(null);
    setOpen(false);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6">
      <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Sports</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditSport(null)}>Ajouter un sport</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editSport ? 'Modifier' : 'Ajouter'} un sport</DialogTitle>
            </DialogHeader>
            <form onSubmit={editSport ? (e) => handleUpdateSport(e, editSport.id) : handleAddSport}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    required
                    defaultValue={editSport ? editSport.name : ''}
                    placeholder="Nom du sport"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Description du sport"
                    defaultValue={editSport?.description ? editSport.description : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="min_players">Nombre de joueurs minimum</Label>
                  <Input
                    id="min_players"
                    type="number"
                    name="min_players"
                    placeholder="0"
                    min="0"
                    required
                    defaultValue={editSport ? Number(editSport.min_players) : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="max_players">Nombre de joueurs maximum</Label>
                  <Input
                    id="max_players"
                    type="number"
                    name="max_players"
                    placeholder="10"
                    min="1"
                    defaultValue={editSport?.max_players ? Number(editSport.max_players) : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="text"
                    name="image"
                    defaultValue={editSport?.image ? editSport.image : ''}
                    placeholder='URL de l"image'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
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
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Nombre de joueurs minimum</TableHead>
              <TableHead>Nombre de joueurs maximum</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sports?.map((sport) => (
              <TableRow key={sport.id}>
                <TableCell>{sport.name}</TableCell>
                <TableCell>
                  {sport.description && sport.description.length > 50
                    ? `${sport.description.slice(0, 50)}...`
                    : sport.description || 'Pas de description'}
                </TableCell>
                <TableCell>{sport.min_players}</TableCell>
                <TableCell>{sport.max_players ? sport.max_players : 'Pas de nombre maximum'}</TableCell>
                <TableCell>{sport.image ? 'Oui' : 'Non'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditIcon
                      className="cursor-pointer"
                      color="#1f6feb"
                      onClick={() => {
                        setEditSport(sport);
                        setOpen(true);
                      }}
                    />
                    <Trash2
                      className="cursor-pointer"
                      color="#bf0808"
                      onClick={() => {
                        handleDeleteSport(sport.id);
                        setSports(sports?.filter((s) => s.id !== sport.id));
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
