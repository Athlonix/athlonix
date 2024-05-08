import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/ui/accordion';
import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { useToast } from '@repo/ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Setter {
  username: Dispatch<SetStateAction<string>>;
  firstName: Dispatch<SetStateAction<string>>;
  lastName: Dispatch<SetStateAction<string>>;
  roles: Dispatch<
    SetStateAction<
      {
        id: number;
        name: string;
      }[]
    >
  >;
}

interface EditFormProps {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  roles: number[];
  closeDialog: () => void;
  setter: Setter;
}

function EditForm(props: EditFormProps): JSX.Element {
  const roles = [
    { id: 1, label: 'Banni' },
    { id: 2, label: 'Membre' },
    { id: 3, label: 'Rédacteur' },
    { id: 4, label: 'Modérateur' },
    { id: 5, label: 'Administrateur' },
    { id: 6, label: 'Directeur' },
    { id: 7, label: 'Secrétaire' },
    { id: 8, label: 'Trésorier' },
    { id: 9, label: 'Président' },
  ];

  const formSchema = z.object({
    username: z.string().min(2, { message: "Le nom d'utilisateur doit contenir au moins 2 caractères" }),
    firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
    lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    roles: z.array(z.number()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: props.username,
      firstName: props.firstName,
      lastName: props.lastName,
      roles: props.roles,
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  async function submitEdit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/users/${props.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        username: values.username,
        first_name: values.firstName,
        last_name: values.lastName,
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

    fetch(`${urlApi}/users/${props.id}/roles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        roles: values.roles,
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

    props.setter.username(values.username);
    props.setter.firstName(values.firstName);
    props.setter.lastName(values.lastName);
    props.setter.roles(
      roles.map((role) => ({ id: role.id, name: role.label })).filter((role) => values.roles?.includes(role.id)),
    );

    toast({ title: 'Succès', description: 'Utilisateur modifié avec succès' });

    props.closeDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitEdit)} method="POST">
        <div className="grid gap-2">
          <div className="grid">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">Nom d'utilisateur</Label>
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">Prénom</Label>
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">Nom</Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid">
              <FormField
                control={form.control}
                name="roles"
                render={() => (
                  <FormItem>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="role">
                        <AccordionTrigger className="font-bold">Roles</AccordionTrigger>
                        <AccordionContent>
                          {roles.map((role) => (
                            <FormField
                              key={role.id}
                              control={form.control}
                              name="roles"
                              render={({ field }) => {
                                return (
                                  <FormItem key={role.id}>
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(role.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), role.id])
                                            : field.onChange(field.value?.filter((value) => value !== role.id));
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{role.label}</FormLabel>
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
            <div className="mt-5 flex justify-end gap-4">
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
          </div>
        </div>
      </form>
    </Form>
  );
}

export default EditForm;
