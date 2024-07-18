'use client';

import type { Tournament } from '@/app/(dashboard)/dashboard/tournaments/page';
import AddRound from '@/app/ui/dashboard/tournaments/matches/AddRound';
import CancelTeam from '@/app/ui/dashboard/tournaments/matches/CancelTeam';
import MatchesList from '@/app/ui/dashboard/tournaments/matches/MatchesList';
import ValidateTeam from '@/app/ui/dashboard/tournaments/matches/ValidateTeam';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/ui/accordion';
import { Badge } from '@repo/ui/components/ui/badge';
import { toast } from '@repo/ui/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card';
import { ScrollArea } from '@ui/components/ui/scroll-area';
import { UsersIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

type Round = {
  id: number;
  name: string;
  id_tournament: number;
  order: number;
};

export type Team = {
  id: number;
  name: string;
  validate: boolean;
  users: {
    id: number;
    username: string;
  }[];
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

function ShowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idTournament = searchParams.get('id_tournament');
  const updated = searchParams.get('updated');
  const created = searchParams.get('created');
  const deleted = searchParams.get('deleted');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournament, setTournament] = useState<Tournament>();

  const [roundsLoading, setRoundsLoading] = useState(true);

  const hasFetchedData = useRef(false);

  if (updated)
    toast.success('Modification appliqué', {
      duration: 2000,
      description: 'Les modifications ont été appliqué avec succès',
    });
  else if (created) toast.success('Elément crée', { duration: 2000, description: "L'élement a été crée avec succès" });
  else if (deleted)
    toast.success('Elément supprimé', { duration: 2000, description: "L'élement a été supprimé avec succès" });

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    if (hasFetchedData.current) {
      return;
    }
    hasFetchedData.current = true;

    fetch(`${urlApi}/tournaments/${idTournament}`, {
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
        setTournament(data);
      });

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
        setRoundsLoading(false);
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

  const TeamStatus = ({ team }: { team: Team }) => {
    if (team.users.length === tournament?.team_capacity) {
      return team.validate ? (
        <Badge className="bg-green-500">Validée</Badge>
      ) : (
        <Badge className="bg-yellow-500">En attente</Badge>
      );
    }
    return <Badge className="bg-red-500">Incomplète</Badge>;
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              Equipes
            </span>
            <Badge>{teams.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Aucune équipe inscrite pour le moment</div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <Accordion type="single" collapsible className="w-full">
                {teams.map((team) => (
                  <AccordionItem key={team.id} value={`${team.name}`}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {team.name} ({team.users.length}/{tournament?.team_capacity})
                        </span>
                        <TeamStatus team={team} />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 ml-4">
                        {team.users.map((user) => (
                          <div key={user.id} className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4" />
                            {user.username}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        {team.users.length === tournament?.team_capacity && !team.validate && (
                          <ValidateTeam team={team} id_tournament={Number(idTournament)} setter={setTeams} />
                        )}
                        {team.validate && (
                          <CancelTeam team={team} id_tournament={Number(idTournament)} setter={setTeams} />
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {teams.length > 0 && idTournament ? (
        <>
          <div className="space-y-8">
            {rounds.map((round) => (
              <MatchesList key={round.id} round={round} matches={matches} teams={teams} idTournament={idTournament} />
            ))}

            <div className="flex justify-center">
              {roundsLoading ? '' : <AddRound id_tournament={idTournament || ''} order={rounds.length} />}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground">
          Une fois les équipes inscrites, la création des rounds sera possible
        </p>
      )}
    </>
  );
}

function page() {
  return (
    <Suspense>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
        <div className="flex items-center gap-5">
          <h1 className="text-lg font-semibold md:text-2xl">Tournoi</h1>
        </div>
        <ShowContent />
      </main>
    </Suspense>
  );
}

export default page;
