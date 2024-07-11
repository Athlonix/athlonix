'use client';

import type { FullPoll } from '@/app/lib/type/Votes';
import { deleteRound } from '@/app/lib/utils/votes';
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
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

interface Props {
  poll: FullPoll;
  setPoll: React.Dispatch<React.SetStateAction<FullPoll | undefined>>;
}

function DeleteRound({ poll, setPoll }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleDeleteRound() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;
    const lastId = poll.sub_polls[poll.sub_polls.length - 1]?.id;
    if (!lastId) {
      toast.error('Aucun tour à supprimer', { duration: 5000 });
      return;
    }

    const { status } = await deleteRound(lastId);

    if (status === 403) {
      router.push('/');
    }
    if (status !== 200) {
      toast.error('Une erreur est survenue lors de la suppression du tour', { duration: 5000 });
      return;
    }

    const newSubPolls = poll.sub_polls.slice(0, -1);

    setPoll((prevPoll) => {
      if (!prevPoll) {
        return prevPoll;
      }

      return {
        ...prevPoll,
        sub_polls: newSubPolls,
        round: prevPoll.round - 1,
      };
    });

    toast.success('Le tour a bien été supprimé', { duration: 2000 });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-2xl" variant="destructive">
          Supprimer le dernier tour
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suppression du dernier tour</DialogTitle>
          <DialogDescription className="mx-5">
            Etes vous sûr de vouloir supprimer le dernier tour ?
            <div className="flex gap-4 mt-4">
              <Button variant="destructive" className="w-full" onClick={() => handleDeleteRound()}>
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

export default DeleteRound;
