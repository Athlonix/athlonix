import type { Vote } from '@/app/lib/type/Votes';
import { voteToPoll } from '@/app/lib/utils/votes';
import { Button } from '@ui/components/ui/button';
import { Separator } from '@ui/components/ui/separator';
import { toast } from '@ui/components/ui/sonner';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

function VotesOptions({ vote, hasVoted }: { vote: Vote; hasVoted: Dispatch<SetStateAction<boolean | null>> }) {
  const [selected, setSelected] = useState<number[]>([]);

  function handleSelectOption(id: number) {
    const temp_selected = selected;
    if (temp_selected.includes(id)) {
      temp_selected.splice(selected.indexOf(id), 1);
    } else {
      if (temp_selected.length >= vote.max_choices) {
        temp_selected.shift();
      }
      temp_selected.push(id);
    }
    setSelected([...temp_selected]);
  }

  async function handleVote() {
    const { status } = await voteToPoll(vote.id, selected);
    if (status !== 201) {
      toast.error('Une erreur est survenue lors de la soumission de votre vote', { duration: 2000 });
    } else {
      toast.success('Votre vote a bien été pris en compte', { duration: 2000 });
      hasVoted(true);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center text-lg">
        {vote.description.split('\n').map((i, key) => {
          return (
            <div key={i} className=" text-justify">
              {i}
            </div>
          );
        })}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-center text-3xl font-bold">Options</div>
      <Separator className="my-4" />
      <div className="grid grid-cols-2 gap-6 mx-8">
        {vote.results.map((result) => (
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

export default VotesOptions;
