'use client';

import type { Team, Tournament } from '@/app/lib/type/Tournaments';
import { getTournaments, getTournamentsTeams } from '@/app/lib/utils/tournament';
import JoinTeam from '@/app/ui/components/tournaments/JoinTeam';
import LeaveTeam from '@/app/ui/components/tournaments/LeaveTeam';
import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import { toast } from '@repo/ui/components/ui/sonner';
import { User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ShowContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '1';

  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [currentTeam, setCurrentTeam] = useState<number>(0);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    }
  }, []);

  useEffect(() => {
    const fetchTournament = async () => {
      const { data, status } = await getTournaments({ id });
      if (status !== 200) {
        toast.error('Une erreur est survenue', { duration: 2000 });
        return;
      }
      setTournament(data);
    };
    fetchTournament();

    const fetchTeams = async () => {
      const { data, status } = await getTournamentsTeams({ id });
      if (status !== 200) {
        toast.error('Une erreur est survenue', { duration: 2000 });
        return;
      }

      for (const team of data.data) {
        for (const user of team.users) {
          if (user.username === currentUser?.username) {
            setCurrentTeam(team.id);
            break;
          }
        }
      }

      setTeams(data.data);
    };
    fetchTeams();
  }, [id, currentUser?.username]);

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
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="font-bold text-2xl">{team.name},</div>
                <User width={32} height={32} />
                <div className="font-bold text-2xl">
                  {team.users.length}/{tournament?.team_capacity}
                </div>
              </div>
              <div>
                {currentTeam === 0 && (
                  <JoinTeam
                    id_tournament={Number.parseInt(id)}
                    team={team}
                    setter={setTeams}
                    username={currentUser?.username}
                    setCurrentTeam={setCurrentTeam}
                  />
                )}
                {currentTeam === team.id && (
                  <LeaveTeam
                    id_tournament={Number.parseInt(id)}
                    team={team}
                    setter={setTeams}
                    username={currentUser?.username}
                    setCurrentTeam={setCurrentTeam}
                  />
                )}
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
      <div className="flex justify-center w-full my-4">
        <Button>Créer une équipe</Button>
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
