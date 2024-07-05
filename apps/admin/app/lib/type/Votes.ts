export type Vote = {
  id: number;
  votes: number;
  content: string | null;
  id_original: number | null;
};

export type Poll = {
  id: number;
  title: string;
  description: string | null;
  id_user: number;
  max_choices: number;
  start_at: string;
  end_at: string;
  assembly: number | null;
  results: Vote[];
};

export type FullPoll = Poll & {
  sub_polls: Poll[];
};
