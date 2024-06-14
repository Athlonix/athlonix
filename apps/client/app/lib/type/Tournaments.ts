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
  description: string | null;
  id_sport: number | null;
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
