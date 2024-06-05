import type { Activity } from '@/app/(withNavbar)/activities/page';
import { CalendarDays, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="h-44 p-4 shadow-lg">
      <div className="flex gap-6 h-full">
        <div className="relative w-64 h-36">
          <Link href="/simon">
            <Image
              className="object-cover"
              width={256}
              height={144}
              src={'/placeholder.jpg'}
              style={{ width: '256px', height: '144px' }}
              alt={'placeholder'}
            />
          </Link>
        </div>
        <div className="h-full max-w-[624px]">
          <h2 className="truncate cursor-pointer hover:text-slate-400" title={activity.name}>
            {activity.name}
          </h2>
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
              {activity.frequency === 'daily' && 'Journalier'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
