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
import { toast } from '@repo/ui/components/ui/sonner';
import { TableCell, TableRow } from '@repo/ui/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface AddressProps {
  id: number;
  road: string;
  postal_code: string;
  complement: string | null;
  city: string;
  number: number;
  name: string | null;
  id_lease: number | null;
}

function AddressRow(address: AddressProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [road, setRoad] = useState(address.road);
  const [complement, setComplement] = useState(address.complement);
  const [postalCode, setPostalCode] = useState(address.postal_code);
  const [city, setCity] = useState(address.city);
  const [number, setNumber] = useState(address.number);
  const [name, setName] = useState(address.name);

  const setter = {
    road: setRoad,
    complement: setComplement,
    postalCode: setPostalCode,
    city: setCity,
    number: setNumber,
    name: setName,
  };

  async function deleteAddress() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${urlApi}/addresses/${address.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('Succès', { duration: 2000, description: "L'adresse a été supprimé avec succès" });

        setName('Supprimé');
        setRoad('');
        setComplement('');
        setPostalCode('');
        setCity('');
        setNumber(0);
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 2000, description: error?.message });
      });

    setOpenDelete(false);
  }

  if (!address || name === 'Supprimé') {
    return null;
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
                      <DialogTitle>Edition de l'adresse {address.id}</DialogTitle>
                      <DialogDescription>
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
                      <DialogTitle>Suppression de l'adresse {address.id}</DialogTitle>
                      <DialogDescription>
                        <div className="mb-4">Êtes-vous sûr de vouloir supprimer cet adresse ?</div>
                        <div className="flex w-full justify-end gap-4">
                          <Button variant="destructive" onClick={deleteAddress} disabled={name === 'Supprimé'}>
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

export default AddressRow;
