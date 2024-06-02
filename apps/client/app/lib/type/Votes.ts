export interface Vote {
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
}
