import type { FullPoll, Vote } from '@/app/lib/type/Votes';
import { voteToPoll } from '@/app/lib/utils/votes';
import { Button } from '@ui/components/ui/button';
import { Separator } from '@ui/components/ui/separator';
import { toast } from '@ui/components/ui/sonner';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

function VotesOptions({
  poll,
  hasVoted,
  round,
}: { poll: FullPoll; hasVoted: Dispatch<SetStateAction<number[]>>; round: number }) {
  const [selected, setSelected] = useState<number[]>([]);
  let currentPoll: FullPoll = poll;
  if (round > 1) {
    currentPoll = poll.sub_polls[round - 2] as FullPoll;
  }

  function handleSelectOption(id: number) {
    const temp_selected = selected;
    if (temp_selected.includes(id)) {
      temp_selected.splice(selected.indexOf(id), 1);
    } else {
      if (temp_selected.length >= currentPoll.max_choices) {
        temp_selected.shift();
      }
      temp_selected.push(id);
    }
    setSelected([...temp_selected]);
  }

  async function handleVote() {
    const { status } = await voteToPoll(currentPoll.id, selected);
    if (status !== 201) {
      toast.error('Une erreur est survenue lors de la soumission de votre vote', { duration: 2000 });
    } else {
      toast.success('Votre vote a bien été pris en compte', { duration: 2000 });
      hasVoted((prev) => [...prev, currentPoll.id]);
    }
  }

  if (round === 1) {
    return (
      <>
        <div className="flex justify-center text-3xl font-bold">Options ({poll.max_choices} choix)</div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-6 mx-8">
          {poll.results.map((result) => (
            <div key={result.id}>
              <Button
                className="w-full text-3xl py-10"
                variant={selected.includes(result.id) ? 'success' : 'default'}
                onClick={() => handleSelectOption(result.id)}
              >
                {result.content}
              </Button>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-center">
          <Button className="text-lg px-12 py-6" variant="info" onClick={handleVote}>
            Valider votre vote
          </Button>
        </div>
      </>
    );
  }

  const originalValue = poll.results.map((result) => {
    return {
      id: result.id,
      content: result.content,
      votes: result.votes,
    };
  });

  const subPoll = poll.sub_polls[round - 2];
  const previousSubPoll = round > 2 ? poll.sub_polls[round - 3] : poll;

  if (!previousSubPoll || !subPoll) return null;

  const toKeep = previousSubPoll.results.sort((a: Vote, b: Vote) => b.votes - a.votes).slice(0, subPoll.keep);

  const slicedResults = toKeep?.map((result) => {
    if (!result.id_original)
      return {
        ...result,
        votes: subPoll.results.find((subPollResult) => subPollResult.id_original === result.id)?.votes,
        id_original: result.id,
      };
    return {
      id: subPoll.results.find((subPollResult) => subPollResult.id_original === result.id_original)?.id,
      content: originalValue.find((original) => original.id === result.id_original)?.content,
      id_original: result.id_original,
      votes: subPoll.results.find((subPollResult) => subPollResult.id_original === result.id_original)?.votes,
    };
  });

  return (
    <>
      <div className="flex justify-center text-3xl font-bold">Options ({subPoll.max_choices} choix)</div>
      <Separator className="my-4" />
      <div className="grid grid-cols-2 gap-6 mx-8">
        {slicedResults.map((result) => (
          <div key={result.id}>
            <Button
              className="w-full text-3xl py-10"
              variant={selected.includes(result.id as number) ? 'success' : 'default'}
              onClick={() => handleSelectOption(result.id as number)}
            >
              {result.content}
            </Button>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-center">
        <Button className="text-lg px-12 py-6" variant="info" onClick={handleVote}>
          Valider votre vote
        </Button>
      </div>
    </>
  );
}

export default VotesOptions;
