'use client';

import type { Activity } from '@/app/lib/type/Activities';
import { getActivities } from '@/app/lib/utils/activities';
import ActivityCard from '@/app/ui/components/activities/ActivityCard';
import PaginationComponent from '@repo/ui/components/ui/PaginationComponent';
import { Input } from '@repo/ui/components/ui/input';
import { Separator } from '@repo/ui/components/ui/separator';
import { toast } from '@repo/ui/components/ui/sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface ActivitiesData {
  data: Activity[];
  count: number;
}

function ShowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let page = searchParams.get('page') || 1;
  if (typeof page === 'string') {
    page = Number.parseInt(page);
  }

  const [maxPage, setMaxPage] = useState<number>(1);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data, status } = await getActivities(page, searchTerm);

      if (status !== 200) {
        toast.error('Erreur lors de la récupération des activités', { duration: 5000 });
      }

      setActivities(data.data);
      setMaxPage(Math.ceil(data.count / 10));
    }, 500);

    return () => clearTimeout(timer);
  }, [page, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="flex justify-center w-full my-4">
        <h1 className="font-bold">Activités</h1>
      </div>
      <Separator className="mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-full rounded-lg bg-background pl-8"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>
      <div className="grid gap-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} member={true} />
        ))}
      </div>
      <div className="mt-8">
        <PaginationComponent page={page} maxPage={maxPage} href="/activities" />
      </div>
    </>
  );
}

function page() {
  return (
    <main>
      <Suspense fallback={<div>Chargement...</div>}>
        <ShowContent />
      </Suspense>
    </main>
  );
}

export default page;
