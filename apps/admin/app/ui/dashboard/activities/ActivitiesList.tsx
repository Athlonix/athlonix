'use client';

import ActivityRow from '@/app/ui/dashboard/activities/ActivityRow';

type Activity = {
  id: number;
  min_participants: number;
  max_participants: number;
  name: string;
  id_sport: number | null;
  id_address: number | null;
  days: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  end_date: string;
  start_date: string;
  description: string | null;
  recurrence: 'weekly' | 'monthly' | 'annual';
  interval: number;
};

function UsersList({ activities }: { activities: Activity[] }) {
  return (
    <>
      {activities.map((activity: Activity) => (
        <ActivityRow key={activity.id} {...activity} />
      ))}
    </>
  );
}

export default UsersList;
