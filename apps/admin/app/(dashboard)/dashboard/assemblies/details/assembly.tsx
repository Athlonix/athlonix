'use client';

import {
  type Assembly,
  addAttendee,
  closeAssembly,
  getAssembly,
  getQrcode,
} from '@/app/(dashboard)/dashboard/assemblies/utils';
import type { User } from '@/app/lib/type/User';
import { getAllMembersForAssembly } from '@/app/lib/utils';
import { Button } from '@ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';
import { Label } from '@ui/components/ui/label';
import Loading from '@ui/components/ui/loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/components/ui/select';
import { toast } from '@ui/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/components/ui/table';
import { Textarea } from '@ui/components/ui/textarea';
import { BookOpenText, CircleArrowLeft, HomeIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import { type Address, getOneAddress } from '../../addresses/utils';

export default function AssemblyDetail(): JSX.Element {
  const searchParams = useSearchParams();
  const idPoll = searchParams.get('id');
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [attendees, setAttendees] = useState<number>(0);
  const [openAddAttendee, setOpenAddAttendee] = useState<boolean>(false);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openCloseAssembly, setOpenCloseAssembly] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [openQrCode, setOpenQrCode] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [started, setStarted] = useState<boolean>(false);
  const [location, setLocation] = useState<Address | null>(null);

  useEffect(() => {
    const fetchAssembly = async () => {
      try {
        setLoading(true);
        const data = await getAssembly(Number(idPoll));
        setAssembly(data);
        setAttendees(data.attendees?.length ?? 0);
        setIsClosed(data.closed);

        const attendeesArray = (data?.attendees ?? []).map((attendee) => attendee.id);
        const membersData = await getAllMembersForAssembly(attendeesArray);
        setMembers(membersData.data);

        setStarted(new Date().getTime() > new Date(data.date).getTime());

        if (data.location) {
          const locationData = await getOneAddress(Number(data.location));
          setLocation(locationData);
        }
      } catch (_error) {
        toast.error("Une erreur est survenue lors du chargement des données de l'assemblée");
      } finally {
        setLoading(false);
      }
    };

    if (idPoll) {
      fetchAssembly();
    }
  }, [idPoll]);

  async function handleAddAttendee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id_user = Number(formData.get('id_user'));
    try {
      await addAttendee(Number(idPoll), id_user);
      setOpenAddAttendee(false);
      const data = await getAssembly(Number(idPoll));
      setAttendees(data.attendees?.length ?? 0);
      setAssembly(data);
    } catch (_error) {
      toast.error("Erreur lors de l'ajout du membre");
    }
  }

  async function handleEndAssembly(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lawsuit = formData.get('lawsuit') as string;
    await closeAssembly(Number(idPoll), lawsuit);
    setOpenCloseAssembly(false);
    const data = await getAssembly(Number(idPoll));
    setAssembly(data);
  }

  async function requestQrCode() {
    if (qrCode) {
      setOpenQrCode(true);
      return;
    }
    const data = await getQrcode(Number(idPoll));
    setQrCode(data);
    setOpenQrCode(true);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center gap-5">
        <CircleArrowLeft className="w-8 h-8" onClick={() => window.history.back()} cursor={'pointer'} />
        <h1 className="text-lg font-semibold md:text-2xl">{assembly?.name}</h1>
        <div className="ml-auto flex gap-5">
          {!isClosed && started && (
            <CloseAssemblyDialog
              openCloseAssembly={openCloseAssembly}
              setOpenCloseAssembly={setOpenCloseAssembly}
              handleEndAssembly={handleEndAssembly}
            />
          )}
        </div>
      </div>
      <div className="grid gap-4 w-full">
        <div className="flex justify-center flex-col gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed shadow-sm">
          <div>
            {isClosed ? (
              <span className="text-red-500">Terminée</span>
            ) : started ? (
              <span className="text-green-500">En cours de déroulement</span>
            ) : (
              <span className="text-blue-500">Débutera le {new Date(assembly?.date ?? 0).toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <HomeIcon className="w-6 h-6" />
            {location ? `${location.road} ${location.city} ${location.postal_code}` : 'En ligne'}
          </div>
          <div className="flex items-center gap-2">
            <BookOpenText className="w-6 h-6" />
            {assembly?.description ?? 'Pas de description'}
          </div>
        </div>
      </div>
      {!started && (
        <div className="grid gap-4 w-full">
          <div className="flex justify-center flex-col gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed shadow-sm">
            <div className="flex items-center gap-2">
              <span>
                Une fois l'assemblée générale commencée, vous pourrez générer un QR Code pour confirmer la présence des
                membres.
              </span>
            </div>
          </div>
        </div>
      )}
      {started && (
        <>
          <div className="flex items-center gap-5">
            <h1 className="text-lg font-semibold md:text-2xl">Membres de l'assemblée ({attendees})</h1>
            {!isClosed && (
              <div className="ml-auto flex gap-5">
                <AddAttendeeDialog
                  openAddAttendee={openAddAttendee}
                  setOpenAddAttendee={setOpenAddAttendee}
                  members={members}
                  handleAddAttendee={handleAddAttendee}
                />
                <QrCodeDialog
                  openQrCode={openQrCode}
                  setOpenQrCode={setOpenQrCode}
                  qrCode={qrCode}
                  requestQrCode={requestQrCode}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom et Prénom</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees === 0 && (
                  <TableRow>
                    <TableCell colSpan={2}>Aucun membre n'a encore été ajouté à cette assemblée</TableCell>
                  </TableRow>
                )}
                {assembly?.attendees?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{`${member.first_name} ${member.last_name}`}</TableCell>
                    <TableCell>{member.email}</TableCell>
                  </TableRow>
                )) ?? []}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}

function AddAttendeeDialog({
  openAddAttendee,
  setOpenAddAttendee,
  members,
  handleAddAttendee,
}: {
  openAddAttendee: boolean;
  setOpenAddAttendee: (value: boolean) => void;
  members: User[];
  handleAddAttendee: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={openAddAttendee} onOpenChange={setOpenAddAttendee}>
      <DialogTrigger asChild>
        <Button>Ajouter un membre</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un membre</DialogTitle>
        </DialogHeader>
        <form onSubmit={(event) => handleAddAttendee(event)}>
          <div className="grid gap-4 py-4">
            <Select name="id_user" required>
              <SelectTrigger className="w-full rounded-lg bg-background pl-8 text-black border border-gray-300">
                <SelectValue placeholder="Membre" />
              </SelectTrigger>
              <SelectContent defaultValue={'0'}>
                {members?.length === 0 && (
                  <SelectItem disabled value={'0'}>
                    Aucun membre n'est disponible
                  </SelectItem>
                )}
                {members?.map((member) => (
                  <SelectItem key={member.id} value={String(member.id)}>
                    {member.first_name} {member.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={members.length === 0}>
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CloseAssemblyDialog({
  openCloseAssembly,
  setOpenCloseAssembly,
  handleEndAssembly,
}: {
  openCloseAssembly: boolean;
  setOpenCloseAssembly: (value: boolean) => void;
  handleEndAssembly: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={openCloseAssembly} onOpenChange={setOpenCloseAssembly}>
      <DialogTrigger asChild>
        <Button className="bg-red-800">Terminer l'assemblée</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Terminer l'assemblée</DialogTitle>
          <DialogDescription>
            Pour mettre fin à l'assemblée générale, veuillez saisir le compte rendu complet ci dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => handleEndAssembly(event)}>
          <div className="grid gap-4 py-4">
            <Label htmlFor="lawsuit">Compte rendu de l'assemblée</Label>
            <Textarea
              id="lawsuit"
              name="lawsuit"
              required
              placeholder="Compte rendu de l'assemblée générale"
              minLength={20}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Terminer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function QrCodeDialog({
  openQrCode,
  setOpenQrCode,
  qrCode,
  requestQrCode,
}: {
  openQrCode: boolean;
  setOpenQrCode: (value: boolean) => void;
  qrCode: string;
  requestQrCode: () => void;
}) {
  return (
    <Dialog open={openQrCode} onOpenChange={setOpenQrCode}>
      <DialogTrigger asChild>
        <Button className="bg-blue-800" onClick={() => requestQrCode()}>
          Générer le QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>
            Pour confirmer votre présence à l'assemblée générale, veuillez scanner le QR Code ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 justify-center">
          <img src={qrCode} alt="QR Code" height={200} width={200} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
