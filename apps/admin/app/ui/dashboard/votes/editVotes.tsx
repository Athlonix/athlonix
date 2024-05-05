'use client';

import type { Vote } from '@/app/(dashboard)/dashboard/votes/page';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { useToast } from '@repo/ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  votes: Vote[];
  setVotes: React.Dispatch<React.SetStateAction<Vote[]>>;
  id: number;
  setEditingVote: React.Dispatch<React.SetStateAction<number | null>>;
}

function EditVote({ votes, setVotes, id, setEditingVote }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const editedVote = votes.find((vote) => vote.id === id);

  const formSchema = z.object({
    title: z.string().min(2, { message: 'Le titre doit contenir au moins 2 caractères' }),
    description: z.string().min(2, { message: 'La description doit contenir au moins 2 caractères' }),
    max_choices: z.number().min(1, { message: 'Le nombre de choix doit être supérieur à 0' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editedVote?.title || '',
      description: editedVote?.description || '',
      max_choices: editedVote?.max_choices || 1,
    },
  });

  async function callApi(values: z.infer<typeof formSchema>, id: number) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/polls/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        max_choices: Number(values.max_choices),
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data: Vote) => {
        setVotes(votes.map((vote) => (vote.id === id ? data : vote)));
        setEditingVote(null);
        toast({ title: 'Succès', description: 'Le vote a été modifié avec succès' });
      })
      .catch((error: Error) => {
        console.error(error);
        toast({ title: 'Erreur', description: 'Une erreur est survenue' });
      });
  }

  function setOpen(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: { title: string; description: string; max_choices: number }) =>
          callApi(values, id),
        )}
        method="POST"
      >
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
        <div className="flex gap-4 mt-4">
          <Button type="submit" className="w-full">
            Modifier
          </Button>
          <Button variant="secondary" type="button" onClick={() => setOpen(false)} className="w-full">
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditVote;
function setEditingVote(arg0: null) {
  throw new Error('Function not implemented.');
}
