'use client';

import TournamentCard from '@/app/ui/components/tournaments/TournamentCard';
import PaginationComponent from '@repo/ui/components/ui/PaginationComponent';
import { Input } from '@repo/ui/components/ui/input';
import { Separator } from '@repo/ui/components/ui/separator';
import { toast } from '@repo/ui/components/ui/sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export type Tournament = {
  id: number;
  created_at: string;
  default_match_length: number | null;
  name: string;
  max_participants: number;
  team_capacity: number;
  rules: string | null;
  prize: string | null;
  id_address: number | null;
};

interface TournamentsData {
  data: Tournament[];
  count: number;
}

function ShowContent() {
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
    const timer = setTimeout(() => {
      const urlApi = process.env.NEXT_PUBLIC_API_URL;

      const queryParams = new URLSearchParams({
        skip: `${page - 1}`,
        take: '10',
        search: searchTerm,
      });

      fetch(`${urlApi}/tournaments?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Erreur lors de la récupération des tournois');
          }
          return response.json();
        })
        .then((data: TournamentsData) => {
          setTournaments(data.data);
          setMaxPage(Math.ceil(data.count / 10));
        })
        .catch((error: Error) => toast.error(error.message, { duration: 5000 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [page, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="flex justify-center w-full my-4">
        <h1 className="font-bold">Tournois</h1>
      </div>
      <Separator className="mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-full rounded-lg bg-background pl-8"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>
      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
      <div className="mt-8">
        <PaginationComponent page={page} maxPage={maxPage} href="/tournaments" />
      </div>
    </>
  );
}

function page() {
  return (
    <main>
      <Suspense fallback={<div>Chargement...</div>}>
        <ShowContent />
      </Suspense>
    </main>
  );
}

export default page;
