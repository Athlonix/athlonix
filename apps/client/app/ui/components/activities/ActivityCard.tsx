import type { Activity } from '@/app/lib/type/Activities';
import { CalendarDays, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function ActivityCard({ activity, member }: { activity: Activity; member: boolean }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = `${process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL}/image/activities/activity_${activity.id}`;
  const placeholder = '/placeholder.jpg';
  return (
    <div className="h-44 p-4 shadow-lg">
      <div className="flex gap-6 h-full">
        <div className="relative w-64 h-36">
          <Link href={`/activities/details?id=${activity.id}`}>
            <Image
              className="object-cover"
              width={256}
              height={144}
              src={imageError ? placeholder : imageUrl}
              style={{ width: '256px', height: '144px' }}
              alt={activity.name}
              onError={() => setImageError(true)}
            />
          </Link>
        </div>
        <div className="h-full max-w-[624px]">
          <Link
            href={member ? `/members/activities/details?id=${activity.id}` : `/activities/details?id=${activity.id}`}
          >
            <h2 className="truncate cursor-pointer hover:text-slate-400" title={activity.name}>
              {activity.name}
            </h2>
          </Link>
          <div>
            <p className="font-extralight text-slate-950 leading-5 h-full line-clamp-4 text-justify">
              {activity.description}
            </p>
          </div>
        </div>
        <div className=" flex flex-col justify-end ml-auto">
          <div className="w-full flex justify-end items-center gap-4">
            <div className="flex items-center gap-1 font-medium text-sm">
              <User />
              {activity.min_participants} - {activity.max_participants}
            </div>

            <div className="flex items-center gap-1 font-medium text-sm">
              <CalendarDays />
              {activity.frequency === 'weekly' && 'Hebdomadaire'}
              {activity.frequency === 'monthly' && 'Mensuel'}
              {activity.frequency === 'yearly' && 'Annuel'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
