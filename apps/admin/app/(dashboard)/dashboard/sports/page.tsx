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
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { type Sports, addSport, deleteSport, getAllSports, updateSport } from './utils';

const Icons = {
  spinner: Loader2,
};

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
  }

  async function handleDeleteSport(id: number) {
    await deleteSport(id);
    const sports = await getAllSports();
    setSports(sports.data);
    setCount(sports.count);
  }

  async function handleUpdateSport(event: React.FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await updateSport(formData, id);
    const sports = await getAllSports();
    setSports(sports.data);
    setCount(sports.count);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icons.spinner className="w-12 h-12 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Sports</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un sport</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editSport ? 'Modifier' : 'Ajouter'} un sport</DialogTitle>
            </DialogHeader>
            <form onSubmit={editSport ? (e) => handleUpdateSport(e, editSport.id) : handleAddSport}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" type="text" name="name" required defaultValue={editSport ? editSport.name : ''} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    defaultValue={editSport ? editSport.description : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="min_players">Nombre de joueurs minimum</Label>
                  <Input
                    id="min_players"
                    type="number"
                    name="min_players"
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
                    defaultValue={editSport ? Number(editSport.max_players) : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input id="image" type="text" name="image" defaultValue={editSport?.image ? editSport.image : ''} />
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sports?.length === 0 && <p>Aucun sport enregistré</p>}
        {sports?.map((sport) => (
          <div key={sport.id} className="bg-white shadow-md rounded-lg p-4">
            {sport.image && (
              <Image
                src={sport.image}
                alt={sport.name}
                className="rounded-lg object-cover w-full aspect-video"
                width={500}
                height={500}
              />
            )}
            <div className="p-4">
              <h1 className="text-xl font-semibold">{sport.name}</h1>
              <p className="mt-2 text-gray-600">{sport.description}</p>
              <div className="mt-4 flex justify-between">
                <span className="text-gray-400">
                  Joueurs: {sport.min_players} - {sport.max_players}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
