export type Tournament = {
  id: number;
  created_at: string;
  default_match_length: number | null;
  name: string;
  max_participants: number;
  team_capacity: number;
  rules: string | null;
  prize: string | null;
  id_address: number | null;
  id_sport: number | null;
  description: string | null;
};

export type Sport = {
  id: number;
  name: string;
};

export type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

export type Round = {
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

export type Match = {
  id: number;
  start_time: string | null;
  end_time: string | null;
  id_round: number;
  winner: number[];
  teams: Team[];
};
