'use client';

import type { Assembly } from '@/app/(dashboard)/dashboard/assemblies/utils';
import type { Vote } from '@/app/(dashboard)/dashboard/votes/page';
import VoteRow from '@/app/ui/dashboard/votes/VoteRow';

interface Props {
  votes: Vote[];
  setVotes: React.Dispatch<React.SetStateAction<Vote[]>>;
  assemblies: Assembly[];
}

function ActivitiesList({ votes, setVotes, assemblies }: Props) {
  return (
    <>
      {votes.map((vote: Vote) => (
        <VoteRow key={vote.id} vote={vote} setVotes={setVotes} assemblies={assemblies} />
      ))}
    </>
  );
}

export default ActivitiesList;
