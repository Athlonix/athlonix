'use client';

import type { Activity, Address, Sport } from '@/app/lib/type/Activities';
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
import Link from 'next/link';
import { useState } from 'react';

interface ActivityRowProps {
  activity: Activity;
  sports: Sport[];
  addresses: Address[];
}

const FrenchFrequency: Record<string, string> = {
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  yearly: 'Annuel',
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
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [minParticipants, setMinParticipants] = useState(props.activity.min_participants);
  const [maxParticipants, setMaxParticipants] = useState(props.activity.max_participants);
  const [name, setName] = useState(props.activity.name);
  const [idSport, setIdSport] = useState(props.activity.id_sport);
  const [idAddress, setIdAddress] = useState(props.activity.id_address);
  const [days, setDays] = useState(props.activity.days_of_week);
  const [endDate, setEndDate] = useState(props.activity.end_date);
  const [startDate, setStartDate] = useState(props.activity.start_date);
  const [startTime, setStartTime] = useState(props.activity.start_time);
  const [endTime, setEndTime] = useState(props.activity.end_time);
  const [description, setDescription] = useState(props.activity.description);
  const [frequency, setFrequency] = useState(props.activity.frequency);

  const startDateFormat = new Date(`${startDate}T${startTime}`);
  const endDateFormat = new Date(`${endDate}T${endTime}`);

  const setter = {
    name: setName,
    minParticipants: setMinParticipants,
    maxParticipants: setMaxParticipants,
    idSport: setIdSport,
    idAddress: setIdAddress,
    days: setDays,
    startDate: setStartDate,
    endDate: setEndDate,
    startTime: setStartTime,
    endTime: setEndTime,
    description: setDescription,
    frequency: setFrequency,
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
        toast.success('Succès', { duration: 2000, description: "L'activité a été supprimé avec succès" });

        setName('Supprimé');
        setMinParticipants(0);
        setMaxParticipants(0);
        setIdSport(null);
        setIdAddress(null);
        setDays([]);
        setEndDate('');
        setStartDate('');
        setStartTime('');
        setEndTime('');
        setDescription('');
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 2000, description: error?.message });
      });

    setOpenDelete(false);
  }

  if (name === 'Supprimé') {
    return null;
  }

  return (
    <TableRow key={props.activity.id}>
      <TableCell className="font-medium">
        <Link href={`/dashboard/activities/details?id=${props.activity.id}`}>{name}</Link>
      </TableCell>
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
      <TableCell>{FrenchFrequency[frequency]}</TableCell>
      {frequency === 'weekly' && (
        <TableCell>
          {days?.map((day) => FrenchDays[day]).join(', ')} de{' '}
          {`${new Date(`2000-01-01T${startTime}`).getHours().toString().padStart(2, '0')}:${new Date(
            `2000-01-01T${startTime}`,
          )
            .getMinutes()
            .toString()
            .padStart(2, '0')} - ${new Date(`2000-01-01T${endTime}`).getHours().toString().padStart(2, '0')}:${new Date(
            `2000-01-01T${endTime}`,
          )
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}
        </TableCell>
      )}
      {frequency === 'monthly' && (
        <TableCell>
          {`Du ${startDateFormat.getDate()} de ${startDateFormat
            .getHours()
            .toString()
            .padStart(
              2,
              '0',
            )}:${startDateFormat.getMinutes().toString().padStart(2, '0')} jusqu'au ${endDateFormat.getDate()} à ${endDateFormat
            .getHours()
            .toString()
            .padStart(2, '0')}:${endDateFormat.getMinutes().toString().padStart(2, '0')}`}
        </TableCell>
      )}
      {frequency === 'yearly' && (
        <TableCell>
          {`Du ${startDateFormat.getDate()} ${(startDateFormat.getMonth() + 1)
            .toString()
            .padStart(2, '0')} de ${startDateFormat
            .getHours()
            .toString()
            .padStart(
              2,
              '0',
            )}:${startDateFormat.getMinutes().toString().padStart(2, '0')} jusqu'au ${endDateFormat.getDate()} ${(
            endDateFormat.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')} ${endDateFormat.getHours().toString().padStart(2, '0')}:${endDateFormat
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}
        </TableCell>
      )}
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
