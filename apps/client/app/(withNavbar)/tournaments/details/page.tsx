'use client';

import type { Team, Tournament } from '@/app/lib/type/Tournaments';
import { getTournaments, getTournamentsTeams } from '@/app/lib/utils/tournament';
import CreateTeam from '@/app/ui/components/tournaments/CreateTeam';
import JoinTeam from '@/app/ui/components/tournaments/JoinTeam';
import LeaveTeam from '@/app/ui/components/tournaments/LeaveTeam';
import { Separator } from '@repo/ui/components/ui/separator';
import { toast } from '@repo/ui/components/ui/sonner';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ShowContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '1';
  const router = useRouter();

  const placeholder: Tournament = {
    id: 0,
    name: 'Chargement...',
    description: 'Chargement...',
    rules: 'Chargement...',
    prize: 'Chargement...',
    team_capacity: 0,
    created_at: new Date().toISOString(),
    default_match_length: 10,
    max_participants: 0,
    id_address: 0,
    id_sport: 0,
  };

  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [tournament, setTournament] = useState<Tournament>(placeholder);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchTournament = async () => {
      const { data, status } = await getTournaments({ id });
      if (status === 404) {
        router.push('/not-found');
      }
      if (status !== 200) {
        toast.error('Erreur lors de la récupération du tournoi', { duration: 5000 });
      }
      setTournament(data);
    };
    fetchTournament();
  }, [id, router]);

  return (
    <>
      <div className="flex justify-center w-full my-4">
        <h1 className="font-bold">{tournament.name}</h1>
      </div>
      <Separator className="my-8" />
      <div className="grid gap-2 text-4xl mx-12">
        {tournament.description?.split('\n').map((line) => (
          <p key={`${line}`}>{line}</p>
        ))}
      </div>
      <Separator className="my-8" />
      <div className="flex justify-center w-full my-4">
        <h2 className="font-bold">Règles</h2>
      </div>
      <Separator className="my-8" />
      <div className="grid gap-2 text-4xl mx-12">
        {tournament.rules?.split('\n').map((line) => (
          <p key={`${line}`}>{line}</p>
        ))}
      </div>
      {tournament.prize && (
        <>
          <div className="flex justify-center w-full my-4">
            <h2 className="font-bold">Prix</h2>
          </div>
          <Separator className="my-8" />
          <div className="grid gap-2 text-4xl mx-12">
            {tournament.prize.split('\n').map((line) => (
              <p key={`${line}`}>{line}</p>
            ))}
          </div>
        </>
      )}
      <Separator className="my-8" />
      <div className="flex justify-center">
        <div className="bg-slate-600 rounded-lg p-2">Pour vous inscrire, veuillez vous rendre sur l'espace membre.</div>
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
