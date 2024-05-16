import TournamentRow from '@/app/ui/dashboard/tournaments/TournamentRow';
import React from 'react';

type Tournament = {
  id: number;
  created_at: string;
  default_match_length: number | null;
  name: string;
  max_participants: number;
  team_capacity: number;
  rules: string | null;
  prize: string | null;
  id_address: number | null;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

interface TournamentRowProps {
  tournaments: Tournament[];
  addresses: Address[];
}

function TournamentsList(props: TournamentRowProps) {
  return (
    <>
      {props.tournaments.map((tournament: Tournament) => (
        <TournamentRow key={tournament.id} tournament={tournament} addresses={props.addresses} />
      ))}
    </>
  );
}

export default TournamentsList;
