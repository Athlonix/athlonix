import type { Address, Sport, Tournament } from '@/app/(dashboard)/dashboard/tournaments/page';
import TournamentRow from '@/app/ui/dashboard/tournaments/TournamentRow';

interface TournamentRowProps {
  tournaments: Tournament[];
  addresses: Address[];
  sports: Sport[];
}

function TournamentsList(props: TournamentRowProps) {
  return (
    <>
      {props.tournaments.map((tournament: Tournament) => (
        <TournamentRow key={tournament.id} tournament={tournament} addresses={props.addresses} sports={props.sports} />
      ))}
    </>
  );
}

export default TournamentsList;
