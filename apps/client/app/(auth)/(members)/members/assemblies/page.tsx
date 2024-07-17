import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { type Address, getAssembly, getOneAddress } from './actions';

export default async function AssemblyPage() {
  const assemblyData = await getAssembly();

  if (!assemblyData) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune assemblée n'a été trouvée</p>
        </CardContent>
      </Card>
    );
  }

  let location: Address | null;
  if (assemblyData.assembly.location) {
    location = await getOneAddress(assemblyData.assembly.location);
  } else {
    location = null;
  }

  const { assembly, status } = assemblyData;

  const statusColors = {
    current: 'bg-green-500',
    upcoming: 'bg-blue-500',
    past: 'bg-gray-500',
  };

  const badgeFrench = {
    current: 'En cours',
    upcoming: 'À venir',
    past: 'Passée',
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{assembly.name}</CardTitle>
          <Badge className={`${statusColors[status]} text-white`}>{badgeFrench[status]}</Badge>
        </div>
        <CardDescription>{assembly.description || "Cette assemblée n'a pas de description"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="text-muted-foreground" />
            <span>{new Date(assembly.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="text-muted-foreground" />
            <span>{location ? `${location.number} ${location.road}, ${location.city}` : 'En ligne'}</span>
          </div>
          {status !== 'upcoming' && (
            <div className="flex items-center space-x-2">
              <UsersIcon className="text-muted-foreground" />
              <span>
                {status === 'current' && assembly.attendees
                  ? `${Object.keys(assembly.attendees).length} attendees`
                  : 'Pas de participants confirmés pour le moment'}
                {status === 'past' && assembly.attendees
                  ? `${Object.keys(assembly.attendees).length} attendees`
                  : 'Aucun participants confirmés'}
              </span>
            </div>
          )}
          {assembly.lawsuit && (
            <div className="mt-4">
              <h3 className="font-semibold">Lawsuit:</h3>
              <p>{assembly.lawsuit}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
