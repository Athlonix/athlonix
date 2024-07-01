export type Vote = {
  id: number;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  max_choices: number;
  id_user: number;
  assembly_id: number | null;
  results: [
    {
      id: number;
      votes: number;
      content: string;
    },
  ];
};

export type PollsVote = {
  id: number;
  id_option: number;
  id_poll: number;
};
