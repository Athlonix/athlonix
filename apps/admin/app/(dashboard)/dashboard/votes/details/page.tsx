'use client';

import type { Vote } from '@/app/(dashboard)/dashboard/votes/page';
import { Progress } from '@repo/ui/components/ui/progress';
import { CircleArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ShowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idPoll = searchParams.get('id');
  const [results, setResults] = useState<{ id: number; votes: number; content: string }[]>([]);
  const [title, setTitle] = useState<string>('');
  const [totalVotes, setTotalVotes] = useState<number>(0);

  useEffect(() => {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;
    if (!idPoll) {
      router.push('/dashboard/votes');
    }

    fetch(`${urlApi}/polls/${idPoll}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then(async (response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then((data: Vote) => {
        setTitle(data.title);
        setResults(data.results);
        setTotalVotes(data.results.reduce((acc, result) => acc + result.votes, 0));
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }, [router, idPoll]);

  return (
    <>
      <div className="flex items-center gap-5">
        <CircleArrowLeft className="w-8 h-8" onClick={() => window.history.back()} cursor={'pointer'} />
        <h1 className="text-lg font-semibold md:text-2xl">Résultats du vote : {title}</h1>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm p-4" x-chunk="dashboard-02-chunk-1">
        <div className="grid gap-4 w-full">
          {results.map((result) => (
            <div key={result.id} className="flex justify-center flex-col gap-4 p-4">
              <div>
                {result.content} | {result.votes || 0} votes ({((result.votes ?? 0 / totalVotes) * 100).toFixed(2)} %)
              </div>
              <Progress value={(result.votes ?? 0 / totalVotes) * 100} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function page() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <Suspense fallback={<div>Chargement...</div>}>
        <ShowContent />
      </Suspense>
    </main>
  );
}

export default page;
