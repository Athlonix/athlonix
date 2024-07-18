'use client';

import type { Address, Sport, Tournament } from '@/app/lib/type/Tournaments';
import { getTournament } from '@/app/lib/utils/tournaments';
import AddTournaments from '@/app/ui/dashboard/tournaments/AddTournaments';
import TournamentsList from '@/app/ui/dashboard/tournaments/TournamentsList';
import PaginationComponent from '@repo/ui/components/ui/PaginationComponent';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Tabs, TabsContent } from '@repo/ui/components/ui/tabs';
import { toast } from '@ui/components/ui/sonner';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ShowContent({ addresses, sports }: { addresses: Address[]; sports: Sport[] }): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  let page = searchParams.get('page') || 1;
  if (typeof page === 'string') {
    page = Number.parseInt(page);
  }
  const [maxPage, setMaxPage] = useState<number>(1);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data, status } = await getTournament(page, searchTerm);

      if (status === 403) {
        router.push('/');
        return;
      }
      if (status !== 200) {
        toast.error('Erreur', { duration: 2000, description: 'Une erreur est survenue' });
      }
      setTournaments(data.data);
      setMaxPage(Math.ceil(data.count / 10));
    }, 500);

    return () => clearTimeout(timer);
  }, [page, searchTerm, router]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TabsContent value="all">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tournois</CardTitle>
          <AddTournaments
            tournaments={tournaments}
            setTournaments={setTournaments}
            addresses={addresses}
            sports={sports}
          />
        </CardHeader>
        <CardContent>
          <div className="ml-auto flex items-center gap-2">
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du tournois</TableHead>
                <TableHead>Durée par défaut</TableHead>
                <TableHead>Nombre d'équipe max</TableHead>
                <TableHead>Nombre de joueur par équipe</TableHead>
                <TableHead>Addresse</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TournamentsList tournaments={tournaments} addresses={addresses} sports={sports} />
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <PaginationComponent page={page} maxPage={maxPage} href="/dashboard/tournaments" />
        </CardFooter>
      </Card>
    </TabsContent>
  );
}

function page() {
  const urlApi = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);

  useEffect(() => {
    fetch(`${urlApi}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data) => {
        setAddresses(data.data);
      })
      .catch((error: Error) => {
        console.error(error);
      });

    fetch(`${urlApi}/sports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data) => {
        setSports(data.data);
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }, [router.push, urlApi]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="grid flex-1 items-start">
          <Tabs defaultValue="all">
            <Suspense>
              <ShowContent addresses={addresses} sports={sports} />
            </Suspense>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

export default page;
