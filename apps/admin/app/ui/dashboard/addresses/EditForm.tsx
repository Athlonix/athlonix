import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { toast } from '@repo/ui/components/ui/sonner';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Setter {
  road: Dispatch<SetStateAction<string>>;
  complement: Dispatch<SetStateAction<string | null>>;
  postalCode: Dispatch<SetStateAction<string>>;
  city: Dispatch<SetStateAction<string>>;
  number: Dispatch<SetStateAction<number>>;
  name: Dispatch<SetStateAction<string | null>>;
}

interface EditFormProps {
  id: number;
  road: string;
  postal_code: string;
  complement: string | null;
  city: string;
  number: number;
  name: string | null;
  closeDialog: () => void;
  setter: Setter;
}

function EditForm(props: EditFormProps): JSX.Element {
  const formSchema = z.object({
    road: z.string().min(1, { message: 'Le champ est requis' }),
    postal_code: z
      .string({ message: 'Le champ est requis' })
      .max(5, { message: 'Le code postal doit contenir 5 chiffres' })
      .min(5, { message: 'Le code postal doit contenir 5 chiffres' }),
    complement: z.string().optional(),
    city: z.string().min(1, { message: 'Le champ est requis' }),
    number: z.number({ message: 'Le numéro doit être un nombre' }).int().min(1, { message: 'Le champ est requis' }),
    name: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      road: props.road,
      postal_code: props.postal_code,
      complement: props.complement || '',
      city: props.city,
      number: props.number,
      name: props.name || '',
    },
  });

  const router = useRouter();

  async function submitEdit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/addresses/${props.id}`, {
      method: 'PATCH',
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
      }),
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

    props.setter.road(values.road);
    props.setter.complement(values.complement || '');
    props.setter.postalCode(values.postal_code);
    props.setter.city(values.city);
    props.setter.number(values.number);
    props.setter.name(values.name || '');

    toast.success('Succès', { duration: 2000, description: 'Adresse modifié avec succès' });

    props.closeDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitEdit)} method="POST">
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
                    <Input {...field} />
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
