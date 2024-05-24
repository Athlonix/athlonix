import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Round = {
  id: number;
  name: string;
  id_tournament: number;
  order: number;
};

interface DeleteRoundProps {
  round: Round;
}

function DeleteRound(props: DeleteRoundProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function deleteRound(round: Round) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/tournaments/${round.id_tournament}/rounds/${round.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          const url = `/dashboard/tournaments/matches?id_tournament=${props.round.id_tournament}&deleted=true`;
          window.location.href = url;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive" className="h-8 gap-1">
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Supprimer le round</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suppression du round</DialogTitle>
          <DialogDescription className="mx-5">
            Etes vous sûr de vouloir supprimer le round ?
            <div className="flex gap-4 mt-4">
              <Button variant="destructive" className="w-full" onClick={() => deleteRound(props.round)}>
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
