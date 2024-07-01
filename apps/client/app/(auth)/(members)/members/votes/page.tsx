'use client';
import type { Vote } from '@/app/lib/type/Votes';
import { getAllVotes } from '@/app/lib/utils/votes';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import Loading from '@repo/ui/components/ui/loading';
import { Separator } from '@ui/components/ui/separator';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ListVotes() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'finished' | 'not_started'>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAllVotes();
        setVotes(result.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredVotes = () => {
    switch (filter) {
      case 'ongoing':
        return votes.filter((vote) => new Date(vote.start_at) <= new Date() && new Date(vote.end_at) >= new Date());
      case 'finished':
        return votes.filter((vote) => new Date(vote.end_at) < new Date());
      case 'not_started':
        return votes.filter((vote) => new Date(vote.start_at) > new Date());
      default:
        return votes;
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
        {filteredVotes().map((vote) => (
          <Card key={vote.id} className="p-4">
            <div className="flex gap-2">
              <h2 className="text-lg font-semibold flex-1">{vote.title}</h2>
            </div>
            <Separator />
            <div className="flex my-4 justify-center gap-4">
              {vote.max_choices > 1 ? (
                <Badge variant="info">Choix multiples</Badge>
              ) : (
                <Badge variant="info">Choix unique</Badge>
              )}
              {new Date(vote.start_at) <= new Date() && new Date(vote.end_at) >= new Date() ? (
                <Badge variant="info">En cours</Badge>
              ) : new Date(vote.end_at) < new Date() ? (
                <Badge variant="destructive">Terminé le {new Date(vote.end_at).toLocaleDateString()}</Badge>
              ) : (
                <Badge variant="secondary">Non commencé</Badge>
              )}
            </div>
            <Separator />
            <p className="text-justify">{vote.description}</p>
            {new Date(vote.start_at) <= new Date() && new Date(vote.end_at) >= new Date() && (
              <Link href={`/members/votes/details?id=${vote.id}`}>
                <Button className="mt-4">Je vote</Button>
              </Link>
            )}
            {new Date(vote.end_at) < new Date() && <Button className="mt-4">Voir les résultats</Button>}
            {new Date(vote.start_at) > new Date() && (
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Commence le{' '}
                {`${new Date(vote.start_at).toLocaleDateString()} à ${new Date(vote.start_at).toLocaleTimeString()}`}
              </p>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
