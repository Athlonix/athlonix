'use client';

import type { Address, Sport, Tournament } from '@/app/lib/type/Tournaments';
import { createTournament } from '@/app/lib/utils/tournaments';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { toast } from '@repo/ui/components/ui/sonner';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { Paperclip } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  tournaments: Tournament[];
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  addresses: Address[];
  sports: Sport[];
}

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function AddTournaments({ tournaments, setTournaments, addresses, sports }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1, { message: 'Le champ est requis' }),
    default_match_length: z.coerce
      .number({ message: 'Le champ doit contenir un nombre' })
      .min(1, { message: 'La durée ne peut être inférieur à 1' })
      .optional(),
    max_participants: z.coerce
      .number({ message: 'Le champ doit contenir un nombre' })
      .min(1, { message: 'Le nombre de participants ne peut être inférieur à 1' }),
    team_capacity: z.coerce
      .number({ message: 'Le champ doit contenir un nombre' })
      .min(1, { message: "La capacité de l'équipe ne peut être inférieur à 1" }),
    id_address: z.number().min(1).optional(),
    id_sport: z.number().min(1).optional(),
    rules: z.string().optional(),
    prize: z.string().optional(),
    image: z
      .any()
      .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
        message: `L'image doit faire moins de ${MAX_FILE_SIZE / 1000000} Mo`,
      })
      .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
        message: "L'image doit être au format jpeg, png ou wepb",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      default_match_length: undefined,
      max_participants: 1,
      team_capacity: 1,
      id_address: undefined,
      id_sport: undefined,
      rules: '',
      prize: '',
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('name', values.name);
    if (values.default_match_length) formData.append('default_match_length', values.default_match_length.toString());
    formData.append('max_participants', values.max_participants.toString());
    formData.append('team_capacity', values.team_capacity.toString());
    if (values.id_address) formData.append('id_address', values.id_address.toString());
    if (values.id_sport) formData.append('id_sport', values.id_sport.toString());
    if (values.rules) formData.append('rules', values.rules);
    if (values.prize) formData.append('prize', values.prize);
    formData.append('image', values.image[0]);

    const { data, status } = await createTournament(formData);

    if (status === 403) {
      router.push('/');
      return;
    }
    if (status !== 201) {
      toast.error('Erreur', { duration: 2000, description: 'Une erreur est survenue' });
      return;
    }
    toast.success('Tournoi ajouté', { duration: 2000, description: 'Le tournoi a été ajouté avec succès' });
    setTournaments([...tournaments, data]);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter un tournoi</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout d'un tournoi</DialogTitle>
          <ScrollArea className="h-[500px] w-full">
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
                            <Label className="font-bold">Nom du tournoi</Label>
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
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Image</Label>
                            {selectedImage && (
                              <div>
                                <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                              </div>
                            )}
                            <FormControl>
                              <div>
                                <Button size="lg" type="button">
                                  <input
                                    type="file"
                                    className="hidden"
                                    id="fileInput"
                                    accept="image/*"
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    onChange={(e) => {
                                      field.onChange(e.target.files);
                                      setSelectedImage(e.target.files?.[0] || null);
                                    }}
                                    ref={field.ref}
                                  />
                                  <label htmlFor="fileInput" className="inline-flex items-center">
                                    <Paperclip />
                                    <span className="whitespace-nowrap">Choisir une image</span>
                                  </label>
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="default_match_length"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Durée par défaut d'un match</Label>
                            <FormControl>
                              <Input {...field} type="number" min={1} max={2000} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="max_participants"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Nombre d'équipe max</Label>
                            <FormControl>
                              <Input {...field} type="number" min={2} max={100} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="team_capacity"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Nombre de joueur par équipe</Label>
                            <FormControl>
                              <Input {...field} type="number" min={1} max={1000} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="id_address"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Adresse</Label>
                            <Select onValueChange={field.onChange} defaultValue="-1">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Aucun" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="-1">Aucune</SelectItem>
                                {addresses.map((address) => (
                                  <SelectItem key={address.id} value={address.id.toString()}>
                                    {address.name}
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
                        name="id_sport"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Sport</Label>
                            <Select onValueChange={field.onChange} defaultValue="-1">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Aucun" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="-1">Aucun</SelectItem>
                                {sports.map((sport) => (
                                  <SelectItem key={sport.id} value={sport.id.toString()}>
                                    {sport.name}
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
                        name="rules"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Règles</Label>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="prize"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Récompenses</Label>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={form.formState.isSubmitting || !form.formState.isValid}
                    >
                      Créer
                    </Button>
                    <Button variant="secondary" type="button" onClick={() => setOpen(false)} className="w-full">
                      Annuler
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddTournaments;
