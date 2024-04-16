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

export default function SignupForm(): JSX.Element {
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(2, { message: "Veuillez saisir votre nom d'utilisateur" }),
    firstName: z.string().min(2, { message: 'Veuillez saisir votre prénom' }),
    lastName: z.string().min(2, { message: 'Veuillez saisir votre nom' }),
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string().min(8, { message: 'Veuillez saisir votre mot de passe' }),
    confirmPassword: z.string().min(8, { message: 'Veuillez confirmer votre mot de passe' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    fetch('http://localhost:3101/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        router.push('/login');
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="w-full lg:grid lg:h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:block">
        <Image
          src="/running_track.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12 relative">
        <div className="absolute top-0 left-0 mt-4 ml-4">
          <Link href="/" className="flex items-center">
            <Image src="/favicon.ico" alt="Retour" width="32" height="32" />
            <h2 className="ml-2 font-bold">Athlonix</h2>
          </Link>
        </div>
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-4xl font-bold mb-4">Inscription</h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-2 my-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="font-bold text-lg">Nom d'utilisateur</Label>
                        <FormControl>
                          <Input placeholder="Votre nom d'utilisateur" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2 my-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="font-bold text-lg">Prénom</Label>
                        <FormControl>
                          <Input placeholder="Votre prénom" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2 my-2">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="font-bold text-lg">Nom</Label>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2 my-2">
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
                <div className="grid gap-2 my-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="font-bold text-lg">Mot de passe</Label>
                        <FormControl>
                          <Input placeholder="Votre mot de passe" type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          <span>Le mot de passe doit comporter 8 caractères minimum</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2 mb-5">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="font-bold text-lg">Confirmation mot de passe</Label>
                        <FormControl>
                          <Input placeholder="Confirmer votre mot de passe" type="password" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  S'inscrire
                </Button>
              </div>
            </form>
          </Form>
          <div className="text-center text-sm">
            Vous avez déjà un compte ?{' '}
            <Link href="login" className="underline">
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
