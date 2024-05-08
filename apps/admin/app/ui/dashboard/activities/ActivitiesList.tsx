'use client';

import ActivityRow from '@/app/ui/dashboard/activities/ActivityRow';

type Activity = {
  id: number;
  min_participants: number;
  max_participants: number;
  name: string;
  id_sport: number | null;
  id_address: number | null;
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  end_date: string;
  start_date: string;
  description: string | null;
  recurrence: 'weekly' | 'monthly' | 'annual';
  interval: number;
};

type Sport = {
  id: number;
  name: string;
  max_participants: number | null;
  min_participants: number;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

interface Props {
  activities: Activity[];
  sports: Sport[];
  addresses: Address[];
}

function ActivitiesList({ activities, sports, addresses }: Props) {
  return (
    <>
      {activities.map((activity: Activity) => (
        <ActivityRow key={activity.id} activity={activity} sports={sports} addresses={addresses} />
      ))}
    </>
  );
}

export default ActivitiesList;
