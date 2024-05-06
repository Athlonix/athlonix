'use client';

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

type Activity = {
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
};

interface ActivityRowProps {
  activity: Activity;
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

function ActivityRow(props: ActivityRowProps) {
  const { toast } = useToast();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [minParticipants, setMinParticipants] = useState(props.activity.min_participants);
  const [maxParticipants, setMaxParticipants] = useState(props.activity.max_participants);
  const [name, setName] = useState(props.activity.name);
  const [idSport, setIdSport] = useState(props.activity.id_sport);
  const [idAddress, setIdAddress] = useState(props.activity.id_address);
  const [days, setDays] = useState(props.activity.days);
  const [endDate, setEndDate] = useState(props.activity.end_date);
  const [startDate, setStartDate] = useState(props.activity.start_date);
  const [description, setDescription] = useState(props.activity.description);
  const [recurrence, setRecurrence] = useState(props.activity.recurrence);
  const [interval, setInterval] = useState(props.activity.interval);

  const setter = {
    name: setName,
    minParticipants: setMinParticipants,
    maxParticipants: setMaxParticipants,
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
    fetch(`${urlApi}/activities/${props.activity.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        toast({ title: 'Succès', description: "L'activité a été supprimé avec succès" });

        setName('Supprimé');
        setMinParticipants(0);
        setMaxParticipants(0);
        setIdSport(null);
        setIdAddress(null);
        setDays([]);
        setEndDate('');
        setStartDate('');
        setDescription('');
        setInterval(0);
      })
      .catch((error: Error) => {
        toast({ title: 'Erreur', description: error?.message });
      });

    setOpenDelete(false);
  }

  return (
    <TableRow key={props.activity.id}>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        {minParticipants} - {maxParticipants}
      </TableCell>
      <TableCell>
        {idSport && props.sports
          ? Object.keys(props.sports)
              .map((sportId) => {
                const sport = props.sports[Number(sportId)];
                if (sport && sport.id === idSport) {
                  return sport.name;
                }
                return null;
              })
              .filter((sportName) => sportName !== null)[0] || ''
          : ''}
      </TableCell>
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
      <TableCell>{FrenchRecurrence[recurrence]}</TableCell>
      {recurrence === 'weekly' && (
        <TableCell>
          {days.map((day) => FrenchDays[day]).join(', ')} de{' '}
          {`${new Date(startDate).getHours().toString().padStart(2, '0')}:${new Date(startDate)
            .getMinutes()
            .toString()
            .padStart(2, '0')} - ${new Date(endDate).getHours().toString().padStart(2, '0')}:${new Date(endDate)
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}
        </TableCell>
      )}
      {recurrence === 'monthly' && (
        <TableCell>
          {`Le ${new Date(startDate).getDate()} de ${new Date(startDate)
            .getHours()
            .toString()
            .padStart(2, '0')}:${new Date(startDate).getMinutes().toString().padStart(2, '0')} - ${new Date(endDate)
            .getHours()
            .toString()
            .padStart(2, '0')}:${new Date(endDate).getMinutes().toString().padStart(2, '0')}`}
        </TableCell>
      )}
      {recurrence === 'annual' && (
        <TableCell>
          {`${new Date(startDate).getDate()} ${new Date(startDate).toLocaleString('default', {
            month: 'long',
          })} de ${new Date(startDate).getHours().toString().padStart(2, '0')}:${new Date(startDate)
            .getMinutes()
            .toString()
            .padStart(2, '0')} - ${new Date(endDate).getHours().toString().padStart(2, '0')}:${new Date(endDate)
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}
        </TableCell>
      )}
      <TableCell>
        {interval} {FrenchReccurenceNoun[recurrence]}
        {interval > 1 && recurrence !== 'monthly' ? 's' : ''}
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
                      <DialogTitle>Edition de l'adresse {props.activity.id}</DialogTitle>
                      <DialogDescription>
                        <EditForm
                          activity={props.activity}
                          setter={setter}
                          addresses={props.addresses}
                          sports={props.sports}
                          closeDialog={() => setOpenEdit(false)}
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </Button>
              <Button variant="ghost" className="w-full p-0 font-normal pl-2">
                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                  <DialogTrigger className="w-full text-left">Supprimer</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Suppression de l'adresse {props.activity.id}</DialogTitle>
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

export default ActivityRow;
