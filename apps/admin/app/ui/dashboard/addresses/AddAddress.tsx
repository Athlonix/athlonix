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

type Address = {
  id: number;
  road: string;
  postal_code: string;
  complement: string | null;
  city: string;
  number: number;
  name: string | null;
  id_lease: number | null;
};

interface Props {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

function addAddress({ addresses, setAddresses }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    road: z.string().min(1, { message: 'Le champ est requis' }),
    postal_code: z
      .string({ message: 'Le champ est requis' })
      .max(5, { message: 'Le code postal doit contenir 5 chiffres' })
      .min(5, { message: 'Le code postal doit contenir 5 chiffres' }),
    complement: z.string().optional(),
    city: z.string().min(1, { message: 'Le champ est requis' }),
    number: z.coerce
      .number({ message: 'Le numéro doit être un nombre' })
      .int()
      .min(1, { message: 'Le champ est requis' }),
    name: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      road: '',
      postal_code: '',
      complement: '',
      city: '',
      number: undefined,
      name: '',
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        road: values.road,
        postal_code: values.postal_code,
        complement: values.complement,
        city: values.city,
        number: values.number,
        name: values.name,
        id_lease: null,
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data: { id: number }) => {
        toast.success('Adresse ajouté', { duration: 2000, description: "L'adresse a été ajouté avec succès" });
        const newAddress: Address = {
          id: data.id,
          road: values.road,
          postal_code: values.postal_code,
          complement: values.complement || '',
          city: values.city,
          number: values.number,
          name: values.name || '',
          id_lease: null,
        };
        if (addresses.length < 10) {
          setAddresses([...addresses, newAddress]);
        }
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 2000, description: "L'adresse a été ajouté avec succès" });
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
              <form onSubmit={form.handleSubmit(submit)} method="POST">
                <div className="grid gap-2">
                  <div className="grid">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Alias de l'adresse</Label>
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
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Numéro</Label>
                          <FormControl>
                            <Input {...field} type="number" min={1} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid">
                    <FormField
                      control={form.control}
                      name="road"
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
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Complément d'adresse</Label>
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
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Ville</Label>
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
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Code postal</Label>
                          <FormControl>
                            <Input {...field} type="number" min={0} autoComplete="postal-code" />
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
