'use client';

import type { ActivityWithOccurences, Address, Sport, User } from '@/app/lib/type/Activities';
import { getActivityOccurences, getActivityUsers, getAddresses, getSports } from '@/app/lib/utils/activities';
import Occurences from '@/app/ui/dashboard/activities/details/Occurences';
import { toast } from '@repo/ui/components/ui/sonner';
import { Badge } from '@ui/components/ui/badge';
import { Separator } from '@ui/components/ui/separator';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
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

function ShowContent({ sports, addresses }: { sports: Sport[]; addresses: Address[] }): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  let idActivity = searchParams.get('id') || 1;
  if (typeof idActivity === 'string') {
    idActivity = Number.parseInt(idActivity);
  }

  const [activity, setActivities] = useState<ActivityWithOccurences>();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await getActivityOccurences(idActivity);

      if (status === 200) {
        setActivities(data);
      } else if (status === 403) {
        router.push('/');
      } else {
        toast.error('Une erreur est survenue lors de la récupération des activités', { duration: 2000 });
      }

      const { data: usersData, status: usersStatus } = await getActivityUsers(idActivity);

      if (usersStatus === 200) {
        setUsers(usersData.data);
      } else if (usersStatus === 403) {
        router.push('/');
      } else {
        toast.error('Une erreur est survenue lors de la récupération des utilisateurs', { duration: 2000 });
      }
    };
    fetchData();
  }, [router, idActivity]);

  return (
    <div>
      <div className="flex justify-center text-4xl w-full">{activity?.activity.name}</div>
      <Separator className="my-4" />
      {activity?.activity.description && (
        <>
          <div className="flex justify-center text-lg w-full">{activity.activity.description}</div>
          <Separator className="my-4" />
        </>
      )}
      <div className="grid grid-cols-3">
        <div className="flex gap-4 items-center justify-center border-e-2">
          <Badge className="text-md">Sport :</Badge>
          {activity?.activity.id_sport
            ? sports.find((sport) => sport.id === activity.activity.id_sport)?.name
            : 'Aucun'}
        </div>
        <div className="flex gap-4 items-center justify-center border-e-2">
          <Badge className="text-md">Adresse :</Badge>
          {activity?.activity.id_address
            ? addresses.find((address) => address.id === activity.activity.id_address)?.name
            : 'Aucune'}
        </div>
        <div className="flex gap-4 items-center justify-center">
          <Badge className="text-md">Fréquence :</Badge>
          {activity?.activity.frequency ? FrenchFrequency[activity.activity.frequency] : 'Aucune'}
        </div>
      </div>
      <Separator className="my-4" />
      {activity?.activity.frequency === 'weekly' && (
        <>
          <div className="flex justify-center text-lg w-full gap-4">
            {Object.entries(FrenchDays).map(([key, value]) => (
              <Badge
                key={key}
                variant={
                  activity.activity.days_of_week.includes(key as keyof typeof FrenchDays) ? 'default' : 'secondary'
                }
                className="text-md"
              >
                {value}
              </Badge>
            ))}
          </div>
          <Separator className="my-4" />
        </>
      )}
      <div className="grid grid-cols-2 gap-4 items-center justify-center">
        <div className="flex items-center justify-center gap-4 border-e-2">
          <Badge className="text-md">Dates et heure de début :</Badge>
          <div>
            {activity?.activity.start_date && activity?.activity.start_time
              ? `${activity.activity.start_date.split('-')[1]}/${activity.activity.start_date.split('-')[2]}/${activity.activity.start_date.split('-')[0]}
            ${activity.activity.start_time.split(':')[0]}:${activity.activity.start_time.split(':')[1]}`
              : ''}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Badge className="text-md">Dates et heure de fin :</Badge>
          <div>
            {activity?.activity.end_date && activity?.activity.end_time
              ? `${activity.activity.end_date.split('-')[1]}/${activity.activity.end_date.split('-')[2]}/${activity.activity.end_date.split('-')[0]}
            ${activity.activity.end_time.split(':')[0]}:${activity.activity.end_time.split(':')[1]}`
              : ''}
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-center text-2xl w-full">
        Participants de la prochaine session ({users.length}/{activity?.activity.max_participants})
      </div>
      <div className="grid grid-cols-4 gap-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-center gap-4 border-e-2">
            <div>{user.username}</div>
          </div>
        ))}
      </div>
      {activity?.activity && activity?.occurences && (
        <Occurences activity={activity.activity} occurences={activity.occurences} />
      )}
    </div>
  );
}

export default function Page(): JSX.Element {
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sportsData, status: sportsStatus } = await getSports();

      if (sportsStatus === 200) {
        setSports(sportsData.data);
      } else if (sportsStatus === 403) {
        router.push('/');
      } else {
        toast.error('Une erreur est survenue lors de la récupération des sports', { duration: 2000 });
      }

      const { data: addressesData, status: addressesStatus } = await getAddresses();

      if (addressesStatus === 200) {
        setAddresses(addressesData.data);
      } else if (addressesStatus === 403) {
        router.push('/');
      } else {
        toast.error('Une erreur est survenue lors de la récupération des adresses', { duration: 2000 });
      }
    };

    fetchData();
  }, [router]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="grid flex-1 items-start">
          <Suspense>
            <ShowContent sports={sports} addresses={addresses} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
