'use client';

import type { Assembly } from '@/app/(dashboard)/dashboard/assemblies/utils';
import type { Poll } from '@/app/lib/type/Votes';
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
import { toast } from '@repo/ui/components/ui/sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@ui/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  assemblies: Assembly[];
}

function AddPoll({ polls, setPolls, assemblies }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    title: z.string().min(2, { message: 'Le titre doit contenir au moins 2 caractères' }),
    description: z.string().optional(),
    start_at: z.string(),
    end_at: z.string(),
    max_choices: z.coerce.number().min(1, { message: 'Le nombre de choix doit être supérieur à 0' }),
    assembly: z.string().optional(),
    options: z.array(
      z.object({ content: z.string().min(2, { message: 'Le choix doit contenir au moins 2 caractères' }) }),
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      start_at: '',
      end_at: '',
      max_choices: 1,
      assembly: '0', // 0 = null
      options: [{ content: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  async function callApi(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        start_at: new Date(values.start_at).toISOString(),
        end_at: new Date(values.end_at).toISOString(),
        max_choices: values.max_choices,
        assembly: values.assembly === '0' ? null : Number(values.assembly),
        options: values.options,
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data: Poll) => {
        toast.success('Vote créé', { duration: 2000, description: 'Le vote a été créé avec succès' });
        setPolls([...polls, data]);
        form.reset();
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 2000, description: 'Une erreur est survenue' });
      });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter un vote</span>
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
                        name="assembly"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Assemblée générale</Label>
                            <FormControl>
                              <Select name="assembly" required onValueChange={field.onChange} defaultValue="0">
                                <SelectTrigger className="w-full rounded-lg bg-background pl-8 text-black border border-gray-300">
                                  <SelectValue {...field} placeholder="Assemblée" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem key={0} value={'0'}>
                                      Aucune assemblée
                                    </SelectItem>
                                    {assemblies?.map((assembly) => (
                                      <SelectItem key={assembly.id} value={String(assembly.id)}>
                                        {assembly.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="grid gap-2">
                          <FormField
                            control={form.control}
                            name={`options.${index}.content`}
                            render={({ field }) => (
                              <FormItem>
                                <Label className="font-bold">Choix {index + 1}</Label>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        append({ content: '' });
                      }}
                    >
                      Ajouter un choix
                    </Button>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
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

export default AddPoll;
