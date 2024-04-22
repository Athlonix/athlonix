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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@repo/ui/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface UserProps {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  id_referer: number;
  date_validity: string;
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

export function UserRow(user: UserProps) {
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState(user.username);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [roles, setRoles] = useState(user.roles);

  const setter = { username: setUsername, firstName: setFirstName, lastName: setLastName, roles: setRoles };

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
      <TableCell>{user.date_validity}</TableCell>
      <TableCell>2023-07-12 10:42</TableCell>
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
              <Dialog open={open} onOpenChange={setOpen}>
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
                        closeDialog={() => setOpen(false)}
                        setter={setter}
                      />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </Button>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
