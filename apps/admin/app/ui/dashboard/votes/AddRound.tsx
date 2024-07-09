'use client';

import type { FullPoll } from '@/app/lib/type/Votes';
import { createPoll } from '@/app/lib/utils/votes';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { toast } from '@repo/ui/components/ui/sonner';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  poll: FullPoll;
  setPoll: React.Dispatch<React.SetStateAction<FullPoll | undefined>>;
}

const endConditions = [
  { key: 'simple', value: 'Simple' },
  { key: 'absolute', value: 'Absolu' },
  { key: 'two-third', value: 'Deux-tiers' },
  { key: 'unanimous', value: 'Unanime' },
];

function AddRound({ poll, setPoll }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z
    .object({
      title: z.string().min(2, { message: 'Le titre doit contenir au moins 2 caractères' }),
      start_at: z.string(),
      end_at: z.string(),
      end_condition: z.enum(['simple', 'absolute', 'two-third', 'unanimous']),
      keep: z.number().min(2, { message: 'Le nombre de choix à conserver doit être supérieur à 1' }),
      max_choices: z.coerce.number().min(1, { message: 'Le nombre de choix doit être supérieur à 0' }),
    })
    .refine((data) => new Date(data.start_at) < new Date(data.end_at), {
      message: 'La date de début doit être inférieure à la date de fin',
      path: ['start_at'],
    })
    .refine((data) => new Date(data.start_at) > new Date(poll.end_at), {
      message: 'La date de début doit être supérieure à la date de fin du tour précédent',
      path: ['start_at'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      start_at: '',
      end_at: '',
      max_choices: 1,
      end_condition: 'simple',
      keep: 2,
    },
  });

  async function callApi(values: z.infer<typeof formSchema>) {
    const { data, status } = await createPoll({
      ...values,
      description: null,
      assembly: null,
      round: poll.sub_polls.length + 2,
      parent_poll: poll.id,
      options: poll.results.map((result) => ({ content: result.content, id_original: result.id })),
    });

    if (status === 403) {
      router.push('/');
    }
    if (status !== 201) {
      toast.error('Erreur lors de la création du tour');
      return;
    }

    setPoll({ ...poll, sub_polls: [...poll.sub_polls, data] });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-2xl" variant="info">
          Ajouter un tour
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ScrollArea className="max-h-[80vh] p-4">
          <DialogHeader>
            <DialogTitle>Création d'un vote</DialogTitle>
            <DialogDescription className="p-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(callApi)} method="POST">
                  <div className="grid gap-2">
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Titre</Label>
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
                        name="start_at"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Date de début</Label>
                            <FormControl>
                              <Input {...field} type="datetime-local" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="end_at"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Date de fin</Label>
                            <FormControl>
                              <Input {...field} type="datetime-local" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="end_condition"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Type de vote</Label>
                            <Select onValueChange={field.onChange} defaultValue="simple">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {endConditions.map((endType) => (
                                  <SelectGroup key={endType.key} title={endType.value}>
                                    <SelectItem value={endType.key}>{endType.value}</SelectItem>
                                  </SelectGroup>
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
                        name="max_choices"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Choix maximum</Label>
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
                        name="keep"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Nombre de choix à conserver</Label>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default AddRound;
