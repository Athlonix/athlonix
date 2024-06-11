'use client';

import type { Vote } from '@/app/(dashboard)/dashboard/votes/page';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { toast } from '@repo/ui/components/ui/sonner';
import { CircleX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

interface Props {
  vote: Vote;
  setVotes: React.Dispatch<React.SetStateAction<Vote[]>>;
}

function DeleteVote({ vote, setVotes }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function deletePoll() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/polls/${vote.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
      })
      .then(() => {
        setVotes((prevVotes) => prevVotes.filter((v) => v.id !== vote.id));
        toast.success('Le vote a bien été supprimé', { duration: 5000 });
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <CircleX size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suppression du vote</DialogTitle>
          <DialogDescription className="mx-5">
            Etes vous sûr de vouloir supprimer le vote ?
            <div className="flex gap-4 mt-4">
              <Button variant="destructive" className="w-full" onClick={() => deletePoll()}>
                Supprimer
              </Button>
              <Button variant="secondary" type="button" onClick={() => setOpen(false)} className="w-full">
                Annuler
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteVote;
