'use client';

import type { Activity, Address, Sport } from '@/app/lib/type/Activities';
import ActivityRow from '@/app/ui/dashboard/activities/ActivityRow';

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
