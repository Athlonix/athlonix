'use client';

import VoteRow from '@/app/ui/dashboard/votes/VoteRow';

export type Vote = {
  id: number;
  title: string;
  description: string;
  id_user: number;
  max_choices: number;
  start_at: string;
  end_at: string;
  options: { id: number; content: string }[];
  results: { id_choice: number; count: number }[];
};

interface Props {
  votes: Vote[];
}

function ActivitiesList({ votes }: Props) {
  return (
    <>
      {votes.map((vote: Vote) => (
        <VoteRow key={vote.id} vote={vote} />
      ))}
    </>
  );
}

export default ActivitiesList;
