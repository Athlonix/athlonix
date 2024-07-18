'use client';

import type { Match, Round, Team, Tournament } from '@/app/lib/type/Tournaments';
import AddRound from '@/app/ui/dashboard/tournaments/matches/AddRound';
import CancelTeam from '@/app/ui/dashboard/tournaments/matches/CancelTeam';
import MatchesList from '@/app/ui/dashboard/tournaments/matches/MatchesList';
import ValidateTeam from '@/app/ui/dashboard/tournaments/matches/ValidateTeam';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/ui/accordion';
import { toast } from '@repo/ui/components/ui/sonner';
import { Separator } from '@ui/components/ui/separator';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

interface RoundsData {
  data: Round[];
  count: number;
}

interface MatchesData {
  data: Match[];
  count: number;
}

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

  return (
    <>
      <div className="py-10 rounded-lg border-2 shadow-sm p-4">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="mb-4 font-bold text-lg">Equipes</div>
          </div>
          <Separator className="mb-4" />
          <div className="flex flex-col gap-4">
            {teams.map((team) => (
              <div key={team.id} className="flex justify-between items-center">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`${team.name}`}>
                    <AccordionTrigger>
                      <div
                        className={`flex gap-4 ${team.users.length === tournament?.team_capacity ? (team.validate ? 'text-green-400' : 'text-orange-400') : ''}`}
                      >
                        <div className="font-bold">
                          {team.name} ({team.users.length}/{tournament?.team_capacity})
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4">
                        {team.users.map((user) => (
                          <div key={user.id} className="flex flex-row items-center gap-4 ms-4">
                            <div>{user.username}</div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex gap-4">
                  {team.users.length === tournament?.team_capacity && !team.validate && (
                    <ValidateTeam
                      team={team}
                      id_tournament={idTournament ? Number.parseInt(idTournament) : 0}
                      setter={setTeams}
                    />
                  )}
                  {team.validate && (
                    <CancelTeam
                      team={team}
                      id_tournament={idTournament ? Number.parseInt(idTournament) : 0}
                      setter={setTeams}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-4">
        {rounds.map((round) => (
          <MatchesList key={round.id} round={round} matches={matches} teams={teams} idTournament={idTournament || ''} />
        ))}
      </div>
      <div className="py-10 rounded-lg border-2 shadow-sm p-4">
        <div className="w-full">
          <div className="flex justify-center">
            {roundsLoading ? '' : <AddRound id_tournament={idTournament || ''} order={rounds.length} />}
          </div>
        </div>
      </div>
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
