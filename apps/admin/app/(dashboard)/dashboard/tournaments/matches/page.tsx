'use client';

import PaginationComponent from '@/app/ui/Pagination';
import ReportsList from '@/app/ui/dashboard/posts/details/ReportsList';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { Input } from '@repo/ui/components/ui/input';
import { Separator } from '@repo/ui/components/ui/separator';
import { MoreHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Round = {
  id: number;
  name: string;
  id_tournament: number;
  order: number;
};

type RoundsData = {
  data: Round[];
  count: number;
};

function page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idTournament = searchParams.get('id_tournament');
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/tournaments/${idTournament}/rounds`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/login');
        }
        return response.json();
      })
      .then((data: RoundsData) => {
        setRounds(data.data);
        return data.data;
      })
      .then((data) => {
        data.map((round) => {
          fetch(`${urlApi}/tournaments/${idTournament}/rounds/${round.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          })
            .then((response) => {
              if (response.status === 403) {
                router.push('/login');
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
            });
        });
      });
  }, [router, idTournament]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-semibold md:text-2xl">Tournoi</h1>
      </div>
      <div className="flex py-10 rounded-lg border border-dashed shadow-sm p-4">
        <div className="gap-4 w-full">Content here</div>
      </div>
    </main>
  );
}

export default page;
