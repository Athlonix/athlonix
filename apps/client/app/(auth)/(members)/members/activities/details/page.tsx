'use client';

import type { ActivityWithOccurences, Address, Sport, User } from '@/app/lib/type/Activities';
import { getActivityOccurences, getActivityUsers, getAddresses, getSports } from '@/app/lib/utils/activities';
import Occurences from '@/app/ui/components/activities/Occurences';
import Unique from '@/app/ui/components/activities/Unique';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card';
import { Skeleton } from '@ui/components/ui/skeleton';
import { toast } from '@ui/components/ui/sonner';
import { Activity, Clock, MapPin, Repeat } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const FrenchFrequency: Record<string, string> = {
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  yearly: 'Annuel',
  unique: 'Unique',
};

const FrenchDays: Record<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

function ActivityDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
      <Skeleton className="aspect-video w-full mb-6" />
      <div className="space-y-4 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-40 w-full mb-6" />
      <Skeleton className="h-60 w-full" />
    </div>
  );
}

function ActivityDetails({ sports, addresses }: { sports: Sport[]; addresses: Address[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [activity, setActivity] = useState<ActivityWithOccurences>();
  const [usersSet1, setUsersSet1] = useState<User[]>([]);
  const [usersSet2, setUsersSet2] = useState<User[]>([]);
  const [usersSet3, setUsersSet3] = useState<User[]>([]);

  const id = Number(searchParams.get('id')) || 1;

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const { data, status } = await getActivityOccurences(id);
        if (status === 404) {
          router.push('/not-found');
          return;
        }
        if (status !== 200) {
          throw new Error("Erreur lors de la récupération de l'activité");
        }
        setActivity(data);

        const fetchSession = async (occurenceIndex: number) => {
          if (data.occurences[occurenceIndex]) {
            const { data: usersData, status: usersStatus } = await getActivityUsers(
              id,
              data.occurences[occurenceIndex].date,
            );
            if (usersStatus === 200) {
              return usersData.data;
            }
            throw new Error('Erreur lors de la récupération des utilisateurs');
          }
          return [];
        };

        const [users1, users2, users3] = await Promise.all([fetchSession(0), fetchSession(1), fetchSession(2)]);

        setUsersSet1(users1);
        setUsersSet2(users2);
        setUsersSet3(users3);
      } catch (_error) {
        toast.error("Erreur lors de la récupération de l'activité");
      }
    };

    fetchData();
  }, [id, router]);

  if (!activity) return null;

  const imageUrl = `${process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL}/image/activities/activity_${activity.activity.id}`;
  const placeholder = '/placeholder.jpg';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">{activity.activity.name}</h1>
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Image
              fill
              className="object-cover rounded-t-lg"
              src={imageError ? placeholder : imageUrl}
              alt={activity.activity.name || ''}
              onError={() => setImageError(true)}
            />
          </div>
          <div className="p-6">
            {activity.activity?.description && <p className="mb-4">{activity.activity.description}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              <span className="font-semibold mr-2">Sport:</span>
              {activity.activity.id_sport
                ? sports.find((sport) => sport.id === activity.activity.id_sport)?.name
                : 'Aucun'}
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="font-semibold mr-2">Adresse:</span>
              {activity.activity.id_address
                ? addresses.find((address) => address.id === activity.activity.id_address)?.name
                : 'Aucune'}
            </div>
            <div className="flex items-center">
              <Repeat className="h-5 w-5 mr-2" />
              <span className="font-semibold mr-2">Fréquence:</span>
              {activity.activity.frequency ? FrenchFrequency[activity.activity.frequency] : 'Aucune'}
            </div>
          </div>

          {activity.activity.frequency === 'weekly' && (
            <div className="mt-4">
              <span className="font-semibold mr-2">Jours:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(FrenchDays).map(([key, value]) => (
                  <Badge
                    key={key}
                    variant={
                      activity.activity.days_of_week.includes(key as keyof typeof FrenchDays) ? 'default' : 'secondary'
                    }
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-semibold mr-2">Heure de début:</span>
              {activity.activity.start_time
                ? `${activity.activity.start_time.split(':')[0]}:${activity.activity.start_time.split(':')[1]}`
                : 'Non spécifié'}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-semibold mr-2">Heure de fin:</span>
              {activity.activity.end_time
                ? `${activity.activity.end_time.split(':')[0]}:${activity.activity.end_time.split(':')[1]}`
                : 'Non spécifié'}
            </div>
          </div>
          {activity.activity && activity.occurences && activity.activity.frequency === 'unique' && (
            <div className="mt-12">
              <Unique
                activity={activity.activity}
                occurences={[
                  {
                    date: `${activity.activity.start_date}T00:00:00`,
                    id_activity: activity.activity.id,
                    max_participants: activity.activity.max_participants,
                    min_participants: activity.activity.min_participants,
                  },
                ]}
                users={usersSet1}
              />
            </div>
          )}
          {activity.activity && activity.occurences && activity.activity.frequency !== 'unique' && (
            <div className="mt-12">
              <Occurences
                activity={activity.activity}
                occurences={activity.occurences}
                users1={usersSet1}
                users2={usersSet2}
                users3={usersSet3}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ActivityDetailsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsResponse, addressesResponse] = await Promise.all([getSports(), getAddresses()]);

        if (sportsResponse.status === 200) {
          setSports(sportsResponse.data.data);
        } else {
          throw new Error('Erreur lors de la récupération des sports');
        }

        if (addressesResponse.status === 200) {
          setAddresses(addressesResponse.data.data);
        } else {
          throw new Error('Erreur lors de la récupération des adresses');
        }
      } catch (_error) {
        toast.error('Erreur lors de la récupération des données');
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <Suspense fallback={<ActivityDetailsSkeleton />}>
        <ActivityDetails sports={sports} addresses={addresses} />
      </Suspense>
    </main>
  );
}
