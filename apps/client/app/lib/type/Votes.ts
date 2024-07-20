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
  keep: number;
  round: number;
  end_condition: 'simple' | 'absolute' | 'two-third' | 'unanimous';
  parent_poll: number | null;
  assembly: number | null;
  results: Vote[];
};

export type FullPoll = Poll & {
  sub_polls: Poll[];
};

export type PollsVote = {
  id: number;
  id_option: number;
  id_poll: number;
};

export type Assembly = {
  id: number;
  name: string;
  description: string | null;
  date: string;
  location: number | null;
  attendees: [
    {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    },
  ];
  lawsuit: string;
  closed: boolean;
};
