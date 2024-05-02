'use client';

import EditForm from '@/app/ui/dashboard/addresses/EditForm';
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
import { TableCell, TableRow } from '@repo/ui/components/ui/table';
import { useToast } from '@repo/ui/hooks/use-toast';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface ActivityProps {
  id: number;
  min_participants: number;
  max_participants: number;
  name: string;
  id_sport: number | null;
  id_address: number | null;
  days: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  end_date: string;
  start_date: string;
  description: string | null;
  recurrence: 'weekly' | 'monthly' | 'annual';
  interval: number;
}

function ActivityRow(address: ActivityProps) {
  const { toast } = useToast();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [minParticipants, setMinParticipants] = useState(address.min_participants);
  const [maxParticipants, setMaxParticipants] = useState(address.max_participants);
  const [name, setName] = useState(address.name);
  const [idSport, setIdSport] = useState(address.id_sport);
  const [idAddress, setIdAddress] = useState(address.id_address);
  const [days, setDays] = useState(address.days);
  const [endDate, setEndDate] = useState(address.end_date);
  const [startDate, setStartDate] = useState(address.start_date);
  const [description, setDescription] = useState(address.description);
  const [recurrence, setRecurrence] = useState(address.recurrence);
  const [interval, setInterval] = useState(address.interval);

  const setter = {
    minParticipants: setMinParticipants,
    maxParticipants: setMaxParticipants,
    name: setName,
    idSport: setIdSport,
    idAddress: setIdAddress,
    days: setDays,
    endDate: setEndDate,
    startDate: setStartDate,
    description: setDescription,
    recurrence: setRecurrence,
    interval: setInterval,
  };

  async function deleteActivity() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${urlApi}/activity/${address.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        toast({ title: 'Succès', description: "L'activité a été supprimé avec succès" });
      })
      .catch((error: Error) => {
        toast({ title: 'Erreur', description: error?.message });
      });

    setOpenDelete(false);
  }

  return (
    <TableRow key={address.id}>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        {number} {road}
        {complement && `, ${complement}`}
      </TableCell>
      <TableCell>{city}</TableCell>
      <TableCell>{postalCode}</TableCell>
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
                    <DialogTitle>Edition de l'adresse {address.id}</DialogTitle>
                    {/* <DialogDescription>
                      <EditForm
                        id={address.id}
                        road={road}
                        postal_code={postalCode}
                        complement={complement}
                        city={city}
                        number={number}
                        name={name}
                        closeDialog={() => setOpenEdit(false)}
                        setter={setter}
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
                    <DialogTitle>Edition de l'adresse {address.id}</DialogTitle>
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
    </TableRow>
  );
}

export default ActivityRow;
