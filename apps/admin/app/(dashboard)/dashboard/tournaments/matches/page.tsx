'use client';

import PaginationComponent from '@/app/ui/Pagination';
import ReportsList from '@/app/ui/dashboard/posts/details/ReportsList';
import MatchesList from '@/app/ui/dashboard/tournaments/matches/MatchesList';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { Input } from '@repo/ui/components/ui/input';
import { toast } from '@repo/ui/components/ui/sonner';
import { MoreHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Round = {
  id: number;
  name: string;
  id_tournament: number;
  order: number;
};

type Team = {
  id: number;
  name: string;
};

type Match = {
  id: number;
  start_time: string | null;
  end_time: string | null;
  id_round: number;
  winner: number[];
  teams: Team[];
};

type RoundsData = {
  data: Round[];
  count: number;
};

type MatchesData = {
  data: Match[];
  count: number;
};

function page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idTournament = searchParams.get('id_tournament');
  const updated = searchParams.get('updated');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const hasFetchedData = useRef(false);

  if (updated) {
    toast.success('Match modifié', { duration: 2000, description: 'Le Match a été modifié avec succès' });
  }

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    if (hasFetchedData.current) {
      return;
    }
    hasFetchedData.current = true;

    fetch(`${urlApi}/tournaments/${idTournament}/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/login');
        }
        return response.json();
      })
      .then((data) => {
        setTeams(data.data);
      });

    fetch(`${urlApi}/tournaments/${idTournament}/rounds`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/login');
        }
        return response.json();
      })
      .then((data: RoundsData) => {
        setRounds(data.data);
        return data.data;
      })
      .then((rounds) => {
        rounds.map((round) => {
          fetch(`${urlApi}/tournaments/${idTournament}/rounds/${round.id}/matches`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          })
            .then((response) => {
              if (response.status === 403) {
                router.push('/login');
              }
              return response.json();
            })
            .then((data: MatchesData) => {
              setMatches((prev) => [...prev, ...data.data]);
            });
        });
      });
  }, [router, idTournament]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-semibold md:text-2xl">Tournoi</h1>
      </div>
      <div className="flex flex-col gap-4">
        {rounds.map((round) => (
          <MatchesList key={round.id} round={round} matches={matches} teams={teams} idTournament={idTournament || ''} />
        ))}
      </div>
    </main>
  );
}

export default page;
