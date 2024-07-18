import type { Team } from '@/app/lib/type/Tournaments';
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
import { X } from 'lucide-react';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface CancelTeamProps {
  id_tournament: number;
  team: Team;
  setter: Dispatch<SetStateAction<Team[]>>;
}

function CancelTeam(props: CancelTeamProps) {
  const [open, setOpen] = useState(false);

  function cancelTeam() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/tournaments/${props.id_tournament}/teams/${props.team.id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("L'équipe a bien été annulée", { duration: 2000 });
          props.setter((prev) => prev.map((team) => (team.id === props.team.id ? { ...team, validate: false } : team)));
        }
      })
      .catch((error) => {
        toast.error("L'équipe n'a pas pu être annulée", { duration: 20000, description: error });
      });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="warning" className="h-8 gap-1">
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            <X />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Validation de l'équipe</DialogTitle>
          <DialogDescription className="mx-5">
            Etes vous sûr de vouloir annuler la validation l'équipe {props.team.name} ?
            <div className="flex gap-4 mt-4">
              <Button variant="warning" className="w-full" onClick={() => cancelTeam()}>
                Annuler
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

export default CancelTeam;
