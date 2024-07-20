'use client';

import type { Address, Material } from '@/app/lib/type/Materials';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { toast } from '@repo/ui/components/ui/sonner';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  materials: Material[];
  addresses: Address[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

function AddNewMaterial({ materials, addresses, setMaterials }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    id_material: z.coerce.number({ message: 'Le champ est requis' }).min(1, { message: 'Le champ est requis' }),
    id_address: z.coerce.number({ message: 'Le champ est requis' }).min(1, { message: 'Le champ est requis' }),
    quantity: z.coerce.number({ message: 'Le champ est requis' }).min(1, { message: 'Le champ est requis' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_material: undefined,
      id_address: undefined,
      quantity: undefined,
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/materials/${values.id_material}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        id_address: values.id_address,
        quantity: values.quantity,
      }),
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
        <Button className="flex gap-2" disabled={materials.length === 0}>
          <PlusCircle />
          <div>Ajouter du matériel à une adresse</div>
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
                      name="id_address"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Adresses</Label>
                          <Select onValueChange={field.onChange} defaultValue="-1">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Aucun" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {addresses.map((address) => (
                                <SelectItem key={address.id} value={address.id.toString()}>
                                  {address.name ?? `${address.number}, ${address.road}`}
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
                      name="id_material"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Matériel</Label>
                          <Select onValueChange={field.onChange} defaultValue="-1">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Aucun" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materials?.map(
                                (material) =>
                                  material?.id && (
                                    <SelectItem key={material.id} value={String(material.id)}>
                                      {material.name}
                                    </SelectItem>
                                  ),
                              )}
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
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Quantité</Label>
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

export default AddNewMaterial;
