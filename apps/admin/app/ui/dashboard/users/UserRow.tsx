'use client';

import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@repo/ui/components/ui/table';
import { MoreHorizontal } from 'lucide-react';

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
  console.log(user.roles);
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell>{user.first_name}</TableCell>
      <TableCell>{user.last_name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>TODO</TableCell>
      <TableCell>
        {user.roles && user.roles.length > 0 ? (
          user.roles.map((role) => (
            <Badge
              className="m-[2px]"
              key={role.id}
              variant={RoleBadge[role.id] as 'destructive' | 'secondary' | 'success' | 'info'}
            >
              {role.name.toLowerCase()}
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
