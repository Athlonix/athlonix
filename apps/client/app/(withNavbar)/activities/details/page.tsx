'use client';

import type { ActivityWithOccurences } from '@/app/lib/type/Activities';
import { checkSubscriptionStatus, getUserFromCookie } from '@/app/lib/utils';
import { getActivityOccurences } from '@/app/lib/utils/activities';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { toast } from '@repo/ui/components/ui/sonner';
import { Calendar, Clock, Repeat, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ActivityDetailsPage(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activity, setActivity] = useState<ActivityWithOccurences>();
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  const id = Number(searchParams.get('id')) || 1;
  const imageUrl = `${process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL}/image/activities/activity_${activity?.activity.id}`;
  const placeholder = '/placeholder.jpg';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      const user = await getUserFromCookie();
      if (user && (await checkSubscriptionStatus(user)) === 'approved') {
        setIsMember(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  const formatDaysOfWeek = (days: string[]) => {
    const dayNames = days.map((day) => {
      switch (day) {
        case 'monday':
          return 'Lundi';
        case 'tuesday':
          return 'Mardi';
        case 'wednesday':
          return 'Mercredi';
        case 'thursday':
          return 'Jeudi';
        case 'friday':
          return 'Vendredi';
        case 'saturday':
          return 'Samedi';
        case 'sunday':
          return 'Dimanche';
        default:
          return day;
      }
    });
    return dayNames.join(', ');
  };

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'Hebdomadaire';
      case 'monthly':
        return 'Mensuel';
      case 'yearly':
        return 'Annuel';
      default:
        return frequency;
    }
  };

  if (loading) {
    return <ActivitySkeleton />;
  }

  const sessionInfo = activity?.activity;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-3xl font-bold text-center">{activity?.activity.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
            <Image
              fill
              className="object-cover"
              src={imageError ? placeholder : imageUrl}
              alt={activity?.activity.name || ''}
              onError={() => setImageError(true)}
            />
          </div>

          <div className="space-y-4 mb-6">
            {activity?.activity.description?.split('\n').map((paragraph, index) => (
              <p key={activity.activity.id + paragraph} className="text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Jours : {sessionInfo ? formatDaysOfWeek(sessionInfo.days_of_week) : 'Non spécifié'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                Horaire : {sessionInfo ? `${sessionInfo.start_time} - ${sessionInfo.end_time}` : 'Non spécifié'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Repeat className="h-5 w-5 text-muted-foreground" />
              <span>Fréquence : {sessionInfo ? formatFrequency(sessionInfo.frequency) : 'Non spécifié'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>Limite : {activity?.activity.max_participants} participants</span>
            </div>
          </div>

          <Separator className="my-6" />

          {isMember && (
            <div className="flex justify-center">
              <Link href={`/members/activities/details?id=${activity?.activity.id}`}>
                <Button size="lg">S'inscrire sur l'espace membre</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const ActivitySkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl">
    <Card>
      <CardHeader className="pb-0">
        <Skeleton className="h-8 w-3/4 mx-auto" />
      </CardHeader>
      <CardContent className="p-6">
        <Skeleton className="aspect-video w-full mb-6" />
        <div className="space-y-4 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  </div>
);
