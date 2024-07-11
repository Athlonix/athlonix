'use client';

import type { Assembly } from '@/app/(dashboard)/dashboard/assemblies/utils';
import type { Poll } from '@/app/lib/type/Votes';
import DeletePoll from '@/app/ui/dashboard/votes/DeletePoll';
import EditPoll from '@/app/ui/dashboard/votes/EditPoll';
import { TableCell, TableRow } from '@repo/ui/components/ui/table';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  poll: Poll;
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  assemblies: Assembly[];
}

function PollRow({ poll, setPolls, assemblies }: Props) {
  const [title, setTitle] = useState(poll.title);
  const [description, setDescription] = useState(poll.description);
  const [maxChoices, setMaxChoices] = useState(poll.max_choices);
  const [startAt, setStartAt] = useState(poll.start_at);
  const [endAt, setEndAt] = useState(poll.end_at);

  const setter = {
    title: setTitle,
    description: setDescription,
    maxChoices: setMaxChoices,
    startAt: setStartAt,
    endAt: setEndAt,
  };

  const startDate = new Date(startAt);
  const formattedStartDate = `${startDate.getFullYear()}/${String(startDate.getMonth() + 1).padStart(2, '0')}/${String(
    startDate.getDate(),
  ).padStart(2, '0')} ${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(
    2,
    '0',
  )}:${String(startDate.getSeconds()).padStart(2, '0')}`;
  const endDate = new Date(endAt);
  const formattedEndDate = `${endDate.getFullYear()}/${String(endDate.getMonth() + 1).padStart(2, '0')}/${String(
    endDate.getDate(),
  ).padStart(2, '0')} ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(
    2,
    '0',
  )}:${String(endDate.getSeconds()).padStart(2, '0')}`;
  return (
    <TableRow key={poll.id} className="">
      <TableCell className="font-medium">
        <Link href={`/dashboard/votes/details?id=${poll.id}`}>{title}</Link>
      </TableCell>
      <TableCell>{formattedStartDate}</TableCell>
      <TableCell>{formattedEndDate}</TableCell>
      <TableCell>{maxChoices}</TableCell>
      {title !== 'Supprimé' && (
        <TableCell className="flex gap-2">
          <EditPoll poll={poll} setter={setter} assemblies={assemblies} />
          <DeletePoll poll={poll} setPolls={setPolls} />
        </TableCell>
      )}
    </TableRow>
  );
}

export default PollRow;
