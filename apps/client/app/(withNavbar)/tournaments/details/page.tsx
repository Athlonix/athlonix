'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import { toast } from '@repo/ui/components/ui/sonner';
import { User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
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
  description: string | null;
  id_sport: number | null;
};

interface TeamsData {
  data: Teams[];
  count: number;
}

export type Teams = {
  id: number;
  name: string;
  validate: boolean;
  users: {
    id: number;
    username: string;
  }[];
};

function ShowContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 1;

  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Teams[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    }
  }, []);

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/tournaments/${id}`, {
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
      .then((data) => {
        setTournament(data);
      })
      .catch((error: Error) => toast.error(error.message, { duration: 5000 }));

    fetch(`${urlApi}/tournaments/${id}/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Erreur lors de la récupération des équipes');
        }
        return response.json();
      })
      .then((data: TeamsData) => {
        setTeams(data.data);
      })
      .catch((error: Error) => toast.error(error.message, { duration: 5000 }));
  }, [id]);

  return (
    <>
      <div className="flex justify-center w-full my-4">
        <h1 className="font-bold">{tournament?.name}</h1>
      </div>
      <Separator className="my-8" />
      <div className="grid gap-2 text-4xl mx-12">
        {tournament?.description?.split('\n').map((line) => (
          <p key={`${line}`}>{line}</p>
        ))}
      </div>
      <Separator className="my-8" />
      <div className="flex justify-center w-full my-4">
        <h2 className="font-bold">Règles</h2>
      </div>
      <Separator className="my-8" />
      <div className="grid gap-2 text-4xl mx-12">
        {tournament?.rules?.split('\n').map((line) => (
          <p key={`${line}`}>{line}</p>
        ))}
      </div>
      {tournament?.prize && (
        <>
          <div className="flex justify-center w-full my-4">
            <h2 className="font-bold">Prix</h2>
          </div>
          <Separator className="my-8" />
          <div className="grid gap-2 text-4xl mx-12">
            {tournament?.prize.split('\n').map((line) => (
              <p key={`${line}`}>{line}</p>
            ))}
          </div>
        </>
      )}
      <Separator className="my-8" />
      <div className="flex justify-center w-full my-4">
        <h2 className="font-bold">Equipes</h2>
      </div>
      {teams.length === 0 && (
        <div className="flex justify-center w-full my-4">
          <p>Aucune équipe inscrite</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 justify-between">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`grid gap-2 p-4 border-2 ${team.users.length === tournament?.team_capacity ? (team.validate ? 'border-green-400' : 'border-orange-500') : 'border-gray-300'} rounded-sm`}
          >
            <div className="flex items-center gap-2">
              <div className="font-bold text-2xl">{team.name},</div>
              <User width={32} height={32} />
              <div className="font-bold text-2xl">
                {team.users.length}/{tournament?.team_capacity}
              </div>
            </div>
            <ul>
              {team.users.map((user) => (
                <li key={user.id}>
                  {user.username}
                  {currentUser?.id === user.id && <span> (Vous)</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Separator className="my-8" />
      <div className="flex justify-center w-full my-4">
        <Button>Participer</Button>
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
