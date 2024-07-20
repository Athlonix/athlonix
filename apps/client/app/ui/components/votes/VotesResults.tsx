'use client';
import type { FullPoll, PollsVote, Vote } from '@/app/lib/type/Votes';
import { getVote } from '@/app/lib/utils/votes';
import { Progress } from '@ui/components/ui/progress';
import { Separator } from '@ui/components/ui/separator';
import { toast } from '@ui/components/ui/sonner';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function VotesResults({ poll: voteInit, round }: { poll: FullPoll; round: number }) {
  const [poll, setPoll] = useState<FullPoll>(voteInit);

  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await getVote(poll.id);
      if (status !== 200) {
        toast.error('Une erreur est survenue lors de la récupération du vote', { duration: 2000 });
        return;
      }
      setPoll(data);
    };
    fetchData();

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || '');
    socket.on('receivedVote', (payload: PollsVote) => {
      let currentPoll = poll;
      if (round > 1) {
        currentPoll = poll.sub_polls[round - 2] as FullPoll;
      }
      if (payload.id_poll === currentPoll.id) {
        fetchData();
      }
    });

    return () => {
      socket.off('receivedVote');
      socket.disconnect();
    };
  }, [poll.id, round, poll]);

  const calculatePercentage = (votes: number, totalVotes: number) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };

  const renderResults = (results: Vote[], totalVotes: number) => (
    <>
      <div className="flex justify-center text-3xl font-bold">Résultats ({totalVotes} votes)</div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-6 mx-8">
        {results.map((result) => {
          const percentage = calculatePercentage(result.votes ?? 0, totalVotes);
          return (
            <div key={result.id}>
              <div className="text-lg">
                {result.content} ({percentage.toFixed(2)}%)
              </div>
              <Progress value={percentage} max={100} />
            </div>
          );
        })}
      </div>
    </>
  );

  if (round === 1) {
    const totalVotes = poll.results.reduce((acc, curr) => acc + (curr.votes ?? 0), 0);
    return renderResults(poll.results, totalVotes);
  }

  const originalValue = poll.results.map(({ id, content, votes }) => ({ id, content, votes }));
  const subPoll = poll.sub_polls[round - 2];
  const previousSubPoll = round > 2 ? poll.sub_polls[round - 3] : poll;

  if (!previousSubPoll || !subPoll) return null;

  const toKeep = previousSubPoll.results.sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)).slice(0, subPoll.keep);

  const slicedResults = toKeep.map((result) => {
    const subPollResult = subPoll.results.find((sr) => sr.id_original === (result.id_original || result.id));
    return {
      id: result.id,
      content: result.id_original
        ? originalValue.find((original) => original.id === result.id_original)?.content
        : result.content,
      id_original: result.id_original || result.id,
      votes: subPollResult?.votes ?? 0,
    };
  }) as Vote[];

  const totalVotes = slicedResults?.reduce((acc, curr) => acc + curr.votes, 0) || 0;
  return renderResults(slicedResults, totalVotes);
}

export default VotesResults;
