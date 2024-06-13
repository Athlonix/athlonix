import AddMatch from '@/app/ui/dashboard/tournaments/matches/AddMatch';
import DeleteMatch from '@/app/ui/dashboard/tournaments/matches/DeleteMatch';
import DeleteRound from '@/app/ui/dashboard/tournaments/matches/DeleteRound';
import EditMatch from '@/app/ui/dashboard/tournaments/matches/EditMatch';
import EditRound from '@/app/ui/dashboard/tournaments/matches/EditRound';
import { Separator } from '@repo/ui/components/ui/separator';
import { Crown } from 'lucide-react';

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
    <div className="py-10 rounded-lg border-2 shadow-sm p-4">
      <div className="w-full">
        <div className="flex justify-between">
          <div className="mb-4 font-bold text-lg">{props.round.name}</div>
          <div className="flex gap-2">
            <AddMatch idTournament={props.idTournament} idRound={props.round.id} teams={props.teams} />
            <EditRound round={props.round} />
            <DeleteRound round={props.round} />
          </div>
        </div>
        <Separator className="mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {props.matches
            .filter((match) => match.id_round === props.round.id)
            .map((match) => (
              <div key={match.id} className="items-center justify-between rounded-lg border border-solid p-4">
                <div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg">
                        {match.start_time
                          ? `${new Date(match.start_time).toLocaleDateString('fr-FR', {
                              month: '2-digit',
                              day: '2-digit',
                            })}, ${new Date(match.start_time).toLocaleString('fr-FR', {
                              hour12: false,
                              hour: 'numeric',
                              minute: 'numeric',
                            })}`
                          : 'Non planifié'}{' '}
                        -{' '}
                        {match.end_time
                          ? new Date(match.end_time).toLocaleString(undefined, {
                              hour12: false,
                              hour: 'numeric',
                              minute: 'numeric',
                            })
                          : 'Non terminé'}
                      </span>
                      <div className="flex gap-2">
                        <EditMatch
                          match={match}
                          teams={props.teams}
                          idTournament={props.idTournament}
                          idRound={props.round.id}
                        />
                        <DeleteMatch idTournament={props.idTournament} idRound={props.round.id} idMatch={match.id} />
                      </div>
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
