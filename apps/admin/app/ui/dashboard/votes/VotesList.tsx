'use client';

import type { Vote } from '@/app/(dashboard)/dashboard/votes/page';
import VoteRow from '@/app/ui/dashboard/votes/VoteRow';

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
