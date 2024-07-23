'use client';

import type { FullPoll, Vote } from '@/app/lib/type/Votes';
import { getOnePoll } from '@/app/lib/utils/votes';
import AddRound from '@/app/ui/dashboard/votes/AddRound';
import DeleteRound from '@/app/ui/dashboard/votes/DeleteRound';
import { Progress } from '@repo/ui/components/ui/progress';
import Loading from '@ui/components/ui/loading';
import { CircleArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ShowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idPoll = searchParams.get('id');
  const [poll, setPoll] = useState<FullPoll>();
  const [totalVotes, setTotalVotes] = useState<number>(0);

  useEffect(() => {
    if (!idPoll) {
      router.push('/dashboard/votes');
    }

    const fetchData = async () => {
      const { data, status } = await getOnePoll(Number.parseInt(idPoll ?? '0'), false);

      if (status === 403) {
        router.push('/');
      }
      if (status !== 200) {
        router.push('/dashboard/votes');
      }
      setPoll(data);
      setTotalVotes(
        Math.max(
          1,
          data.results.reduce((acc, result) => acc + result.votes, 0),
        ),
      );
    };

    fetchData();
  }, [router, idPoll]);

  if (!poll) return <Loading />;

  const originalValue = poll.results.map((result) => {
    return {
      id: result.id,
      content: result.content,
      votes: result.votes,
    };
  });

  return (
    <>
      <div className="flex items-center gap-5">
        <CircleArrowLeft className="w-8 h-8" onClick={() => window.history.back()} cursor={'pointer'} />
        <h1 className="text-lg font-semibold md:text-2xl">Résultats du vote : {poll?.title}</h1>
      </div>
      <div className="flex flex-col rounded-lg border border-solid shadow-sm p-4" x-chunk="dashboard-02-chunk-1">
        <h3 className="flex justify-center text-3xl items-center gap-2">
          <div>
            {poll?.round}
            <sup>e</sup>
          </div>
          Tour
        </h3>
        <div className="grid gap-4 w-full">
          {poll?.results.map((result) => (
            <div key={result.id} className="flex justify-center flex-col gap-4 p-4">
              <div>
                {result.content} | {result.votes || 0} votes ({(((result.votes ?? 0) / totalVotes) * 100).toFixed(2)} %)
              </div>
              <Progress value={((result.votes ?? 0) / totalVotes) * 100} />
            </div>
          ))}
        </div>
      </div>
      {poll.sub_polls.map((subPoll, index) => {
        const previousSubPoll = index > 0 ? poll.sub_polls[index - 1] : poll;
        const toKeep = previousSubPoll?.results.sort((a: Vote, b: Vote) => b.votes - a.votes).slice(0, subPoll.keep);

        const slicedResults = toKeep?.map((result) => {
          if (!result.id_original)
            return {
              ...result,
              votes: subPoll.results.find((subPollResult) => subPollResult.id_original === result.id)?.votes,
              id_original: result.id,
            };
          return {
            id: result.id,
            content: originalValue.find((original) => original.id === result.id_original)?.content,
            id_original: result.id_original,
            votes: subPoll.results.find((subPollResult) => subPollResult.id_original === result.id_original)?.votes,
          };
        });
        const subPollTotalVotes = Math.max(
          1,
          slicedResults?.reduce((total, result) => total + (result.votes ?? 0), 0) || 0,
        );

        return (
          <div
            key={subPoll.id}
            className="flex flex-col rounded-lg border border-solid shadow-sm p-4"
            x-chunk="dashboard-02-chunk-1"
          >
            <h3 className="flex justify-center text-3xl items-center gap-2">
              <div>
                {subPoll?.round}
                <sup>e</sup>
              </div>
              Tour
            </h3>
            <div className="grid gap-4 w-full">
              {slicedResults?.map((result) => (
                <div key={result.id} className="flex justify-center flex-col gap-4 p-4">
                  <div>
                    {poll?.results.find((pollResult) => pollResult.id === result.id_original)?.content} |{' '}
                    {result.votes || 0} votes ({(((result.votes ?? 0) / (subPollTotalVotes ?? 1)) * 100).toFixed(2)}%)
                  </div>
                  <Progress value={((result.votes ?? 0) / (subPollTotalVotes ?? 1)) * 100} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="flex flex-col rounded-lg border border-solid shadow-sm p-4 gap-4">
        {poll && (
          <div className="flex justify-center gap-4">
            <AddRound poll={poll} setPoll={setPoll} />
            <DeleteRound poll={poll} setPoll={setPoll} />
          </div>
        )}
      </div>
    </>
  );
}

function page() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <Suspense fallback={<Loading />}>
        <ShowContent />
      </Suspense>
    </main>
  );
}

export default page;
