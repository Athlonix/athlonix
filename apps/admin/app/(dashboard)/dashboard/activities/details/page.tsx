'use client';

import type { ActivityWithOccurences, Address, Sport, User } from '@/app/lib/type/Activities';
import { getActivityOccurences, getActivityUsers, getAddresses, getSports } from '@/app/lib/utils/activities';
import Occurences from '@/app/ui/dashboard/activities/details/Occurences';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { toast } from '@repo/ui/components/ui/sonner';
import { Separator } from '@ui/components/ui/separator';
import { ClockIcon, MapPinIcon, Medal, RepeatIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const FrenchFrequency: Record<string, string> = {
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  yearly: 'Annuel',
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

function ActivityDetails({
  activity,
  sports,
  addresses,
}: { activity: ActivityWithOccurences; sports: Sport[]; addresses: Address[] }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">{activity.activity.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {activity.activity.description && (
          <>
            <p className="text-center text-muted-foreground mb-4">{activity.activity.description}</p>
            <Separator className="my-4" />
          </>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-sm flex items-center gap-2">
              <MapPinIcon size={16} />
              {activity.activity.id_address
                ? addresses.find((address) => address.id === activity.activity.id_address)?.name
                : 'Aucune adresse'}
            </Badge>
          </div>
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-sm flex items-center gap-2">
              <Medal size={16} />
              {activity.activity.id_sport
                ? sports.find((sport) => sport.id === activity.activity.id_sport)?.name
                : 'Aucun sport'}
            </Badge>
          </div>
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-sm flex items-center gap-2">
              <RepeatIcon size={16} />
              {activity.activity.frequency ? FrenchFrequency[activity.activity.frequency] : 'Aucune fréquence'}
            </Badge>
          </div>
        </div>

        {activity.activity.frequency === 'weekly' && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(FrenchDays).map(([key, value]) => (
                <Badge
                  key={key}
                  variant={
                    activity.activity.days_of_week.includes(key as keyof typeof FrenchDays) ? 'default' : 'outline'
                  }
                >
                  {value}
                </Badge>
              ))}
            </div>
          </>
        )}

        <Separator className="my-4" />
        <div className="flex justify-center items-center gap-4">
          <Badge variant="secondary" className="text-sm flex items-center gap-2">
            <ClockIcon size={16} />
            Début: {activity.activity.start_time ? `${activity.activity.start_time.slice(0, 5)}` : 'N/A'}
          </Badge>
          <Badge variant="secondary" className="text-sm flex items-center gap-2">
            <ClockIcon size={16} />
            Fin: {activity.activity.end_time ? `${activity.activity.end_time.slice(0, 5)}` : 'N/A'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mx-auto" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-4" />
        <Separator className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((val, i) => (
            <Skeleton key={`skeleton-${val}`} className="h-8 w-full" />
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-center items-center gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  const idActivity = Number(searchParams.get('id') || 1);

  const [activity, setActivity] = useState<ActivityWithOccurences>();
  const [sports, setSports] = useState<Sport[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [usersSet1, setUsersSet1] = useState<User[]>([]);
  const [usersSet2, setUsersSet2] = useState<User[]>([]);
  const [usersSet3, setUsersSet3] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityResult, sportsResult, addressesResult] = await Promise.all([
          getActivityOccurences(idActivity),
          getSports(),
          getAddresses(),
        ]);

        if (activityResult.status === 200) setActivity(activityResult.data);
        if (sportsResult.status === 200) setSports(sportsResult.data.data);
        if (addressesResult.status === 200) setAddresses(addressesResult.data.data);

        if (activityResult.data.occurences.length > 0) {
          const userPromises = activityResult.data.occurences
            .slice(0, 3)
            .map((occurence) => getActivityUsers(idActivity, occurence.date));

          const userResults = await Promise.all(userPromises);
          if (userResults[0]) setUsersSet1(userResults[0].data.data);
          if (userResults[1]) setUsersSet2(userResults[1].data.data);
          if (userResults[2]) setUsersSet3(userResults[2].data.data);
        }
      } catch (_error) {
        toast.error('Une erreur est survenue lors de la récupération des données');
      }
    };

    fetchData();
  }, [idActivity]);

  if (!activity || sports.length === 0 || addresses.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-4xl mx-auto">
      <ActivityDetails activity={activity} sports={sports} addresses={addresses} />
      <Occurences
        activity={activity.activity}
        occurences={activity.occurences}
        users1={usersSet1}
        users2={usersSet2}
        users3={usersSet3}
        setUsers1={setUsersSet1}
        setUsers2={setUsersSet2}
        setUsers3={setUsersSet3}
      />
    </div>
  );
}
export default function Page() {
  return (
    <main>
      <Suspense fallback={<LoadingSkeleton />}>
        <PageContent />
      </Suspense>
    </main>
  );
}
