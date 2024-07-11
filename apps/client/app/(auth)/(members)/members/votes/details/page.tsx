'use client';

import type { FullPoll } from '@/app/lib/type/Votes';
import { getUserVoted, getVote } from '@/app/lib/utils/votes';
import VotesOptions from '@/app/ui/components/votes/VotesOptions';
import VotesResults from '@/app/ui/components/votes/VotesResults';
import Loading from '@repo/ui/components/ui/loading';
import { toast } from '@repo/ui/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
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

  const [poll, setPoll] = useState<FullPoll>();
  const [hasVoted, setHasVoted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

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
      setPoll(data);

      const { data: userVote, status: userVoteStatus } = await getUserVoted();
      if (userVoteStatus === 200) {
        setHasVoted(userVote.voted);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  if (!poll || loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-center text-4xl font-bold mt-4">{poll.title}</div>
      <Separator className="my-4" />
      <div className="flex flex-col items-center justify-center text-lg">
        {poll.description?.split('\n').map((i, key) => {
          return (
            <div key={i} className=" text-justify">
              {i}
            </div>
          );
        })}
      </div>
      <Separator className="my-4" />
      <Tabs defaultValue={poll.id.toString()}>
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value={poll.id.toString()} className="flex gap-1 w-[200px]">
              <span>
                {poll.round}
                <sup>e</sup>
              </span>
              <span>tour</span>
            </TabsTrigger>
            {poll.sub_polls.map((subPoll) => (
              <TabsTrigger key={subPoll.id} value={subPoll.id.toString()} className="flex gap-1 w-[200px]">
                <span>
                  {subPoll.round}
                  <sup>e</sup>
                </span>
                <span>tour</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={poll.id.toString()}>
          {(hasVoted.includes(poll.id) || new Date(poll.end_at) < new Date()) && (
            <VotesResults poll={poll} round={poll.round} />
          )}
          {!hasVoted.includes(poll.id) && new Date(poll.end_at) > new Date() && (
            <VotesOptions poll={poll} hasVoted={setHasVoted} round={poll.round} />
          )}
        </TabsContent>
        {poll.sub_polls.map((subPoll) => (
          <TabsContent key={subPoll.id} value={subPoll.id.toString()}>
            {(hasVoted.includes(subPoll.id) || new Date(subPoll.end_at) < new Date()) && (
              <VotesResults poll={poll} round={subPoll.round} />
            )}
            {!hasVoted.includes(subPoll.id) && new Date(subPoll.end_at) > new Date() && (
              <VotesOptions poll={poll} hasVoted={setHasVoted} round={subPoll.round} />
            )}
          </TabsContent>
        ))}
      </Tabs>
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
