'use client';

import type { ActivityWithOccurences } from '@/app/lib/type/Activities';
import { getActivityOccurences } from '@/app/lib/utils/activities';
import Loading from '@ui/components/ui/loading';
import { Separator } from '@ui/components/ui/separator';
import { toast } from '@ui/components/ui/sonner';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ShowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  let id = searchParams.get('id') || 1;
  if (typeof id === 'string') {
    id = Number.parseInt(id);
  }

  const [activity, setActivity] = useState<ActivityWithOccurences>();

  const imageUrl = `${process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL}/image/activities/activity_${activity?.activity.id}`;
  const placeholder = '/placeholder.jpg';

  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await getActivityOccurences(id);

      if (status === 404) {
        router.push('/not-found');
        return;
      }
      if (status !== 200) {
        toast.error("Erreur lors de la récupération de l'activité", { duration: 5000 });
        return;
      }
      setActivity(data);
    };

    fetchData();
  }, [id, router]);
  return (
    <div className="my-12">
      <div className="flex justify-center text-3xl font-bold">{activity?.activity.name}</div>
      <Separator className="my-4" />
      <div className="flex justify-center">
        <Image
          className="object-cover rounded-sm"
          width={1000}
          height={1000}
          src={imageError ? placeholder : imageUrl}
          alt={activity?.activity.name || ''}
          style={{ width: '40vw', height: 'auto' }}
          onError={() => setImageError(true)}
        />
      </div>
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
      <div className="flex justify-center">
        <div className="bg-slate-600 text-white rounded-lg p-2">
          Pour vous inscrire, veuillez vous rendre sur l'espace membre.
        </div>
      </div>
    </div>
  );
}

function page() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <ShowContent />
      </Suspense>
    </main>
  );
}

export default page;
