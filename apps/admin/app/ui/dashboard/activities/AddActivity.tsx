'use client';

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
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Activity = {
  id: number;
  name: string;
  min_participants: number;
  max_participants: number;
  id_sport: number | null;
  id_address: number | null;
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  end_date: string;
  start_date: string;
  description: string | null;
  recurrence: 'weekly' | 'monthly' | 'annual';
  interval: number;
};

type Sport = {
  id: number;
  name: string;
  max_participants: number | null;
  min_participants: number;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

interface Props {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  addresses: Address[];
  sports: Sport[];
}

function AddActivity({ activities, setActivities, addresses, sports }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
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
      recurrence: z.enum(['weekly', 'monthly', 'annual']),
      days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional()),
      date: z.date(),
      start_time: z.date(),
      end_time: z.date(),
      interval: z.coerce.number({ message: 'Le champ est requis' }).int().min(1, { message: 'Le champ est requis' }),
      description: z.string().optional(),
    })
    .refine((data) => data.min_participants <= data.max_participants, {
      message: 'Le nombre minimum de participants doit être inférieur ou égal au nombre maximum de participants',
      path: ['min_participants'],
    })
    .refine((data) => data.start_time < data.end_time, {
      message: "L'heure de début ne peut pas être après l'heure de fin",
      path: ['start_time'],
    })
    .refine((data) => (data.recurrence === 'weekly' ? data.days.length > 0 : true), {
      message: 'Vous devez sélectionner au moins un jour pour une récurrence hebdomadaire',
      path: ['recurrence'],
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
      recurrence: undefined,
      days: [],
      date: new Date(),
      start_time: undefined,
      end_time: undefined,
      interval: 1,
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    console.log(values);

    if (values.recurrence === 'weekly') {
      values.start_time = new Date(values.start_time);
      values.end_time = new Date(values.end_time);
    }
    if (values.recurrence === 'monthly' || values.recurrence === 'annual') {
      values.start_time = new Date(new Date(values.start_time).setDate(values.date.getDate()));
      values.end_time = new Date(new Date(values.end_time).setDate(values.date.getDate()));
    }

    fetch(`${urlApi}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        min_participants: values.min_participants,
        max_participants: values.max_participants,
        days: values.days,
        recurrence: values.recurrence,
        interval: values.interval,
        start_date: values.start_time,
        end_date: values.end_time,
        id_sport: values.id_sport === -1 ? null : values.id_sport ?? null,
        id_address: values.id_address === -1 ? null : values.id_address ?? null,
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
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
          days: values.days.filter((day) => day !== undefined) as (
            | 'monday'
            | 'tuesday'
            | 'wednesday'
            | 'thursday'
            | 'friday'
            | 'saturday'
            | 'sunday'
          )[],
          end_date: values.end_time.toISOString(),
          start_date: values.start_time.toISOString(),
          description: values.description || null,
          recurrence: values.recurrence,
          interval: values.interval,
        };
        if (activities.length < 10) {
          setActivities([...activities, newActivity]);
        }
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 2000, description: error?.message });
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
                            <Label className="font-bold">Activité</Label>
                            <Select onValueChange={field.onChange} defaultValue="-1">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Aucun" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="-1">Aucun</SelectItem>
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
                        name="recurrence"
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
                        name="date"
                        render={({ field }) => (
                          <FormItem id="dateItem" {...(form.watch('recurrence') === 'weekly' ? { hidden: true } : {})}>
                            <Label className="font-bold">Date</Label>
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
                          <FormItem id="daysItem" {...(form.watch('recurrence') !== 'weekly' ? { hidden: true } : {})}>
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
                    <div className="grid">
                      <FormField
                        control={form.control}
                        name="interval"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-bold">Intervalle</Label>
                            <FormControl>
                              <Input {...field} type="number" min={1} />
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
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddActivity;
