import type { Team } from '@/app/lib/type/Tournaments';
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
import { Label } from '@repo/ui/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/ui/popover';
import { TimePicker } from '@repo/ui/components/ui/time-picker';
import { cn } from '@repo/ui/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface AddMatchProps {
  idTournament: string;
  idRound: number;
  teams: Team[];
}

function AddMatch(props: AddMatchProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z
    .object({
      date: z.date(),
      start_time: z.date().optional(),
      end_time: z.date().optional(),
      id_teams: z.array(z.number()).optional(),
    })
    .refine(
      (data) => {
        return data.start_time && data.end_time ? data.start_time < data.end_time : true;
      },
      { message: 'La date de début ne peut être après la date de fin', path: ['start_time'] },
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      start_time: new Date(),
      end_time: new Date(),
      id_teams: [],
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const start_time =
      values.start_time && values.date
        ? new Date(values.date).setHours(
            values.start_time.getHours(),
            values.start_time.getMinutes(),
            values.start_time.getSeconds(),
          )
        : null;

    const end_time =
      values.end_time && values.date
        ? new Date(values.date).setHours(
            values.end_time.getHours(),
            values.end_time.getMinutes(),
            values.end_time.getSeconds(),
          )
        : null;

    fetch(`${urlApi}/tournaments/${props.idTournament}/rounds/${props.idRound.toString()}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        start_time: start_time ? new Date(start_time).toISOString() : null,
        end_time: end_time ? new Date(end_time).toISOString() : null,
        teams: values.id_teams,
        winner: [],
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
          return;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    const url = `/dashboard/tournaments/matches?id_tournament=${props.idTournament}&created=true`;
    window.location.href = url;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Créer un match</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Création du match</DialogTitle>
          <DialogDescription className="mx-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)}>
                <div className="grid">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
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
                    name="id_teams"
                    render={() => (
                      <FormItem id="daysItem">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="role">
                            <AccordionTrigger className="font-bold">Equipes</AccordionTrigger>
                            <AccordionContent>
                              {props.teams
                                .filter((team) => team.validate)
                                .map((team) => (
                                  <FormField
                                    key={team.id}
                                    control={form.control}
                                    name="id_teams"
                                    render={({ field }) => {
                                      return (
                                        <FormItem key={team.id}>
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(team.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...(field.value || []), team.id])
                                                  : field.onChange(field.value?.filter((value) => value !== team.id));
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">{team.name}</FormLabel>
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

export default AddMatch;
