'use client';

import PaginationComponent from '@/app/ui/Pagination';
import ActivitiesList from '@/app/ui/dashboard/activities/ActivitiesList';
import AddActivity from '@/app/ui/dashboard/activities/AddActivity';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Tabs, TabsContent } from '@repo/ui/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

type Activity = {
  id: number;
  min_participants: number;
  max_participants: number;
  name: string;
  id_sport: number | null;
  id_address: number | null;
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  end_date: string;
  start_date: string;
  description: string | null;
  recurrence: 'weekly' | 'monthly' | 'annual';
  interval: number;
};

type ActivityData = {
  data: Activity[];
  count: number;
};

type Sport = {
  id: number;
  name: string;
  max_participants: number | null;
  min_participants: number;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

type SportData = {
  data: Sport[];
  count: number;
};

type AddressData = {
  data: Address[];
  count: number;
};

function ShowContent({ sports, addresses }: { sports: Sport[]; addresses: Address[] }): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  let page = searchParams.get('page') || 1;
  if (typeof page === 'string') {
    page = Number.parseInt(page);
  }

  const [maxPage, setMaxPage] = useState<number>(1);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams({
        skip: `${page - 1}`,
        take: '10',
        search: searchTerm,
      });

      fetch(`${urlApi}/activities?${queryParams}`, {
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
        .then((data: ActivityData) => {
          setActivities(data.data);
          setMaxPage(Math.ceil(data.count / 10));
        })
        .catch((error: Error) => {
          console.log(error);
        });
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
          <CardTitle>Activités</CardTitle>
          <AddActivity activities={activities} setActivities={setActivities} addresses={addresses} sports={sports} />
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
                <TableHead>Nom de l'activité</TableHead>
                <TableHead>Nombre de participants</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Fréquence</TableHead>
                <TableHead>Dates et heure</TableHead>
                <TableHead>Intervalle</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ActivitiesList activities={activities} sports={sports} addresses={addresses} />
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <PaginationComponent page={page} maxPage={maxPage} href="/dashboard/activities" />
        </CardFooter>
      </Card>
    </TabsContent>
  );
}

export default function Page(): JSX.Element {
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const queryParams = new URLSearchParams({
      all: 'true',
    });

    fetch(`${urlApi}/sports?${queryParams}`, {
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
      .then((data: SportData) => {
        const sportsArray = data.data.map((sport) => {
          return {
            id: sport.id,
            name: sport.name,
            max_participants: sport.max_participants,
            min_participants: sport.min_participants,
          };
        });
        setSports(sportsArray);
      })
      .catch((error: Error) => {
        console.log(error);
      });

    fetch(`${urlApi}/addresses?${queryParams}`, {
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
      .then((data: AddressData) => {
        const addressesArray = data.data.map((address) => {
          return {
            id: address.id,
            road: address.road,
            number: address.number,
            complement: address.complement,
            name: address.name,
          };
        });
        setAddresses(addressesArray);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [router]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="grid flex-1 items-start">
          <Tabs defaultValue="all">
            <Suspense>
              <ShowContent sports={sports} addresses={addresses} />
            </Suspense>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
