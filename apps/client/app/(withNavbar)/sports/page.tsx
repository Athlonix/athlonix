import { Card, CardContent, CardFooter } from '@repo/ui/components/ui/card';
import Image from 'next/image';
import { getSports } from './actions';

export const dynamic = 'force-dynamic';

export default async function SportsPage() {
  const sportsData = await getSports();

  if (!sportsData || sportsData.data.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-16">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Pas de sports disponibles en ce moment !</p>
          <p className="text-center text-muted-foreground">
            Revenez plus tard, nous ajoutons de nouveaux sports régulièrement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Nos sports 🏀</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sportsData.data.map((sport) => (
          <Card key={sport.id} className="relative group">
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
                <div className="mt-4 flex justify-between">
                  <span className="text-gray-400">
                    Joueurs: {sport.min_players} - {sport.max_players}
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
