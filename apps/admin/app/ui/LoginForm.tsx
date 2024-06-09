'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { saveCookie } from '../lib/utils';

export type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  id_referer: number | null;
  id_auth: string | null;
  date_validity: string | null;
  created_at: string;
  deleted_at: string | null;
  invoice: string | null;
  subscription: string | null;
  status: 'applied' | 'approved' | 'rejected' | null;
  roles: { id: number; name: string }[];
};

export function LoginForm(): JSX.Element {
  const router = useRouter();
  const urlApi = process.env.NEXT_PUBLIC_API_URL;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formSchema = z.object({
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string().min(8, { message: 'Veuillez saisir votre mot de passe' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`${urlApi}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });
    if (!response.ok) {
      setErrorMessage('Email ou mot de passe incorrect');
      return;
    }
    const data = (await response.json()) as { user: User; token: string };
    const roles = data.user.roles;

    if (
      roles.some((role: { id: number }) => role.id === 5) &&
      data.user.status === 'approved' &&
      data.user.date_validity &&
      new Date(data.user.date_validity) > new Date()
    ) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.token);
      await saveCookie(data.user, data.token);
      router.push('/dashboard');
    } else {
      setErrorMessage("Vous ne disposez pas des droits d'accès.");
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="max-w-sm w-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Dashboard Athlonix</h1>
          </div>
          {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
          <div className="grid gap-4">
            <div className="grid gap-2 my-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-bold text-lg">Email</Label>
                    <FormControl>
                      <Input placeholder="Votre email" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-bold text-lg">Mot de passe</Label>
                    <FormControl>
                      <Input placeholder="Votre mot de passe" type="password" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Connexion
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
