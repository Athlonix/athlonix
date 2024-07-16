'use client';

import type { ActivityWithOccurences, Address, Sport, User } from '@/app/lib/type/Activities';
import { getActivityOccurences, getActivityUsers, getAddresses, getSports } from '@/app/lib/utils/activities';
import Occurences from '@/app/ui/components/activities/Occurences';
import { Badge } from '@ui/components/ui/badge';
import { Separator } from '@ui/components/ui/separator';
import { toast } from '@ui/components/ui/sonner';
import { useRouter, useSearchParams } from 'next/navigation';
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

function ShowContent({ sports, addresses }: { sports: Sport[]; addresses: Address[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  let id = searchParams.get('id') || 1;
  if (typeof id === 'string') {
    id = Number.parseInt(id);
  }

  const [activity, setActivity] = useState<ActivityWithOccurences>();
  const [usersSet1, setUsersSet1] = useState<User[]>([]);
  const [usersSet2, setUsersSet2] = useState<User[]>([]);
  const [usersSet3, setUsersSet3] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await getActivityOccurences(id);

      if (status === 404) {
        router.push('/not-found');
      }
      if (status !== 200) {
        toast.error("Erreur lors de la récupération de l'activité", { duration: 5000 });
      }

      if (data.occurences[0]) {
        const { data: usersData, status: usersStatus } = await getActivityUsers(id, data.occurences[0].date);

        if (usersStatus === 200) {
          setUsersSet1(usersData.data);
        } else {
          toast.error('Une erreur est survenue lors de la récupération des utilisateurs', { duration: 2000 });
        }
      }

      if (data.occurences[1]) {
        const { data: usersData, status: usersStatus } = await getActivityUsers(id, data.occurences[1].date);

        if (usersStatus === 200) {
          setUsersSet2(usersData.data);
        } else {
          toast.error('Une erreur est survenue lors de la récupération des utilisateurs', { duration: 2000 });
        }
      }

      if (data.occurences[2]) {
        const { data: usersData, status: usersStatus } = await getActivityUsers(id, data.occurences[2].date);

        if (usersStatus === 200) {
          setUsersSet3(usersData.data);
        } else {
          toast.error('Une erreur est survenue lors de la récupération des utilisateurs', { duration: 2000 });
        }
      }
    };

    fetchData();
  }, [id, router]);
  return (
    <div>
      <div className="flex justify-center text-3xl font-bold">{activity?.activity.name}</div>
      <Separator className="my-4" />
      <div>
        {activity?.activity.description?.split('\n').map((i, key) => {
          return (
            <div key={i} className=" text-justify mb-4">
              {i}
            </div>
          );
        })}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-center text-3xl font-bold">Informations</div>
      <Separator className="my-4" />
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
          <Badge className="text-md">Heure de début :</Badge>
          <div>
            {activity?.activity.start_date && activity?.activity.start_time
              ? `${activity.activity.start_time.split(':')[0]}:${activity.activity.start_time.split(':')[1]}`
              : ''}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Badge className="text-md">Heure de fin :</Badge>
          <div>
            {activity?.activity.end_date && activity?.activity.end_time
              ? `${activity.activity.end_time.split(':')[0]}:${activity.activity.end_time.split(':')[1]}`
              : ''}
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      {activity?.activity && activity?.occurences && (
        <Occurences
          activity={activity.activity}
          occurences={activity.occurences}
          users1={usersSet1}
          users2={usersSet2}
          users3={usersSet3}
        />
      )}
    </div>
  );
}

function page() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sportsData, status: sportsStatus } = await getSports();

      if (sportsStatus === 200) {
        setSports(sportsData.data);
      } else {
        toast.error('Une erreur est survenue lors de la récupération des sports', { duration: 2000 });
      }

      const { data: addressesData, status: addressesStatus } = await getAddresses();

      if (addressesStatus === 200) {
        setAddresses(addressesData.data);
      } else {
        toast.error('Une erreur est survenue lors de la récupération des adresses', { duration: 2000 });
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <Suspense fallback={<div>Chargement...</div>}>
        <ShowContent sports={sports} addresses={addresses} />
      </Suspense>
    </main>
  );
}

export default page;
