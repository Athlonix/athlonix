'use client';

import type { Assembly } from '@/app/(dashboard)/dashboard/assemblies/utils';
import type { Vote } from '@/app/(dashboard)/dashboard/votes/page';
import VoteRow from '@/app/ui/dashboard/votes/VoteRow';

interface Props {
  votes: Vote[];
  assemblies: Assembly[];
}

function ActivitiesList({ votes, assemblies }: Props) {
  return (
    <>
      {votes.map((vote: Vote) => (
        <VoteRow key={vote.id} vote={vote} assemblies={assemblies} />
      ))}
    </>
  );
}

export default ActivitiesList;
