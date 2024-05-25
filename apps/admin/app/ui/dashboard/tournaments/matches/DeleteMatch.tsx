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

interface DeleteMatchProps {
  idTournament: string;
  idRound: number;
  idMatch: number;
}

function DeleteMatch(props: DeleteMatchProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function deleteMatch() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/tournaments/${props.idTournament}/rounds/${props.idRound}/matches/${props.idMatch}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          const url = `/dashboard/tournaments/matches?id_tournament=${props.idTournament}&deleted=true`;
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
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Supprimer le match</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suppression du match</DialogTitle>
          <DialogDescription className="mx-5">
            Etes vous sûr de vouloir supprimer le match ?
            <div className="flex gap-4 mt-4">
              <Button variant="destructive" className="w-full" onClick={() => deleteMatch()}>
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

export default DeleteMatch;
