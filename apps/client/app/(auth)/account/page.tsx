'use client';
import {
  type User,
  checkSubscriptionStatus,
  getUserFromDB,
  saveUserCookie,
  updateUserInformation,
} from '@/app/lib/utils';
import { Avatar, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import Loading from '@repo/ui/components/ui/loading';
import { toast } from '@repo/ui/components/ui/sonner';
import { CircleArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function UserAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<null | 'applied' | 'approved' | 'rejected'>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserFromDB();
      setUser(user || null);
      setStatus(await checkSubscriptionStatus(user));
      setLoading(false);
    };

    fetchData();
  }, []);

  const requestInvoice = async function handleRequestInvoice() {
    try {
      const token = localStorage.getItem('access_token') || '';
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/invoice`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (_error) {
      throw new Error('Une erreur est survenue lors de la demande de facture');
    } finally {
      toast.success('Facture envoyée par email');
    }
  };

  async function handleUpateUserInformation(user: User) {
    try {
      await updateUserInformation(user.id, user.username, user.first_name, user.last_name);
    } catch (error) {
      throw new Error('Failed to update file');
    } finally {
      toast.success('Informations mises à jour');
      saveUserCookie(user);
      setUser(user);
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-center">L'utilisateur n'a pas été trouvé</p>
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
        <CircleArrowLeft className="w-8 h-8" onClick={() => window.history.back()} cursor={'pointer'} />
        <Avatar className="h-12 w-12">
          <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
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
            <div className="grid grid-cols-2 gap-1">
              <div className="col-span-1">
                <Label className="font-bold text-lg mt-2">Pseudo</Label>
                <Input
                  value={user?.username}
                  type="text"
                  onChange={(e) => {
                    setUser({ ...user, username: e.target.value });
                  }}
                  required
                  maxLength={20}
                />
              </div>
              <div className="col-span-1">
                <Label className="font-bold text-lg mt-2">Email</Label>
                <Input value={user?.email} type="email" disabled />
              </div>
              <div className="col-span-1">
                <Label className="font-bold text-lg mt-2">Prénom</Label>
                <Input
                  value={user?.first_name}
                  type="text"
                  onChange={(e) => {
                    setUser({ ...user, first_name: e.target.value });
                  }}
                  required
                  maxLength={20}
                />
              </div>
              <div className="col-span-1">
                <Label className="font-bold text-lg mt-2">Nom</Label>
                <Input
                  value={user?.last_name}
                  type="text"
                  onChange={(e) => {
                    setUser({ ...user, last_name: e.target.value });
                  }}
                  required
                  maxLength={20}
                />
              </div>
              <div className="flex justify-center col-span-2">
                <Button
                  className="w-[120px] text-center mt-4 rounded-full align-middle"
                  onClick={() => {
                    handleUpateUserInformation(user);
                  }}
                  disabled={user?.username === '' || user?.first_name === '' || user?.last_name === ''}
                >
                  Editer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cotisation Annuelle</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              {status === 'approved' && (
                <div className="flex items-center gap-2">
                  <Badge variant="success">Active</Badge>
                  <span>
                    Votre abonnement est actif jusqu'au{' '}
                    {user?.date_validity ? new Date(user?.date_validity).toLocaleDateString() : ''}
                  </span>
                </div>
              )}
              {status === null && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Inactive</Badge>
                  <span>Votre abonnement a expiré ou est inactif</span>
                </div>
              )}
              {status === 'applied' && (
                <div className="flex items-center gap-2">
                  <Badge variant="default">En attente</Badge>
                  <span>Votre demande de souscription est en attente de validation</span>
                </div>
              )}
              {status === 'rejected' && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Rejetée</Badge>
                  <span>Votre demande de souscription a été rejetée</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {(status === null || status === 'rejected') && (
              <Button variant="secondary" className="mr-2">
                <Link href="https://buy.stripe.com/test_dR6dUnd8E83ggx2001" target="_blank">
                  Activer mon abonnement
                </Link>
              </Button>
            )}
            {status === 'approved' && (
              <>
                <Button variant="secondary" className="mr-2">
                  <Link href="https://billing.stripe.com/p/login/test_8wMdSB7u77k87D2bII" target="_blank">
                    Editer mes informations
                  </Link>
                </Button>
                <Button variant="secondary" className="mr-2" onClick={requestInvoice}>
                  Demander une facture
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
