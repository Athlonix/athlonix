import { Card, CardContent, CardFooter } from '@repo/ui/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

type Sport = {
  id: number;
  name: string;
  description: string | null;
  max_players: number;
  min_players: number;
  image: string | null;
};

type SportData = {
  data: Sport[];
  count: number;
};

export const dynamic = 'force-dynamic';

async function getSports(): Promise<SportData> {
  const api_url = process.env.API_URL;
  const response = await fetch(`${api_url}/sports?all=true`, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des sports');
  }
  return await response.json();
}

export default async function SportsPage() {
  const sportsData = await getSports();

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Nos sports 🏀</h1>
      {sportsData.count === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center">
          <p className="text-center text-gray-500 dark:text-gray-400">Pas de sports disponibles en ce moment !</p>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Revenez plus tard, nous ajoutons de nouveaux sports régulièrement.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sportsData.data.map((sport) => (
          <Card key={sport.id} className="relative group">
            <Link href={`/sports/${sport.id}`} className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">Voir le sport {sport.name}</span>
            </Link>
            <CardContent className="p-4 pt-4">
              {sport.image && (
                <Image
                  src={sport.image}
                  alt={sport.name}
                  className="rounded-lg object-cover w-full aspect-video"
                  width={500}
                  height={500}
                />
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{sport.name}</h3>
                {sport.description && <p className="text-sm text-gray-500 dark:text-gray-400">{sport.description}</p>}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
