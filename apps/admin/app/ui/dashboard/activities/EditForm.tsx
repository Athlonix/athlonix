import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/ui/accordion';
import { Button } from '@repo/ui/components/ui/button';
import { Calendar } from '@repo/ui/components/ui/calendar';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@repo/ui/components/ui/radio-group';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { TimePicker } from '@repo/ui/components/ui/time-picker';
import { useToast } from '@repo/ui/hooks/use-toast';
import { cn } from '@repo/ui/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Setter {
  name: Dispatch<SetStateAction<string>>;
  minParticipants: Dispatch<SetStateAction<number>>;
  maxParticipants: Dispatch<SetStateAction<number>>;
  idSport: Dispatch<SetStateAction<number | null>>;
  idAddress: Dispatch<SetStateAction<number | null>>;
  days: Dispatch<
    SetStateAction<('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]>
  >;
  endDate: Dispatch<SetStateAction<string>>;
  startDate: Dispatch<SetStateAction<string>>;
  description: Dispatch<SetStateAction<string | null>>;
  recurrence: Dispatch<SetStateAction<'weekly' | 'monthly' | 'annual'>>;
  interval: Dispatch<SetStateAction<number>>;
}

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

interface EditFormProps {
  activity: Activity;
  sports: Sport[];
  addresses: Address[];
  closeDialog: () => void;
  setter: Setter;
}

function EditForm(props: EditFormProps): JSX.Element {
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
      name: props.activity.name,
      min_participants: props.activity.min_participants,
      max_participants: props.activity.max_participants,
      id_sport: props.activity.id_sport || -1,
      id_address: props.activity.id_address || -1,
      recurrence: props.activity.recurrence,
      days: props.activity.days,
      date: new Date(props.activity.start_date),
      start_time: new Date(props.activity.start_date),
      end_time: new Date(props.activity.end_date),
      interval: props.activity.interval,
      description: props.activity.description || '',
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  async function submitEdit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/activities/${props.activity.id}`, {
      method: 'PATCH',
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
      .catch((error: Error) => {
        toast({ title: 'Erreur', description: error?.message });
      });

    props.setter.name(values.name);
    props.setter.description(values.description || '');
    props.setter.minParticipants(values.min_participants);
    props.setter.maxParticipants(values.max_participants);
    props.setter.days(
      values.days.filter((day) => day !== undefined) as (
        | 'monday'
        | 'tuesday'
        | 'wednesday'
        | 'thursday'
        | 'friday'
        | 'saturday'
        | 'sunday'
      )[],
    );
    props.setter.recurrence(values.recurrence);
    props.setter.interval(values.interval);
    props.setter.startDate(values.start_time.toISOString());
    props.setter.endDate(values.end_time.toISOString());
    props.setter.idSport(values.id_sport === -1 ? null : values.id_sport ?? null);
    props.setter.idAddress(values.id_address === -1 ? null : values.id_address ?? null);

    toast({ title: 'Succès', description: 'Activité modifié avec succès' });

    props.closeDialog();
  }

  return (
    <ScrollArea className="h-[500px] w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitEdit)}>
          <div className="grid gap-4 mx-4">
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={props.activity.id_sport !== null ? props.activity.id_sport.toString() : '-1'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Aucun" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="-1">Aucun</SelectItem>
                        {props.sports.map((sport) => (
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={props.activity.id_address !== null ? props.activity.id_address.toString() : '-1'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Aucun" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="-1">Aucun</SelectItem>
                        {props.addresses.map((address) => (
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
                          <TimePicker setDate={field.onChange} date={field.value ? new Date(field.value) : undefined} />
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
                          <TimePicker setDate={field.onChange} date={field.value ? new Date(field.value) : undefined} />
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
            <Button
              variant="secondary"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                props.closeDialog();
              }}
              className="w-full"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}

export default EditForm;
