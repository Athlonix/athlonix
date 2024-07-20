'use client';

import type { Tournament } from '@/app/lib/type/Tournaments';
import { checkSubscriptionStatus, getUserFromCookie } from '@/app/lib/utils';
import { getTournaments } from '@/app/lib/utils/tournament';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { toast } from '@repo/ui/components/ui/sonner';
import { InfoIcon, ScrollTextIcon, TrophyIcon, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="w-3/4 h-12 mx-auto" />
      <Skeleton className="w-full h-[400px]" />
      <div className="space-y-4">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-3/4 h-6" />
      </div>
    </div>
  );
}

function ShowContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '1';
  const router = useRouter();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const { data, status } = await getTournaments({ id });
        if (status === 404) {
          router.push('/not-found');
          return;
        }
        if (status !== 200) {
          toast.error('Erreur lors de la récupération du tournoi');
          return;
        }
        const user = await getUserFromCookie();
        if (user && (await checkSubscriptionStatus(user)) === 'approved') {
          setIsMember(true);
        }
        setTournament(data);
      } catch (_error) {
        toast.error('Erreur lors de la récupération du tournoi');
      }
    };
    fetchTournament();
  }, [id, router]);

  if (!tournament) return <LoadingSkeleton />;

  const imageUrl = `${process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL}/image/tournaments/tournament_${tournament.id}`;
  const placeholder = '/placeholder.jpg';

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">{tournament.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[600px] mb-8">
            <Image
              className="object-cover rounded-lg"
              src={imageError ? placeholder : imageUrl}
              alt={tournament.name}
              layout="fill"
              onError={() => setImageError(true)}
            />
          </div>

          <div className="space-y-6">
            {tournament.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <InfoIcon className="w-5 h-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {tournament.description?.split('\n').map((line, index) => (
                      <p key={`desc-${line}`} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Participants maximum:</p>
                    <p>{tournament.max_participants}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Capacité des équipes:</p>
                    <p>{tournament.team_capacity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScrollTextIcon className="w-5 h-5" />
                  Règles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {tournament.rules?.split('\n').map((line, index) => (
                    <p key={`rules-${line}`} className="mb-2">
                      {line}
                    </p>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {tournament.prize && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5" />
                    Récompenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {tournament.prize?.split('\n').map((line, index) => (
                      <p key={`prize-${line}`} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {isMember && (
            <div className="mt-8 flex justify-center">
              <Link href={`/members/tournaments/details?id=${tournament.id}`}>
                <Button size="lg">S'inscrire sur l'espace membre</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <Suspense fallback={<LoadingSkeleton />}>
        <ShowContent />
      </Suspense>
    </main>
  );
}
