'use client';
import type { FullPoll } from '@/app/lib/type/Votes';
import { getAllVotes, getUserVoted } from '@/app/lib/utils/votes';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import Loading from '@repo/ui/components/ui/loading';
import { toast } from '@repo/ui/components/ui/sonner';
import { Separator } from '@ui/components/ui/separator';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ListVotes() {
  const [polls, setPolls] = useState<FullPoll[]>([]);
  const [usersVotes, setUsersVotes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'finished' | 'not_started'>('all');

  useEffect(() => {
    async function fetchData() {
      const { data: allVotes, status: allStatus } = await getAllVotes();
      const { data: userVote, status: userVoteStatus } = await getUserVoted();

      if (allStatus !== 200 || userVoteStatus !== 200) {
        toast.error('Une erreur est survenue lors de la récupération des votes', { duration: 2000 });
        return;
      }

      setPolls(allVotes.data);
      setUsersVotes(userVote.voted);
      setLoading(false);
    }
    fetchData();
  }, []);

  const isOnGoing = (poll: FullPoll) => {
    const subPolls = poll.sub_polls;
    if (subPolls.length === 0) {
      return new Date(poll.start_at) <= new Date() && new Date(poll.end_at) >= new Date();
    }
    const last = subPolls[subPolls.length - 1];
    if (!last) {
      return false;
    }
    return subPolls.some((subPoll) => new Date(subPoll.start_at) <= new Date() && new Date(last.end_at) >= new Date());
  };

  const isFinished = (poll: FullPoll) => {
    const subPolls = poll.sub_polls;
    if (subPolls.length === 0) {
      return new Date(poll.end_at) < new Date();
    }
    const last = subPolls[subPolls.length - 1];
    if (!last) {
      return false;
    }
    return subPolls.every(() => new Date(last.end_at) < new Date());
  };

  const hasVoted = (poll: FullPoll) => {
    const notVoted = [];
    if (!usersVotes.includes(poll.id)) {
      notVoted.push(poll);
    }
    for (const subPoll of poll.sub_polls) {
      if (!usersVotes.includes(subPoll.id)) {
        notVoted.push(subPoll);
      }
    }
    if (notVoted.length === 0) {
      return true;
    }

    for (const notVotedPoll of notVoted) {
      if (new Date(notVotedPoll.end_at) > new Date()) {
        return false;
      }
    }
    return true;
  };

  const filteredVotes = () => {
    switch (filter) {
      case 'ongoing':
        return polls.filter((poll) => {
          if (isOnGoing(poll)) {
            return poll;
          }
        });
      case 'finished':
        return polls.filter((poll) => {
          if (isFinished(poll)) {
            return poll;
          }
        });
      case 'not_started':
        return polls.filter((vote) => new Date(vote.start_at) > new Date());
      default:
        return polls;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Votes</h1>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'default' : 'outline'}>
          Tous
        </Button>
        <Button onClick={() => setFilter('ongoing')} variant={filter === 'ongoing' ? 'default' : 'outline'}>
          En cours
        </Button>
        <Button onClick={() => setFilter('finished')} variant={filter === 'finished' ? 'default' : 'outline'}>
          Terminés
        </Button>
        <Button onClick={() => setFilter('not_started')} variant={filter === 'not_started' ? 'default' : 'outline'}>
          Non commencés
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVotes().length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center">
            <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
              Pas de votes disponibles en ce moment !
            </p>
          </div>
        )}
        {filteredVotes().map((poll) => (
          <Card key={poll.id} className="p-4">
            <div className="flex gap-2">
              <h2 className="text-lg font-semibold flex-1 line-clamp-1">{poll.title}</h2>
            </div>
            <Separator />
            <div className="flex my-4 justify-center gap-4">
              {poll.max_choices > 1 ? (
                <Badge variant="info">Choix multiples</Badge>
              ) : (
                <Badge variant="info">Choix unique</Badge>
              )}
              {isOnGoing(poll) ? (
                <Badge variant="info">En cours</Badge>
              ) : isFinished(poll) ? (
                <Badge variant="destructive">Terminé le {new Date(poll.end_at).toLocaleDateString()}</Badge>
              ) : (
                <Badge variant="secondary">Non commencé</Badge>
              )}
            </div>
            <Separator />
            <p className="text-justify line-clamp-3 min-h-24">{poll.description}</p>
            {isOnGoing(poll) && !hasVoted(poll) && (
              <Link href={`/members/votes/details?id=${poll.id}`}>
                <Button className="mt-4">Je vote</Button>
              </Link>
            )}
            {hasVoted(poll) && (
              <Link href={`/members/votes/details?id=${poll.id}`}>
                <Button className="mt-4">Voir les résultats</Button>
              </Link>
            )}
            {new Date(poll.start_at) > new Date() && (
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Commence le{' '}
                {`${new Date(poll.start_at).toLocaleDateString()} à ${new Date(poll.start_at).toLocaleTimeString()}`}
              </p>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
