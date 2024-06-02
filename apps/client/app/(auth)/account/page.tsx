'use client';
import { type User, getUserAvatar } from '@/app/ui/NavBar';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Icons = {
  spinner: Loader2,
};

function checkSubscription(user: User): boolean {
  if (user.subscription === null) {
    return false;
  }

  if (user.date_validity === null || new Date(user.date_validity) < new Date()) {
    return false;
  }

  return true;
}

async function updateUserInformation(id: number, username: string, first_name: string, last_name: string) {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify({
      username,
      first_name,
      last_name,
    }),
  })
    .then(async (response) => await response.json())
    .then((data: { user: User }) => {
      console.log(data);
      if ('error' in data) {
        return;
      }
      localStorage.setItem('user', JSON.stringify(data));
    })
    .catch((error: Error) => console.log(error));
}

export default function UserAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem('user')) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(localStorage.getItem('user') as string) as User;
      setUser(user);
      setSubscription(checkSubscription(user));
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icons.spinner className="w-12 h-12 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-center">No user found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 md:px-6">
      <div className="absolute top-2 left-0 mt-4 ml-4">
        <Link href="/" className="flex items-center">
          <img src="/favicon.ico" alt="Accueil" width="32" height="32" />
          <h2 className="ml-2 font-bold">Athlonix</h2>
        </Link>
      </div>
      <header className="flex items-center gap-4 mb-8">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{getUserAvatar()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{`@${user?.username}`}</p>
        </div>
      </header>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1">
              <Label className="font-bold text-lg">Pseudo</Label>
              <Input
                value={user?.username}
                onChange={(e) => {
                  setUser({ ...user, username: e.target.value });
                }}
              />
              <Label className="font-bold text-lg">Prénom</Label>
              <Input
                value={user?.first_name}
                onChange={(e) => {
                  setUser({ ...user, first_name: e.target.value });
                }}
              />
              <Label className="font-bold text-lg">Nom</Label>
              <Input
                value={user?.last_name}
                onChange={(e) => {
                  setUser({ ...user, last_name: e.target.value });
                }}
              />
              <Button
                className="w-[120px] text-center mt-4"
                onClick={() => updateUserInformation(user.id, user.username, user.first_name, user.last_name)}
              >
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cotisation Annuelle</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              {subscription ? (
                <div className="flex items-center gap-2">
                  <Badge variant="success">Active</Badge>
                  <span>Valid until {new Date(user?.date_validity as string).toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Inactive</Badge>
                  <span>Votre abonnement a expiré ou est inactif</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {!subscription ? (
              <Button variant="secondary" className="mr-2">
                <Link href="https://buy.stripe.com/test_dR6dUnd8E83ggx2001" target="_blank">
                  Activer mon abonnement
                </Link>
              </Button>
            ) : (
              <Button variant="secondary" className="mr-2">
                <Link href="https://billing.stripe.com/p/login/test_8wMdSB7u77k87D2bII" target="_blank">
                  Editer mes informations
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
