'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const urlApi = process.env.NEXT_PUBLIC_API_URL;

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
    fetch(`${urlApi}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => response.json())
      .then((data: { user: Record<string, unknown>; token: string }) => {
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/?loggedIn=true');
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  return (
    <div className="w-full lg:grid lg:h-screen lg:grid-cols-2">
      <div className="absolute top-0 left-0 mt-4 ml-4">
        <Link href="/" className="flex items-center">
          <Image src="/favicon.ico" alt="Retour" width="32" height="32" />
          <h2 className="ml-2 font-bold">Athlonix</h2>
        </Link>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-4xl font-bold mb-4">Connexion</h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
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
          <div className="text-center text-sm">
            <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="text-center text-sm">
            Vous n&apos;avez pas de compte ?{' '}
            <Link href="signup" className="underline">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/ski.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
