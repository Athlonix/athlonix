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

export function UsersList() {
  const urlApi = process.env.ATHLONIX_API_URL;

  console.log(fetch(`${urlApi}/users`).then((response) => console.log(response)));
  fetch(`${urlApi}/users`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <TableRow>
      <TableCell className="font-medium">Samy la merde</TableCell>
      <TableCell>Samy</TableCell>
      <TableCell>Alouadi</TableCell>
      <TableCell>Alouadi@gmail.com</TableCell>
      <TableCell>Aucun</TableCell>
      <TableCell>
        <Badge variant="destructive">Banni</Badge>
      </TableCell>
      <TableCell>2023-07-12 10:42</TableCell>
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
