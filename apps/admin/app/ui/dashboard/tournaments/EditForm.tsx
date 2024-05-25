import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { toast } from '@repo/ui/components/ui/sonner';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Setter {
  name: Dispatch<SetStateAction<string>>;
  default_match_length: Dispatch<SetStateAction<number | null>>;
  max_participants: Dispatch<SetStateAction<number>>;
  team_capacity: Dispatch<SetStateAction<number>>;
  id_address: Dispatch<SetStateAction<number | null>>;
  rules: Dispatch<SetStateAction<string | null>>;
  prize: Dispatch<SetStateAction<string | null>>;
}

type Tournament = {
  id: number;
  created_at: string;
  default_match_length: number | null;
  name: string;
  max_participants: number;
  team_capacity: number;
  rules: string | null;
  prize: string | null;
  id_address: number | null;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

interface EditFormProps {
  tournament: Tournament;
  addresses: Address[];
  closeDialog: () => void;
  setter: Setter;
}

function EditForm(props: EditFormProps): JSX.Element {
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
    rules: z.string().optional(),
    prize: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.tournament.name,
      default_match_length: props.tournament.default_match_length ?? undefined,
      max_participants: props.tournament.max_participants,
      team_capacity: props.tournament.team_capacity,
      id_address: props.tournament.id_address ?? undefined,
      rules: props.tournament.rules ?? '',
      prize: props.tournament.prize ?? '',
    },
  });

  const router = useRouter();

  async function submitEdit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/tournaments/${props.tournament.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 2000, description: error?.message });
      });

    props.setter.name(values.name);
    props.setter.default_match_length(values.default_match_length ?? null);
    props.setter.max_participants(values.max_participants);
    props.setter.team_capacity(values.team_capacity);
    props.setter.id_address(values.id_address ?? null);
    props.setter.rules(values.rules ?? null);
    props.setter.prize(values.prize ?? null);

    toast.success('Succès', { duration: 2000, description: 'Tournoi modifié avec succès' });

    props.closeDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitEdit)}>
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
              name="default_match_length"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">Durée par défaut d'un match</Label>
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
                  <Label className="font-bold">Nombre d'équipe max</Label>
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
              name="team_capacity"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">Nombre de joueur par équipe</Label>
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
              name="id_address"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">Tournoi</Label>
                  <Select onValueChange={field.onChange} defaultValue="-1">
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
          <Button type="submit">Modifier</Button>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              props.closeDialog();
            }}
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditForm;
