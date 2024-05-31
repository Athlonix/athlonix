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
import { toast } from '@repo/ui/components/ui/sonner';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Material = {
  id_address: number;
  quantity: number;
  id: number;
  name: string;
  weight_grams: number | null;
};

interface Props {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

function AddMaterial({ materials, setMaterials }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  console.log(materials);

  const formSchema = z.object({
    name: z.string().min(1, { message: 'Le champ est requis' }),
    weight_grams: z.coerce.number().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      weight_grams: undefined,
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(values),
    })
      .then(async (response) => {
        if (response.status === 403) {
          router.push('/');
        }
        if (response.status !== 201) {
          throw new Error(await response.text());
        }
        return response.json();
      })
      .then((data) => {
        toast.success('Matériel ajouté', { duration: 2000, description: 'Le Matériel a été ajouté avec succès' });
        setMaterials([...materials, data]);
        setOpen(false);
        form.reset();
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 20000, description: error.message });
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter du matériel</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout de matériel</DialogTitle>
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
                          <Label className="font-bold">Nom du matériel</Label>
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
                      name="weight_grams"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Poids en grammes</Label>
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
                    Ajouter
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

export default AddMaterial;
