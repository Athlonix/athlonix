'use client';

import AddVote from '@/app/ui/dashboard/votes/AddVote';
import VotesList from '@/app/ui/dashboard/votes/VotesList';
import PaginationComponent from '@repo/ui/components/ui/PaginationComponent';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Tabs, TabsContent } from '@repo/ui/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { type Assembly, getAssemblies } from '../assemblies/utils';

export type Vote = {
  id: number;
  title: string;
  description: string;
  id_user: number;
  max_choices: number;
  start_at: string;
  end_at: string;
  assembly: number | null;
  results: { id: number; votes: number; content: string }[];
};

type VoteData = {
  data: Vote[];
  count: number;
};

function ShowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let page = searchParams.get('page') || 1;
  if (typeof page === 'string') {
    page = Number.parseInt(page);
  }

  const [maxPage, setMaxPage] = useState<number>(1);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;
    const fetchAssemblies = async () => {
      const assemblies = await getAssemblies();
      assemblies.data.filter((assembly) => assembly.closed === false);
      setAssemblies(assemblies.data);
    };

    setTimeout(() => {
      const queryParams = new URLSearchParams({
        skip: `${page - 1}`,
        take: '10',
        search: searchTerm,
      });

      fetch(`${urlApi}/polls?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then(async (response) => {
          if (response.status === 403) {
            router.push('/');
          }
          return response.json();
        })
        .then((data: VoteData) => {
          setVotes(data.data);
          setMaxPage(Math.ceil(data.count / 10));
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }, 500);
    fetchAssemblies();
  }, [page, searchTerm, router]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TabsContent value="all">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des votes</CardTitle>
          <AddVote votes={votes} setVotes={setVotes} assemblies={assemblies} />
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
                <TableHead>Titre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date de début</TableHead>
                <TableHead>Date de fin</TableHead>
                <TableHead>Choix maximum</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <VotesList votes={votes} />
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <PaginationComponent page={page} maxPage={maxPage} href="/dashboard/votes" />
        </CardFooter>
      </Card>
    </TabsContent>
  );
}

export default function Votes() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="grid flex-1 items-start">
          <Tabs defaultValue="all">
            <Suspense>
              <ShowContent />
            </Suspense>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
