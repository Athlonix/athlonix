import EditForm from '@/app/ui/dashboard/activities/EditForm';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { toast } from '@repo/ui/components/ui/sonner';
import { TableCell, TableRow } from '@repo/ui/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import { useState } from 'react';

type Tournament = {
  id: number;
  created_at: string;
  default_match_length: number | null;
  name: string;
  max_participants: number;
  team_capacity: number;
  rules: string | null;
  prize: string | null;
  id_address: number | null;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

interface TournamentRowProps {
  tournament: Tournament;
  addresses: Address[];
}

function TournamentRow(props: TournamentRowProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [name, setName] = useState(props.tournament.name);
  const [maxParticipants, setMaxParticipants] = useState(props.tournament.max_participants);
  const [teamCapacity, setTeamCapacity] = useState(props.tournament.team_capacity);
  const [rules, setRules] = useState(props.tournament.rules);
  const [prize, setPrize] = useState(props.tournament.prize);
  const [idAddress, setIdAddress] = useState(props.tournament.id_address);
  const [defaultMatchLength, setDefaultMatchLength] = useState(props.tournament.default_match_length);

  async function deleteActivity() {
    console.log('TODO');
  }

  return (
    <TableRow key={props.tournament.id}>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{defaultMatchLength}</TableCell>
      <TableCell>{maxParticipants}</TableCell>
      <TableCell>{teamCapacity}</TableCell>
      <TableCell>
        {idAddress && props.addresses
          ? Object.keys(props.addresses)
              .map((addressId) => {
                const address = props.addresses[Number(addressId)];
                if (address && address.id === idAddress) {
                  if (address.name) return address.name;
                  if (address.complement) return `${address.road} ${address.number}, ${address.complement}`;
                  return `${address.road} ${address.number}`;
                }
                return null;
              })
              .filter((addressName) => addressName !== null)[0] || ''
          : ''}
      </TableCell>
      {name !== 'Supprimé' && (
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Button variant="ghost" className="w-full p-0 font-normal pl-2">
                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                  <DialogTrigger className="w-full text-left">Editer</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edition de l'adresse {props.tournament.id}</DialogTitle>
                      {/* <DialogDescription>
                        <EditForm
                          activity={props.activity}
                          setter={setter}
                          addresses={props.addresses}
                          sports={props.sports}
                          closeDialog={() => setOpenEdit(false)}
                        />
                      </DialogDescription> */}
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </Button>
              <Button variant="ghost" className="w-full p-0 font-normal pl-2">
                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                  <DialogTrigger className="w-full text-left">Supprimer</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Suppression de l'adresse {props.tournament.id}</DialogTitle>
                      <DialogDescription>
                        <div className="mb-4">Êtes-vous sûr de vouloir supprimer cette activité ?</div>
                        <div className="flex w-full justify-end gap-4">
                          <Button variant="destructive" onClick={deleteActivity}>
                            Supprimer
                          </Button>
                          <Button variant="secondary" onClick={() => setOpenDelete(false)}>
                            Annuler
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
}

export default TournamentRow;
