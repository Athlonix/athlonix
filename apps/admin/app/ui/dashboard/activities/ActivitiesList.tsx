'use client';

import type { Activity } from '@/app/(dashboard)/dashboard/activities/page';
import ActivityRow from '@/app/ui/dashboard/activities/ActivityRow';

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
