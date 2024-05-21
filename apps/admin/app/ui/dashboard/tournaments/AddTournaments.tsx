'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { toast } from '@repo/ui/components/ui/sonner';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Tournament = {
  id: number;
  created_at: string;
  default_match_length: number | null;
  name: string;
  max_participants: number;
  team_capacity: number;
  rules: string | null;
  prize: string | null;
  id_address: number | null;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

interface Props {
  tournaments: Tournament[];
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  addresses: Address[];
}

function AddTournaments({ tournaments, setTournaments, addresses }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1, { message: 'Le champ est requis' }),
    default_match_length: z.coerce
      .number({ message: 'Le champ doit contenir un nombre' })
      .min(1, { message: 'La durée ne peut être inférieur à 1' })
      .optional(),
    max_participants: z.coerce
      .number({ message: 'Le champ doit contenir un nombre' })
      .min(1, { message: 'Le nombre de participants ne peut être inférieur à 1' }),
    team_capacity: z.coerce
      .number({ message: 'Le champ doit contenir un nombre' })
      .min(1, { message: "La capacité de l'équipe ne peut être inférieur à 1" }),
    id_address: z.number().min(1).optional(),
    rules: z.string().optional(),
    prize: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      default_match_length: undefined,
      max_participants: 1,
      team_capacity: 1,
      id_address: undefined,
      rules: '',
      prize: '',
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data) => {
        toast.success('Tournoi ajouté', { duration: 2000, description: 'Le tournoi a été ajouté avec succès' });
        setTournaments([...tournaments, data]);
        setOpen(false);
        form.reset();
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter un tournoi</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout d'un tournoi</DialogTitle>
          <ScrollArea className="h-[500px] w-full">
            <DialogDescription className="mx-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)}>
                  <div className="grid gap-4">
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Nom du tournoi</Label>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="default_match_length"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Durée par défaut d'un match</Label>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="max_participants"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Nombre d'équipe max</Label>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="team_capacity"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Nombre de joueur par équipe</Label>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="id_address"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Adresse</Label>
                            <Select onValueChange={field.onChange} defaultValue="-1">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Aucun" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="-1">Aucun</SelectItem>
                                {addresses.map((address) => (
                                  <SelectItem key={address.id} value={address.id.toString()}>
                                    {address.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="rules"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Règles</Label>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="prize"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Récompenses</Label>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button type="submit" className="w-full">
                      Créer
                    </Button>
                    <Button variant="secondary" type="button" onClick={() => setOpen(false)} className="w-full">
                      Annuler
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddTournaments;
