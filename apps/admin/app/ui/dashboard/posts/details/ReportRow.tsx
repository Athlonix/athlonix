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
import { MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';

type Report = {
  id: number;
  created_at: string;
  id_reason: number;
  content: string;
};

function ReportRow({ report, reason }: { report: Report; reason: string }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function deleteReport() {
    const url = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${url}/reports/${report.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    setOpenDelete(false);
    setDeleted(true);
  }

  if (deleted) {
    return null;
  }

  return (
    <TableRow key={report.id}>
      <TableCell className="font-medium">{`${new Date(report.created_at).getDate()} ${new Date(
        report.created_at,
      ).toLocaleString('default', {
        month: 'long',
      })} de ${new Date(report.created_at).getHours().toString().padStart(2, '0')}:${new Date(report.created_at)
        .getMinutes()
        .toString()
        .padStart(2, '0')}`}</TableCell>
      <TableCell>{reason}</TableCell>
      <TableCell>{report.content}</TableCell>
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
              <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogTrigger className="w-full text-left">Supprimer</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Suppression du signalement</DialogTitle>
                    <DialogDescription>
                      <div className="mb-4">Êtes-vous sûr de vouloir supprimer ce signalement ?</div>
                      <div className="flex w-full justify-end gap-4">
                        <Button variant="destructive" onClick={deleteReport}>
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

export default ReportRow;
