'use client';

import { type Assembly, getAssembly } from '@/app/(dashboard)/dashboard/assemblies/utils';
import { getAllMembers } from '@/app/lib/utils';
import type { User } from '@/app/ui/LoginForm';
import { Button } from '@ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/components/ui/table';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AssemblyDetail(): JSX.Element {
  const searchParams = useSearchParams();
  const idPoll = searchParams.get('id');
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [attendees, setAttendees] = useState<number>(0);
  const [openAddAttendee, setOpenAddAttendee] = useState<boolean>(false);
  const [members, setMembers] = useState<User[]>([]);
  const [membersCount, setMembersCount] = useState<number>(0);

  useEffect(() => {
    const fetchAssembly = async () => {
      const data = await getAssembly(Number(idPoll));
      setAttendees(data.attendees?.length ?? 0);
      setAssembly(data);
    };
    const fetchMembers = async () => {
      const members = await getAllMembers();
      setMembers(members.data);
      setMembersCount(members.count);
    };
    fetchAssembly();
    fetchMembers();
  }, [idPoll]);

  // add members to the assembly
  // close the assembly -> no more members can be added + lawsuit needs to be added

  return (
    <>
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-semibold md:text-2xl">Assemblée Générale: {assembly?.name}</h1>
      </div>
      <div className="grid gap-4 w-full">
        <div className="flex justify-center flex-col gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed shadow-sm">
          <div>{`Cette assemblée se tiendra le ${new Date(assembly?.date ?? '').toLocaleDateString()} à ${new Date(assembly?.date ?? '').toLocaleTimeString()}`}</div>
          <div>{`Lieu: ${assembly?.location ? assembly?.location : 'En ligne'}`}</div>
          <div>{assembly?.description ?? 'Pas de description'}</div>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-semibold md:text-2xl">Membres ({attendees})</h1>
        <AddAttendeeDialog
          openAddAttendee={openAddAttendee}
          setOpenAddAttendee={setOpenAddAttendee}
          members={members}
        />
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
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function AddAttendeeDialog({
  openAddAttendee,
  setOpenAddAttendee,
  members,
}: { openAddAttendee: boolean; setOpenAddAttendee: (value: boolean) => void; members: User[] }): JSX.Element {
  return (
    <Dialog open={openAddAttendee} onOpenChange={setOpenAddAttendee}>
      <DialogTrigger asChild>
        <Button>Ajouter un membre</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un membre</DialogTitle>
        </DialogHeader>
        <form onSubmit={() => {}}>
          <div className="grid gap-4 py-4">
            <Select>
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
