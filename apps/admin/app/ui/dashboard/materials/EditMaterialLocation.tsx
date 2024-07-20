'use client';

import type { Material } from '@/app/lib/type/Materials';
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
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  id_material: number;
  id_address: number;
  quantity: number;
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

function EditMaterialLocation({ id_material, id_address, quantity, setMaterials }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    quantity: z.coerce.number().min(1, { message: 'Le champ est requis' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: quantity,
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/materials/${id_material}/quantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        quantity: values.quantity,
        id_address: id_address,
      }),
    })
      .then(async (response) => {
        if (response.status === 403) {
          router.push('/');
        }
        if (response.status !== 200) {
          throw new Error(await response.text());
        }
      })
      .then(() => {
        toast.success('Matériel modifié', { duration: 2000, description: 'Le Matériel a été modifié avec succès' });
        setMaterials((prevMaterials) =>
          prevMaterials.map((material) =>
            material.id === id_material
              ? {
                  ...material,
                  addresses: material.addresses.map((address) =>
                    address.id_address === id_address ? { ...address, quantity: values.quantity } : address,
                  ),
                }
              : material,
          ),
        );
        setOpen(false);
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 20000, description: error.message });
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Menu size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modification du matériel</DialogTitle>
          <DialogDescription className="mx-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)}>
                <div className="grid gap-4">
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
                    Modifier
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

export default EditMaterialLocation;
