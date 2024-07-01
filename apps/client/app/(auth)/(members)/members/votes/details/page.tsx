'use client';

import type { Vote } from '@/app/lib/type/Votes';
import { getUserVoted, getVote } from '@/app/lib/utils/votes';
import VotesOptions from '@/app/ui/components/votes/VotesOptions';
import VotesResults from '@/app/ui/components/votes/VotesResults';
import { toast } from '@repo/ui/components/ui/sonner';
import { Separator } from '@ui/components/ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ShowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let id = searchParams.get('id') || 1;
  if (typeof id === 'string') {
    id = Number.parseInt(id);
  }

  const [vote, setVote] = useState<Vote>();
  const [hasVoted, setHasVoted] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await getVote(id);
      if (status === 404) {
        router.push('/members/votes');
      }
      if (status !== 200) {
        toast.error('Une erreur est survenue lors de la récupération du vote', { duration: 2000 });
        return;
      }
      setVote(data);

      const { data: userVote, status: userVoteStatus } = await getUserVoted(id);
      if (userVoteStatus === 200) {
        setHasVoted(userVote.voted);
      }
    };
    fetchData();
  }, [id, router]);

  return (
    <div>
      <div className="flex justify-center text-4xl font-bold mt-4">{vote?.title}</div>
      <Separator className="my-4" />
      {hasVoted === true && vote && <VotesResults vote={vote} />}
      {hasVoted === false && vote && <VotesOptions vote={vote} hasVoted={setHasVoted} />}
    </div>
  );
}

function page() {
  return (
    <main>
      <Suspense fallback={<div>Chargement...</div>}>
        <ShowContent />
      </Suspense>
    </main>
  );
}

export default page;
