'use client';

import EditForm from '@/app/ui/dashboard/users/EditForm';
import { Badge } from '@repo/ui/components/ui/badge';
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
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UserProps {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  id_referer: number | null;
  date_validity: string | null;
  subscription: string | null;
  status: 'applied' | 'approved' | 'rejected' | null;
  created_at: string;
  roles: { id: number; name: string }[];
}

const RoleBadge: Record<number, string> = {
  1: 'destructive',
  2: 'secondary',
  3: 'success',
  4: 'success',
  5: 'info',
  6: 'info',
  7: 'info',
  8: 'info',
  9: 'info',
};

const StatusBadge: Record<string, { color: string; text: string }> = {
  applied: {
    color: 'default',
    text: 'En attente',
  },
  approved: {
    color: 'success',
    text: 'Approuvé',
  },
  rejected: {
    color: 'destructive',
    text: 'Rejeté',
  },
};

function UserRow(user: UserProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const [username, setUsername] = useState(user.username);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [roles, setRoles] = useState(user.roles);
  const [status, setStatus] = useState(user.status);

  const setter = { username: setUsername, firstName: setFirstName, lastName: setLastName, roles: setRoles };

  function deleteUser() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${urlApi}/users/${user.id}/soft`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then(() => {
        toast.success('Succès', { duration: 2000, description: "L'utilisateur a été supprimé avec succès" });

        setUsername('Supprimé');
        setFirstName('');
        setLastName('');
        setRoles([]);
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 2000, description: error?.message });
      });

    setOpenDelete(false);
  }

  function setStatusUser(status: 'approved' | 'rejected') {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${urlApi}/users/${user.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        status,
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
        }
        return response.json();
      })
      .then(() => {
        const message = status === 'approved' ? 'approuvé' : 'rejeté';
        toast.success('Succès', { duration: 2000, description: `L'utilisateur a été ${message} avec succès` });
        setStatus(status);
        if (status === 'approved') {
          setRoles([
            ...roles,
            {
              id: 2,
              name: 'Membre',
            },
          ]);
        }
        setOpenStatus(false);
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 20000, description: error?.message });
      });
  }

  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{username}</TableCell>
      <TableCell>{firstName}</TableCell>
      <TableCell>{lastName}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>TODO</TableCell>
      <TableCell>
        {roles && roles.length > 0 ? (
          roles.map((role) => (
            <Badge
              className="m-[2px]"
              key={role.id}
              variant={RoleBadge[role.id] as 'destructive' | 'secondary' | 'success' | 'info'}
            >
              {role.name.charAt(0) + role.name.slice(1).toLowerCase()}
            </Badge>
          ))
        ) : (
          <Badge className="m-[2px]">Utilisateur</Badge>
        )}
      </TableCell>
      <TableCell>
        {user.date_validity !== null
          ? `${new Date(user.date_validity).getDate()} ${new Date(user.date_validity).toLocaleString('default', {
              month: 'long',
            })}, ${new Date(user.date_validity).getHours().toString().padStart(2, '0')}:${new Date(user.date_validity)
              .getMinutes()
              .toString()
              .padStart(2, '0')}`
          : ''}
      </TableCell>
      <TableCell>{`${new Date(user.created_at).getDate()} ${new Date(user.created_at).toLocaleString('default', {
        month: 'long',
      })}, ${new Date(user.created_at).getHours().toString().padStart(2, '0')}:${new Date(user.created_at)
        .getMinutes()
        .toString()
        .padStart(2, '0')}`}</TableCell>
      <TableCell>
        {status !== null && (
          <Badge className="m-[2px]" variant={StatusBadge[status]?.color as 'default' | 'destructive' | 'success'}>
            {StatusBadge[status]?.text}
          </Badge>
        )}
      </TableCell>
      {username !== 'Supprimé' && (
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
                      <DialogTitle>Edition de l'utilisateur {user.id}</DialogTitle>
                      <DialogDescription>
                        <EditForm
                          id={user.id}
                          username={username}
                          firstName={firstName}
                          lastName={lastName}
                          roles={roles.map((role) => role.id)}
                          closeDialog={() => setOpenEdit(false)}
                          setter={setter}
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </Button>
              {status === 'applied' && (
                <Button variant="ghost" className="w-full p-0 font-normal pl-2">
                  <Dialog open={openStatus} onOpenChange={setOpenStatus}>
                    <DialogTrigger className="w-full text-left">Approbation</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approbation de l'utilisateur {user.username}</DialogTitle>
                        <DialogDescription>
                          <div className="mb-4">Souhaitez vous valider sa demande de souscription ?</div>
                          <div className="flex w-full justify-end gap-4">
                            <Button variant="success" onClick={() => setStatusUser('approved')}>
                              Approuver
                            </Button>
                            <Button variant="destructive" onClick={() => setStatusUser('rejected')}>
                              Rejeter
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </Button>
              )}
              <Button variant="ghost" className="w-full p-0 font-normal pl-2">
                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                  <DialogTrigger className="w-full text-left">Supprimer</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edition de l'utilisateur {user.username}</DialogTitle>
                      <DialogDescription>
                        <div className="mb-4">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</div>
                        <div className="flex w-full justify-end gap-4">
                          <Button variant="destructive" onClick={deleteUser}>
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

export default UserRow;
