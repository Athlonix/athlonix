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
import { toast } from '@repo/ui/components/ui/sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@ui/components/ui/select';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Setter = {
  title: React.Dispatch<React.SetStateAction<string>>;
  description: React.Dispatch<React.SetStateAction<string | null>>;
  maxChoices: React.Dispatch<React.SetStateAction<number>>;
  startAt: React.Dispatch<React.SetStateAction<string>>;
  endAt: React.Dispatch<React.SetStateAction<string>>;
};

interface Props {
  poll: Poll;
  setter: Setter;
  assemblies: Assembly[];
}

function EditPoll({ poll, setter, assemblies }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    title: z.string().min(2, { message: 'Le titre doit contenir au moins 2 caractères' }),
    description: z.string().optional(),
    max_choices: z.coerce.number().min(1, { message: 'Le nombre de choix doit être supérieur à 0' }),
    assembly: z.string().nullable(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: poll.title,
      description: poll.description || '',
      max_choices: poll.max_choices,
      assembly: String(poll.assembly) === 'null' ? '0' : String(poll.assembly),
    },
  });

  async function submitEdit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/polls/${poll.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        max_choices: values.max_choices,
        assembly: values.assembly === '0' ? null : Number(values.assembly),
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data: Poll) => {
        setter.title(data.title);
        setter.description(data.description);
        setter.maxChoices(data.max_choices);
        toast.success('Succès', { duration: 2000, description: 'Le vote a été modifié avec succès' });
      })
      .catch((error: Error) => {
        console.error(error);
        toast.error('Erreur', { duration: 2000, description: 'Une erreur est survenue' });
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <MoreHorizontal size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modification du vote</DialogTitle>
          <DialogDescription className="mx-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitEdit)} method="POST">
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
                </div>
                <div className="grid">
                  <FormField
                    control={form.control}
                    name="assembly"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="font-bold">Assemblée générale</Label>
                        <FormControl>
                          <Select
                            name="assembly"
                            required
                            onValueChange={field.onChange}
                            defaultValue={field.value || '0'}
                          >
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
                <div className="flex gap-4 mt-4">
                  <Button type="submit" className="w-full">
                    Modifier
                  </Button>
                  <Button variant="secondary" type="button" className="w-full">
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

export default EditPoll;
