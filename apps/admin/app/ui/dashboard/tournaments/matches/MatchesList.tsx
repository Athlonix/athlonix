import EditMatch from '@/app/ui/dashboard/tournaments/matches/EditMatch';
import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import { Crown } from 'lucide-react';
import type React from 'react';

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

interface MatchesListProps {
  idTournament: string;
  round: Round;
  matches: Match[];
  teams: Team[];
}

function MatchesList(props: MatchesListProps) {
  return (
    <div className="py-10 rounded-lg border border-dashed shadow-sm p-4">
      <div className="w-full">
        <div className="mb-4">{props.round.name}</div>
        <Separator className="mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {props.matches
            .filter((match) => match.id_round === props.round.id)
            .map((match) => (
              <div key={match.id} className="items-center justify-between rounded-lg border border-solid p-4">
                <div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{match.start_time}</span>
                      <EditMatch
                        match={match}
                        teams={props.teams}
                        idTournament={props.idTournament}
                        idRound={props.round.id}
                      />
                    </div>
                    <Separator className="my-2" />
                    {match.teams.map((team) => (
                      <div key={team.id}>
                        <div className="flex items-center gap-2">
                          {team.name} {match.winner.includes(team.id) && <Crown className="w-4 h-4" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MatchesList;
