import type { PollsVote, Vote } from '@/app/lib/type/Votes';
import { getVote } from '@/app/lib/utils/votes';
import { Progress } from '@ui/components/ui/progress';
import { Separator } from '@ui/components/ui/separator';
import { toast } from '@ui/components/ui/sonner';
import { useEffect, useState } from 'react';
import { type Socket, io } from 'socket.io-client';

function VotesResults({ vote: voteInit }: { vote: Vote }) {
  const [vote, setVote] = useState<Vote>(voteInit);
  const [totalVotes, setTotalVotes] = useState(vote.results.reduce((acc, curr) => acc + curr.votes, 0));
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await getVote(vote.id);
      if (status !== 200) {
        toast.error('Une erreur est survenue lors de la récupération du vote', { duration: 2000 });
        return;
      }
      setVote(data);
      setTotalVotes(data.results.reduce((acc, curr) => acc + curr.votes, 0));
    };
    fetchData();
  }, [vote.id]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || '');
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receivedVote', (payload: PollsVote) => {
        if (payload.id_poll === vote.id) {
          const fetchData = async () => {
            const { data, status } = await getVote(vote.id);
            if (status !== 200) {
              return;
            }
            setVote(data);
            setTotalVotes(data.results.reduce((acc, curr) => acc + curr.votes, 0));
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
  }, [socket, vote.id]);

  return (
    <>
      <div className="flex flex-col items-center justify-center text-lg">
        {vote.description.split('\n').map((i, key) => {
          return (
            <div key={i} className=" text-justify">
              {i}
            </div>
          );
        })}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-center text-3xl font-bold">Résultats ({totalVotes} votes)</div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-6 mx-8">
        {vote.results.map((result) => (
          <div key={result.id}>
            <div className="text-lg">
              {result.content} {result.content} ({((result.votes / totalVotes) * 100).toFixed(2)}%)
            </div>
            <Progress value={(result.votes / totalVotes) * 100} max={totalVotes} />
          </div>
        ))}
      </div>
    </>
  );
}

export default VotesResults;
