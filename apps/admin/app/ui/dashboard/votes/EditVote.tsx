'use client';

import type { Vote } from '@/app/(dashboard)/dashboard/votes/page';
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
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Setter = {
  title: React.Dispatch<React.SetStateAction<string>>;
  description: React.Dispatch<React.SetStateAction<string>>;
  maxChoices: React.Dispatch<React.SetStateAction<number>>;
  startAt: React.Dispatch<React.SetStateAction<string>>;
  endAt: React.Dispatch<React.SetStateAction<string>>;
};

interface Props {
  vote: Vote;
  setter: Setter;
}

function EditVote({ vote, setter }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    title: z.string().min(2, { message: 'Le titre doit contenir au moins 2 caractères' }),
    description: z.string().optional(),
    max_choices: z.coerce.number().min(1, { message: 'Le nombre de choix doit être supérieur à 0' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: vote.title,
      description: vote.description,
      max_choices: vote.max_choices,
    },
  });

  async function submitEdit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/polls/${vote.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        max_choices: values.max_choices,
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data: Vote) => {
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

export default EditVote;
