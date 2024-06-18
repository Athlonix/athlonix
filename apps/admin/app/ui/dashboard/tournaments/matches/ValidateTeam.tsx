import type { Team } from '@/app/(dashboard)/dashboard/tournaments/matches/page';
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
import { Check } from 'lucide-react';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface ValidateTeamProps {
  id_tournament: number;
  team: Team;
  setter: Dispatch<SetStateAction<Team[]>>;
}

function ValidateTeam(props: ValidateTeamProps) {
  const [open, setOpen] = useState(false);

  function validateTeam() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/tournaments/${props.id_tournament}/teams/${props.team.id}/validate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("L'équipe a bien été validée", { duration: 2000 });
          props.setter((prev) => prev.map((team) => (team.id === props.team.id ? { ...team, validate: true } : team)));
        }
      })
      .catch((error) => {
        toast.error("L'équipe n'a pas pu être validée", { duration: 20000, description: error });
      });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="success" className="h-8 gap-1">
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            <Check />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Validation de l'équipe</DialogTitle>
          <DialogDescription className="mx-5">
            Etes vous sûr de vouloir valider l'équipe {props.team.name} ?
            <div className="flex gap-4 mt-4">
              <Button variant="success" className="w-full" onClick={() => validateTeam()}>
                Valider
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

export default ValidateTeam;
