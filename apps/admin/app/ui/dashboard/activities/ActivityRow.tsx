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

type Sport = {
  id: number;
  name: string;
  max_participants: number | null;
  min_participants: number;
};

type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

interface ActivityProps {
  id: number;
  min_participants: number;
  max_participants: number;
  name: string;
  id_sport: number | null;
  id_address: number | null;
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  end_date: string;
  start_date: string;
  description: string | null;
  recurrence: 'weekly' | 'monthly' | 'annual';
  interval: number;
  sports: Sport[];
  addresses: Address[];
}

const FrenchRecurrence: Record<string, string> = {
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  annual: 'Annuel',
};

const FrenchReccurenceNoun: Record<string, string> = {
  weekly: 'semaine',
  monthly: 'mois',
  annual: 'an',
};

const FrenchDays: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

function ActivityRow(activities: ActivityProps) {
  console.log(activities.sports);
  const { toast } = useToast();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [minParticipants, setMinParticipants] = useState(activities.min_participants);
  const [maxParticipants, setMaxParticipants] = useState(activities.max_participants);
  const [name, setName] = useState(activities.name);
  const [idSport, setIdSport] = useState(activities.id_sport);
  const [idAddress, setIdAddress] = useState(activities.id_address);
  const [days, setDays] = useState(activities.days);
  const [endDate, setEndDate] = useState(activities.end_date);
  const [startDate, setStartDate] = useState(activities.start_date);
  const [description, setDescription] = useState(activities.description);
  const [recurrence, setRecurrence] = useState(activities.recurrence);
  const [interval, setInterval] = useState(activities.interval);

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
    fetch(`${urlApi}/activity/${activities.id}`, {
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
    <TableRow key={activities.id}>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        {minParticipants} - {maxParticipants}
      </TableCell>
      <TableCell>
        {activities.id_sport && activities.sports
          ? Object.keys(activities.sports)
              .map((sportId) => {
                const sport = activities.sports[Number(sportId)];
                if (sport && sport.id === activities.id_sport) {
                  return sport.name;
                }
                return null;
              })
              .filter((sportName) => sportName !== null)[0] || ''
          : ''}
      </TableCell>
      <TableCell>
        {activities.id_address && activities.addresses
          ? Object.keys(activities.addresses)
              .map((addressId) => {
                const address = activities.addresses[Number(addressId)];
                if (address && address.id === activities.id_address) {
                  if (address.name) return address.name;
                  if (address.complement) return `${address.road} ${address.number}, ${address.complement}`;
                  return `${address.road} ${address.number}`;
                }
                return null;
              })
              .filter((addressName) => addressName !== null)[0] || ''
          : ''}
      </TableCell>
      <TableCell>{FrenchRecurrence[activities.recurrence]}</TableCell>
      {activities.recurrence === 'weekly' && (
        <TableCell>
          {activities.days.map((day) => FrenchDays[day]).join(', ')} de{' '}
          {`${new Date(activities.start_date).getHours().toString().padStart(2, '0')}:${new Date(activities.start_date)
            .getMinutes()
            .toString()
            .padStart(2, '0')} - ${new Date(activities.end_date).getHours().toString().padStart(2, '0')}:${new Date(
            activities.end_date,
          )
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}
        </TableCell>
      )}
      {activities.recurrence === 'monthly' && (
        <TableCell>
          {`Le ${new Date(activities.start_date).getDate()} de ${new Date(activities.start_date)
            .getHours()
            .toString()
            .padStart(2, '0')}:${new Date(activities.start_date).getMinutes().toString().padStart(2, '0')} - ${new Date(
            activities.end_date,
          )
            .getHours()
            .toString()
            .padStart(2, '0')}:${new Date(activities.end_date).getMinutes().toString().padStart(2, '0')}`}
        </TableCell>
      )}
      {activities.recurrence === 'annual' && (
        <TableCell>
          {`${new Date(activities.start_date).getDate()} ${new Date(activities.start_date).toLocaleString('default', {
            month: 'long',
          })} de ${new Date(activities.start_date).getHours().toString().padStart(2, '0')}:${new Date(
            activities.start_date,
          )
            .getMinutes()
            .toString()
            .padStart(2, '0')} - ${new Date(activities.end_date).getHours().toString().padStart(2, '0')}:${new Date(
            activities.end_date,
          )
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}
        </TableCell>
      )}
      <TableCell>
        {activities.interval} {FrenchReccurenceNoun[activities.recurrence]}
        {activities.interval > 1 && activities.recurrence !== 'monthly' ? 's' : ''}
      </TableCell>
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
                    <DialogTitle>Edition de l'adresse {activities.id}</DialogTitle>
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
                    <DialogTitle>Suppression de l'adresse {activities.id}</DialogTitle>
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
