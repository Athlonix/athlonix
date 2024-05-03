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
import { useToast } from '@repo/ui/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Activity = {
  id: number;
  name: string;
  min_participants: number;
  max_participants: number;
  id_sport: number | null;
  id_address: number | null;
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  end_date: string;
  start_date: string;
  description: string | null;
  recurrence: 'weekly' | 'monthly' | 'annual';
  interval: number;
};

interface Props {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

function addAddress({ activities, setActivities }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1, { message: 'Le champ est requis' }),
    min_participants: z.number().int().min(1, { message: 'Le champ est requis' }),
    max_participants: z.number().int().min(1, { message: 'Le champ est requis' }),
    id_sport: z.number().int().min(1).optional(),
    id_address: z.number().int().min(1).optional(),
    recurrence: z.string().regex(/^(weekly|monthly|annual)$/),
    days: z.array(z.string().regex(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/)).refine(
      (days) => {
        if (days.length === 0 && formSchema.safeParse(days).success && formSchema.parse(days).recurrence === 'weekly') {
          return false;
        }
        return true;
      },
      { message: 'Le champ est requis lorsque la récurrence est hebdomadaire' },
    ),
    start_date: z.string().date(),
    end_date: z.string().date(),
    interval: z.number().int().min(1),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      min_participants: undefined,
      max_participants: undefined,
      id_sport: undefined,
      id_address: undefined,
      recurrence: 'weekly',
      days: [],
      start_date: '',
      end_date: '',
      interval: undefined,
    },
  });

  async function submitEdit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        min_participants: values.min_participants,
        max_participants: values.max_participants,
        days: values.days,
        recurrence: values.recurrence,
        interval: values.interval,
        start_date: values.start_date,
        end_date: values.end_date,
        id_sport: values.id_sport,
        id_address: values.id_address,
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data: { id: number }) => {
        toast({ title: 'Adresse ajouté', description: "L'adresse a été ajouté avec succès" });
        const newActivity: Activity = {
          id: data.id,
          name: values.name,
          min_participants: values.min_participants,
          max_participants: values.max_participants,
          id_sport: values.id_sport || null,
        };
        if (activities.length < 10) {
          setActivities([...activities, newActivity]);
        }
      })
      .catch((error: Error) => {
        toast({ title: 'Erreur', description: error?.message });
      });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter une adresse</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout d'adresse</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitEdit)} method="POST">
                <div className="grid gap-2">
                  <div className="grid">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Nom de l'activité</Label>
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
                      name="min_participants"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Minimum de participants</Label>
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
                          <Label className="font-bold">Maximum de participants</Label>
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
                      name="id_sport"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Sport</Label>
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
                      name="id_address"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Adresse</Label>
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
                      name="recurrence"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Fréquence</Label>
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Description</Label>
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
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Date/Heure de début</Label>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid">
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Date/Heure de fin</Label>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid">
                    <FormField
                      control={form.control}
                      name="interval"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Intervalle</Label>
                          <FormControl>
                            <Input {...field} type="number" />
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default addAddress;
