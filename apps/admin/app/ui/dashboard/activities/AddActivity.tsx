'use client';

import type { Activity, Address, Sport } from '@/app/lib/type/Activities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/ui/accordion';
import { Button } from '@repo/ui/components/ui/button';
import { Calendar } from '@repo/ui/components/ui/calendar';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@repo/ui/components/ui/radio-group';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { toast } from '@repo/ui/components/ui/sonner';
import { TimePicker } from '@repo/ui/components/ui/time-picker';
import { cn } from '@repo/ui/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Paperclip, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  addresses: Address[];
  sports: Sport[];
}

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function AddActivity({ activities, setActivities, addresses, sports }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();
  const frenchDays = [
    { id: 'monday', name: 'Lundi' },
    { id: 'tuesday', name: 'Mardi' },
    { id: 'wednesday', name: 'Mercredi' },
    { id: 'thursday', name: 'Jeudi' },
    { id: 'friday', name: 'Vendredi' },
    { id: 'saturday', name: 'Samedi' },
    { id: 'sunday', name: 'Dimanche' },
  ];

  const formSchema = z
    .object({
      name: z.string().min(1, { message: 'Le champ est requis' }),
      min_participants: z.coerce
        .number({ message: 'Le champ doit uniquement contenir un nombre' })
        .int()
        .min(1, { message: 'Le champ est requis' }),
      max_participants: z.coerce
        .number({ message: 'Le champ doit uniquement contenir un nombre' })
        .int()
        .min(1, { message: 'Le champ est requis' }),
      id_sport: z.coerce.number().int().optional(),
      id_address: z.coerce.number().int().optional(),
      frequency: z.enum(['weekly', 'monthly', 'yearly']),
      days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional()),
      start_date: z.date(),
      end_date: z.date(),
      start_time: z.date(),
      end_time: z.date(),
      interval: z.coerce.number({ message: 'Le champ est requis' }).int().min(1, { message: 'Le champ est requis' }),
      description: z.string().optional(),
      image: z
        .any()
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
          message: `L'image doit faire moins de ${MAX_FILE_SIZE / 1000000} Mo`,
        })
        .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
          message: "L'image doit être au format jpeg, png ou wepb",
        }),
    })
    .refine((data) => data.min_participants <= data.max_participants, {
      message: 'Le nombre minimum de participants doit être inférieur ou égal au nombre maximum de participants',
      path: ['min_participants'],
    })
    .refine((data) => data.start_date <= data.end_date, {
      message: 'La date de début ne peut pas être après la date de fin',
      path: ['start_date'],
    })
    .refine((data) => data.start_time < data.end_time, {
      message: "L'heure de début ne peut pas être après l'heure de fin",
      path: ['start_time'],
    })
    .refine((data) => (data.frequency === 'weekly' ? data.days.length > 0 : true), {
      message: 'Vous devez sélectionner au moins un jour pour une récurrence hebdomadaire',
      path: ['frequency'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      min_participants: undefined,
      max_participants: undefined,
      id_sport: -1,
      id_address: -1,
      frequency: undefined,
      days: [],
      start_date: new Date(),
      end_date: new Date(),
      start_time: undefined,
      end_time: undefined,
      interval: 1,
      image: undefined,
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const formData = new FormData();
    formData.append('name', values.name);
    if (values.description) {
      formData.append('description', values.description);
    }
    formData.append('min_participants', values.min_participants.toString());
    formData.append('max_participants', values.max_participants.toString());
    formData.append('frequency', values.frequency);
    formData.append('interval', values.interval.toString());
    formData.append('start_date', values.start_date.toISOString().split('T')[0] || '');
    formData.append('end_date', values.end_date.toISOString().split('T')[0] || '');
    formData.append('start_time', values.start_time.toTimeString().split(' ')[0] || '');
    formData.append('end_time', values.end_time.toTimeString().split(' ')[0] || '');
    if (values.id_sport !== -1) formData.append('id_sport', String(values.id_sport) ?? null);
    if (values.id_address !== -1) formData.append('id_address', String(values.id_address) ?? null);
    for (const day of values.days) {
      if (day) {
        formData.append('days_of_week[]', day);
      }
    }
    formData.append('image', values.image[0]);

    fetch(`${urlApi}/activities`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    })
      .then(async (response) => {
        if (response.status === 403) {
          router.push('/');
        }
        if (response.status !== 201) {
          const error = await response.json();
          console.log(error);
          throw new Error(error.message);
        }
        return response.json();
      })
      .then((data: { id: number }) => {
        toast.success('Activité ajouté', { duration: 2000, description: "L'activité a été ajouté avec succès" });
        const newActivity: Activity = {
          id: data.id,
          name: values.name,
          min_participants: values.min_participants,
          max_participants: values.max_participants,
          id_sport: values.id_sport === -1 ? null : values.id_sport ?? null,
          id_address: values.id_address === -1 ? null : values.id_address ?? null,
          days_of_week: values.days.filter((day) => day !== undefined) as (
            | 'monday'
            | 'tuesday'
            | 'wednesday'
            | 'thursday'
            | 'friday'
            | 'saturday'
            | 'sunday'
          )[],
          end_date: values.end_time?.toISOString().split('T')[0] || '',
          start_date: values.start_time.toISOString().split('T')[0] || '',
          end_time: values.end_time.toTimeString().split(' ')[0] || '',
          start_time: values.start_time.toTimeString().split(' ')[0] || '',
          description: values.description || null,
          frequency: values.frequency,
        };
        if (activities.length < 10) {
          setActivities([...activities, newActivity]);
        }
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 20000, description: error?.message });
      });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter une activité</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout d'une activité</DialogTitle>
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
                            <Label className="font-bold">Nom de l'activité</Label>
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
                        name="min_participants"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Minimum de participants</Label>
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
                        name="max_participants"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Maximum de participants</Label>
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
                        name="frequency"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Fréquence</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="weekly" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Hébdomadaire</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="monthly" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Mensuelle</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="annual" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Annuelle</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem id="dateItem" {...(form.watch('frequency') === 'weekly' ? { hidden: true } : {})}>
                            <Label className="font-bold">Date de début</Label>
                            <br />
                            <Popover>
                              <FormControl>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, 'PPP', { locale: fr })
                                    ) : (
                                      <span>Choisissez une date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                              </FormControl>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  locale={fr}
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem id="dateItem" {...(form.watch('frequency') === 'weekly' ? { hidden: true } : {})}>
                            <Label className="font-bold">Date de fin</Label>
                            <br />
                            <Popover>
                              <FormControl>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, 'PPP', { locale: fr })
                                    ) : (
                                      <span>Choisissez une date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                              </FormControl>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  locale={fr}
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Heure de début</Label>
                            <br />
                            <Popover>
                              <FormControl>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, 'HH:mm:ss', { locale: fr })
                                    ) : (
                                      <span>Choisissez un horaire</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                              </FormControl>
                              <PopoverContent className="w-auto p-0">
                                <div className="p-3 border-t border-border">
                                  <TimePicker
                                    setDate={field.onChange}
                                    date={field.value ? new Date(field.value) : undefined}
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="end_time"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Heure de fin</Label>
                            <br />
                            <Popover>
                              <FormControl>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, 'HH:mm:ss', { locale: fr })
                                    ) : (
                                      <span>Choisissez un horaire</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                              </FormControl>
                              <PopoverContent className="w-auto p-0">
                                <div className="p-3 border-t border-border">
                                  <TimePicker
                                    setDate={field.onChange}
                                    date={field.value ? new Date(field.value) : undefined}
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="days"
                        render={() => (
                          <FormItem id="daysItem" {...(form.watch('frequency') !== 'weekly' ? { hidden: true } : {})}>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="role">
                                <AccordionTrigger className="font-bold">Jours</AccordionTrigger>
                                <AccordionContent>
                                  {frenchDays.map((day) => (
                                    <FormField
                                      key={day.id}
                                      control={form.control}
                                      name="days"
                                      render={({ field }) => {
                                        return (
                                          <FormItem key={day.id}>
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(
                                                  day.id as
                                                    | 'monday'
                                                    | 'tuesday'
                                                    | 'wednesday'
                                                    | 'thursday'
                                                    | 'friday'
                                                    | 'saturday'
                                                    | 'sunday'
                                                    | undefined,
                                                )}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([
                                                        ...(field.value || []),
                                                        day.id as
                                                          | 'monday'
                                                          | 'tuesday'
                                                          | 'wednesday'
                                                          | 'thursday'
                                                          | 'friday'
                                                          | 'saturday'
                                                          | 'sunday'
                                                          | undefined,
                                                      ])
                                                    : field.onChange(field.value?.filter((value) => value !== day.id));
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">{day.name}</FormLabel>
                                          </FormItem>
                                        );
                                      }}
                                    />
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
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
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddActivity;
