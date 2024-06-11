'use client';

import type { Assembly } from '@/app/(dashboard)/dashboard/assemblies/utils';
import type { Vote } from '@/app/(dashboard)/dashboard/votes/page';
import DeleteVote from '@/app/ui/dashboard/votes/DeleteVote';
import EditVote from '@/app/ui/dashboard/votes/EditVote';
import { TableCell, TableRow } from '@repo/ui/components/ui/table';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  vote: Vote;
  setVotes: React.Dispatch<React.SetStateAction<Vote[]>>;
  assemblies: Assembly[];
}

function VoteRow({ vote, setVotes, assemblies }: Props) {
  const [title, setTitle] = useState(vote.title);
  const [description, setDescription] = useState(vote.description);
  const [maxChoices, setMaxChoices] = useState(vote.max_choices);
  const [startAt, setStartAt] = useState(vote.start_at);
  const [endAt, setEndAt] = useState(vote.end_at);

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
    <TableRow key={vote.id}>
      <TableCell className="font-medium">
        <Link href={`/dashboard/votes/details?id=${vote.id}`}>{title}</Link>
      </TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>{formattedStartDate}</TableCell>
      <TableCell>{formattedEndDate}</TableCell>
      <TableCell>{maxChoices}</TableCell>
      {title !== 'Supprimé' && (
        <TableCell className="flex gap-2">
          <EditVote vote={vote} setter={setter} assemblies={assemblies} />
          <DeleteVote vote={vote} setVotes={setVotes} />
        </TableCell>
      )}
    </TableRow>
  );
}

export default VoteRow;
