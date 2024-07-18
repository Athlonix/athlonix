'use client';

import type { Tournament } from '@/app/lib/type/Tournaments';
import { getTournaments } from '@/app/lib/utils/tournament';
import { Separator } from '@repo/ui/components/ui/separator';
import { toast } from '@repo/ui/components/ui/sonner';
import Loading from '@ui/components/ui/loading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ShowContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '1';
  const router = useRouter();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      const { data, status } = await getTournaments({ id });
      if (status === 404) {
        router.push('/not-found');
        return;
      }
      if (status !== 200) {
        toast.error('Erreur lors de la récupération du tournoi', { duration: 5000 });
        return;
      }
      setTournament(data);
    };
    fetchTournament();
  }, [id, router]);

  if (!tournament) return <Loading />;

  const imageUrl = `${process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL}/image/tournaments/tournament_${tournament.id}`;
  const placeholder = '/placeholder.jpg';

  return (
    <>
      <div className="flex justify-center w-full my-4">
        <h1 className="font-bold">{tournament.name}</h1>
      </div>
      <Separator className="my-8" />
      <div className="flex justify-center">
        <Image
          className="object-cover"
          width={1000}
          height={1000}
          src={imageError ? placeholder : imageUrl}
          style={{ width: '40vw', height: 'auto' }}
          alt={tournament.name}
          onError={() => setImageError(true)}
        />
      </div>
      <Separator className="my-8" />
      <div className="grid gap-2 text-4xl mx-12">
        {tournament.description?.split('\n').map((line) => (
          <p key={`${line}`}>{line}</p>
        ))}
      </div>
      <Separator className="my-8" />
      <div className="flex justify-center w-full my-4">
        <h2 className="font-bold">Règles</h2>
      </div>
      <Separator className="my-8" />
      <div className="grid gap-2 text-4xl mx-12">
        {tournament.rules?.split('\n').map((line) => (
          <p key={`${line}`}>{line}</p>
        ))}
      </div>
      {tournament.prize && (
        <>
          <div className="flex justify-center w-full my-4">
            <h2 className="font-bold">Prix</h2>
          </div>
          <Separator className="my-8" />
          <div className="grid gap-2 text-4xl mx-12">
            {tournament.prize.split('\n').map((line) => (
              <p key={`${line}`}>{line}</p>
            ))}
          </div>
        </>
      )}
      <Separator className="my-8" />
      <div className="flex justify-center">
        <div className="dark:bg-slate-600 bg-slate-300 rounded-lg p-2">
          Pour vous inscrire, veuillez vous rendre sur l'espace membre.
        </div>
      </div>
    </>
  );
}

function page() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <ShowContent />
      </Suspense>
    </main>
  );
}

export default page;
