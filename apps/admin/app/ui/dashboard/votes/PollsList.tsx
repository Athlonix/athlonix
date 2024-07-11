'use client';

import type { Assembly } from '@/app/(dashboard)/dashboard/assemblies/utils';
import type { Poll } from '@/app/lib/type/Votes';
import PollRow from '@/app/ui/dashboard/votes/PollRow';

interface Props {
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  assemblies: Assembly[];
}

function ActivitiesList({ polls, setPolls, assemblies }: Props) {
  return (
    <>
      {polls.map((poll: Poll) => (
        <PollRow key={poll.id} poll={poll} setPolls={setPolls} assemblies={assemblies} />
      ))}
    </>
  );
}

export default ActivitiesList;
