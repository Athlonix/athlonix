'use client';

import type { Team, Tournament } from '@/app/lib/type/Tournaments';
import { getTournaments, getTournamentsTeams } from '@/app/lib/utils/tournament';
import CreateTeam from '@/app/ui/components/tournaments/CreateTeam';
import JoinTeam from '@/app/ui/components/tournaments/JoinTeam';
import LeaveTeam from '@/app/ui/components/tournaments/LeaveTeam';
import { Separator } from '@repo/ui/components/ui/separator';
import { toast } from '@repo/ui/components/ui/sonner';
import Loading from '@ui/components/ui/loading';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ShowContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '1';
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [currentTeam, setCurrentTeam] = useState<number>(0);
  const [validatedTeams, setValidatedTeams] = useState<number>(0);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      } else {
        router.push('/login');
        return;
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

    const fetchTeams = async () => {
      const { data, status } = await getTournamentsTeams({ id });
      if (status !== 200) {
        toast.error('Une erreur est survenue', { duration: 2000 });
        return;
      }

      let validated = 0;

      for (const team of data.data) {
        if (team.validate) {
          validated++;
          setValidatedTeams(validated);
        }
        for (const user of team.users) {
          if (user.username === currentUser?.username) {
            setCurrentTeam(team.id);
          }
        }
      }

      setTeams(data.data);

      if (!tournament?.max_participants) {
        return;
      }

      if (validated >= tournament.max_participants) {
        setTeams((prev) => prev.filter((team) => team.validate));
      }
    };
    fetchTeams();
  }, [id, currentUser?.username, router, tournament?.max_participants]);

  if (!tournament) return <Loading />;

  const imageUrl = `${process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL}/image/tournaments/tournament_${tournament.id}`;
  const placeholder = '/placeholder.jpg';

  return (
    <>
      <div className="flex justify-center w-full my-4">
        <h1 className="font-bold">{tournament.name}</h1>
      </div>
      <Separator className="my-8" />
      <div className="flex justify-center">
        <Image
          className="object-cover"
          width={1000}
          height={1000}
          src={imageError ? placeholder : imageUrl}
          style={{ width: '40vw', height: 'auto' }}
          alt={tournament.name}
          onError={() => setImageError(true)}
        />
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
            className={`grid gap-2 p-4 border-2 ${team.users.length === tournament.team_capacity ? (team.validate ? 'border-green-400' : 'border-orange-500') : 'border-gray-300'} rounded-sm`}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="font-bold text-2xl">{team.name},</div>
                <User width={32} height={32} />
                <div className="font-bold text-2xl">
                  {team.users.length}/{tournament.team_capacity}
                </div>
              </div>
              <div>
                {currentTeam === 0 && team.users.length < tournament.team_capacity && (
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
        {currentTeam === 0 && validatedTeams < tournament.max_participants && (
          <CreateTeam id_tournament={id} setTeams={setTeams} setCurrentTeam={setCurrentTeam} />
        )}
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
