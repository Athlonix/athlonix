'use client';

import type { Team, Tournament } from '@/app/lib/type/Tournaments';
import { getTournaments, getTournamentsTeams } from '@/app/lib/utils/tournament';
import CreateTeam from '@/app/ui/components/tournaments/CreateTeam';
import JoinTeam from '@/app/ui/components/tournaments/JoinTeam';
import LeaveTeam from '@/app/ui/components/tournaments/LeaveTeam';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { toast } from '@repo/ui/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { InfoIcon, ScrollTextIcon, TrophyIcon, User, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="w-3/4 h-12 mx-auto" />
      <Skeleton className="w-full h-[400px]" />
      <div className="space-y-4">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-3/4 h-6" />
      </div>
    </div>
  );
}

function TeamCard({
  team,
  tournament,
  currentUser,
  currentTeam,
  setTeams,
  setCurrentTeam,
}: {
  team: Team;
  tournament: Tournament;
  currentUser: { id: number; username: string } | null;
  currentTeam: number;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setCurrentTeam: React.Dispatch<React.SetStateAction<number>>;
}) {
  const borderColor =
    team.users.length === tournament.team_capacity
      ? team.validate
        ? 'border-green-400'
        : 'border-orange-500'
      : 'border-gray-300';

  return (
    <Card className={`${borderColor} border-2`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            {team.name}
            <UsersIcon className="w-5 h-5" />
            {team.users.length}/{tournament.team_capacity}
          </span>
          {currentTeam === 0 && team.users.length < tournament.team_capacity && (
            <JoinTeam
              id_tournament={tournament.id}
              team={team}
              setter={setTeams}
              username={currentUser?.username}
              setCurrentTeam={setCurrentTeam}
            />
          )}
          {currentTeam === team.id && (
            <LeaveTeam
              id_tournament={tournament.id}
              team={team}
              setter={setTeams}
              username={currentUser?.username}
              setCurrentTeam={setCurrentTeam}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {team.users.map((user) => (
            <li key={user.id} className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {user.username}
              {currentUser?.id === user.id && <span className="text-sm text-muted-foreground"> (Vous)</span>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

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
        toast.error('Erreur lors de la récupération du tournoi');
      }
      setTournament(data);
    };
    fetchTournament();

    const fetchTeams = async () => {
      const { data, status } = await getTournamentsTeams({ id });
      if (status !== 200) {
        toast.error('Erreur lors de la récupération des équipes');
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

      if (tournament?.max_participants && validated >= tournament.max_participants) {
        setTeams((prev) => prev.filter((team) => team.validate));
      }
    };
    fetchTeams();
  }, [id, currentUser?.username, router, tournament?.max_participants]);

  if (!tournament) return <LoadingSkeleton />;

  const imageUrl = `${process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL}/image/tournaments/tournament_${tournament.id}`;
  const placeholder = '/placeholder.jpg';

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">{tournament.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="relative w-full h-[600px]">
            <Image
              className="object-cover rounded-lg"
              src={imageError ? placeholder : imageUrl}
              alt={tournament.name}
              layout="fill"
              onError={() => setImageError(true)}
            />
          </div>

          <Tabs defaultValue="rules">
            <TabsList className={tournament.description ? 'grid grid-cols-4 gap-2' : 'grid grid-cols-3 gap-2'}>
              {tournament.description && <TabsTrigger value="description">Description</TabsTrigger>}
              <TabsTrigger value="rules">Règles</TabsTrigger>
              <TabsTrigger value="prize">Prix</TabsTrigger>
              <TabsTrigger value="teams">Équipes</TabsTrigger>
            </TabsList>
            {tournament.description && (
              <TabsContent value="description">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <InfoIcon className="w-5 h-5" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {tournament.description?.split('\n').map((line, index) => (
                        <p key={`desc-${line}`} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ScrollTextIcon className="w-5 h-5" />
                    Règles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {tournament.rules?.split('\n').map((line, index) => (
                      <p key={`rules-${line}`} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="prize">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5" />
                    Prix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {tournament.prize?.split('\n').map((line, index) => (
                      <p key={`prize-${line}`} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5" />
                    Équipes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teams.length === 0 ? (
                    <p className="text-center text-muted-foreground">Aucune équipe inscrite</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teams.map((team) => (
                        <TeamCard
                          key={team.id}
                          team={team}
                          tournament={tournament}
                          currentUser={currentUser}
                          currentTeam={currentTeam}
                          setTeams={setTeams}
                          setCurrentTeam={setCurrentTeam}
                        />
                      ))}
                    </div>
                  )}
                  {currentTeam === 0 && validatedTeams < tournament.max_participants && (
                    <div className="mt-4 flex justify-center">
                      <CreateTeam id_tournament={id} setTeams={setTeams} setCurrentTeam={setCurrentTeam} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <Suspense fallback={<LoadingSkeleton />}>
        <ShowContent />
      </Suspense>
    </main>
  );
}
