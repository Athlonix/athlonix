'use client';

import type { Activity, Address, Sport } from '@/app/lib/type/Activities';
import { getActivities, getAddresses, getSports } from '@/app/lib/utils/activities';
import ActivitiesList from '@/app/ui/dashboard/activities/ActivitiesList';
import AddActivity from '@/app/ui/dashboard/activities/AddActivity';
import PaginationComponent from '@repo/ui/components/ui/PaginationComponent';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { toast } from '@repo/ui/components/ui/sonner';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Tabs, TabsContent } from '@repo/ui/components/ui/tabs';
import Loading from '@ui/components/ui/loading';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

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
    const timer = setTimeout(async () => {
      const { data, status } = await getActivities(page, searchTerm);

      if (status === 200) {
        setActivities(data.data);
        setMaxPage(Math.ceil(data.count / 10));
      } else if (status === 403) {
        router.push('/');
      } else {
        toast.error('Une erreur est survenue lors de la récupération des activités', { duration: 2000 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [page, searchTerm, router]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (activities.length === 0) {
    return <Loading />;
  }

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
    const fetchData = async () => {
      const { data: sportsData, status: sportsStatus } = await getSports();

      if (sportsStatus === 200) {
        setSports(sportsData.data);
      } else if (sportsStatus === 403) {
        router.push('/');
      } else {
        toast.error('Une erreur est survenue lors de la récupération des sports', { duration: 2000 });
      }

      const { data: addressesData, status: addressesStatus } = await getAddresses();

      if (addressesStatus === 200) {
        setAddresses(addressesData.data);
      } else if (addressesStatus === 403) {
        router.push('/');
      } else {
        toast.error('Une erreur est survenue lors de la récupération des adresses', { duration: 2000 });
      }
    };

    fetchData();
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
