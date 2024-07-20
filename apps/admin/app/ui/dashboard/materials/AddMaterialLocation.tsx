'use client';

import type { Material } from '@/app/lib/type/Materials';
import { addMaterial } from '@/app/lib/utils/Materials';
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
  id_address: number;
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

function AddMaterialLocation({ materials, id_address, setMaterials }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    id_material: z.coerce.number({ message: 'Le champ est requis' }).min(1, { message: 'Le champ est requis' }),
    quantity: z.coerce.number().min(1, { message: 'Le champ est requis' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_material: undefined,
      quantity: undefined,
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const { status } = await addMaterial(values.id_material, id_address, values.quantity);
    if (status === 403) {
      router.push('/');
    }
    if (status !== 201) {
      toast.error('Erreur', { duration: 20000, description: 'Une erreur est survenue' });
      return;
    }
    toast.success('Matériel ajouté', { duration: 2000, description: 'Le matériel a été ajouté avec succès' });
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.id === values.id_material
          ? {
              ...material,
              addresses: [...material.addresses, { id_address: id_address, quantity: values.quantity }],
            }
          : material,
      ),
    );
    setOpen(false);
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
                              {materials.map((material) => (
                                <SelectItem key={material.id} value={material.id.toString()}>
                                  {material.name}
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

export default AddMaterialLocation;
