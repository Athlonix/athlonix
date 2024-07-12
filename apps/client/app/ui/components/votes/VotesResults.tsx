import type { FullPoll, PollsVote, Vote } from '@/app/lib/type/Votes';
import { getVote } from '@/app/lib/utils/votes';
import { Progress } from '@ui/components/ui/progress';
import { Separator } from '@ui/components/ui/separator';
import { toast } from '@ui/components/ui/sonner';
import { useEffect, useState } from 'react';
import { type Socket, io } from 'socket.io-client';

function VotesResults({ poll: voteInit, round }: { poll: FullPoll; round: number }) {
  const [poll, setPoll] = useState<FullPoll>(voteInit);
  const [socket, setSocket] = useState<Socket>();

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
  }, [poll.id]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || '');
    console.log('socket endpoint :', socket);
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receivedVote', (payload: PollsVote) => {
        let currentPoll = poll;
        if (round > 1) {
          currentPoll = poll.sub_polls[round - 2] as FullPoll;
        }
        if (payload.id_poll === currentPoll.id) {
          const fetchData = async () => {
            const { data, status } = await getVote(poll.id);
            if (status !== 200) {
              return;
            }
            setPoll(data);
          };
          fetchData();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('receivedVote');
      }
    };
  }, [socket, poll.id, round, poll.sub_polls, poll]);

  if (round === 1) {
    return (
      <>
        <div className="flex justify-center text-3xl font-bold">
          Résultats ({poll.results.reduce((acc, curr) => acc + curr.votes, 0)} votes)
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-6 mx-8">
          {poll.results.map((result) => (
            <div key={result.id}>
              <div className="text-lg">
                {result.content} {result.content} (
                {(((result.votes ?? 0) / poll.results.reduce((acc, curr) => acc + curr.votes, 0)) * 100).toFixed(2)}%)
              </div>
              <Progress
                value={((result.votes ?? 0) / poll.results.reduce((acc, curr) => acc + curr.votes, 0)) * 100}
                max={poll.results.reduce((acc, curr) => acc + curr.votes, 0)}
              />
            </div>
          ))}
        </div>
      </>
    );
  }

  const originalValue = poll.results.map((result) => {
    return {
      id: result.id,
      content: result.content,
      votes: result.votes,
    };
  });

  const subPoll = poll.sub_polls[round - 2];
  const previousSubPoll = round > 2 ? poll.sub_polls[round - 3] : poll;

  if (!previousSubPoll || !subPoll) return null;

  const toKeep = previousSubPoll.results.sort((a: Vote, b: Vote) => b.votes - a.votes).slice(0, subPoll.keep);

  const slicedResults = toKeep?.map((result) => {
    if (!result.id_original)
      return {
        ...result,
        votes: subPoll.results.find((subPollResult) => subPollResult.id_original === result.id)?.votes,
        id_original: result.id,
      };
    return {
      id: result.id,
      content: originalValue.find((original) => original.id === result.id_original)?.content,
      id_original: result.id_original,
      votes: subPoll.results.find((subPollResult) => subPollResult.id_original === result.id_original)?.votes,
    };
  });

  return (
    <>
      <div className="flex justify-center text-3xl font-bold">
        Résultats ({slicedResults.reduce((acc, curr) => acc + (curr.votes ?? 0), 0)} votes)
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-6 mx-8">
        {slicedResults.map((result) => (
          <div key={result.id}>
            <div className="text-lg">
              {result.content} {result.content} (
              {(((result.votes ?? 0) / slicedResults.reduce((acc, curr) => acc + (curr.votes ?? 0), 0)) * 100).toFixed(
                2,
              )}
              %)
            </div>
            <Progress
              value={((result.votes ?? 0) / slicedResults.reduce((acc, curr) => acc + (curr.votes ?? 0), 0)) * 100}
              max={slicedResults.reduce((acc, curr) => acc + (curr.votes ?? 0), 0)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default VotesResults;
