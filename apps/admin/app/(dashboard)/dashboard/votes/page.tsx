'use client';

import AddVote from '@/app/ui/dashboard/votes/addVotes';
import EditVote from '@/app/ui/dashboard/votes/editVotes';
import { Button } from '@repo/ui/components/ui/button';
import { Dialog, DialogContent } from '@repo/ui/components/ui/dialog';
import { toast } from '@repo/ui/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Suspense, useEffect, useState } from 'react';

export type Vote = {
  id: number;
  title: string;
  description: string;
  id_user: number;
  max_choices: number;
  start_at: string;
  end_at: string;
  options: { id: number; content: string }[];
  results: { id_choice: number; count: number }[];
};

function deleteVote(id: number, votes: Vote[], setVotes: React.Dispatch<React.SetStateAction<Vote[]>>) {
  const api = process.env.NEXT_PUBLIC_API_URL;

  fetch(`${api}/polls/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
    .then(async (response) => {
      return await response.json();
    })
    .then(() => {
      setVotes(votes.filter((vote) => vote.id !== id));
      toast.success('Vote supprimé', { duration: 2000, description: 'Le vote a bien été supprimé' });
    })
    .catch((error: Error) => {
      toast.error('Erreur', { duration: 2000, description: 'Une erreur est survenue lors de la suppression du vote' });
    });
}

function VotesList({ page = 1 }: { page?: number }) {
  const api = process.env.NEXT_PUBLIC_API_URL;

  const [votes, setVotes] = useState<Vote[]>([]);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [editingVote, setEditingVote] = useState<number | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams({
      skip: `${page - 1}`,
      take: '10',
    });

    fetch(`${api}/polls?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then(async (response) => {
        return await response.json();
      })
      .then((data: Vote[]) => {
        setVotes(data);
        setMaxPage(Math.ceil(data.length / 10));
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }, [page, api]);

  return (
    <div className="p-4">
      <div className="flex gap-4 items-right justify-end">
        <AddVote votes={votes} setVotes={setVotes} />
      </div>
      <div className="p-4">
        <div className="border rounded-lg overflow-hidden">
          {votes?.length === 0 && <div className="p-4 text-center text-muted-foreground">Aucun vote</div>}
          {votes?.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date de début</TableHead>
                  <TableHead>Date de fin</TableHead>
                  <TableHead>Choix maximum</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {votes?.map((vote) => (
                  <TableRow key={vote.id}>
                    <TableCell>{vote.title}</TableCell>
                    <TableCell>{vote.description}</TableCell>
                    <TableCell>{new Date(vote.start_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(vote.end_at).toLocaleDateString()}</TableCell>
                    <TableCell>{vote.max_choices}</TableCell>
                    <TableCell>
                      <Button>Détails</Button>
                      <Button className="ml-2" onClick={() => setEditingVote(vote.id)}>
                        Modifier
                      </Button>
                      <Button className="ml-2" onClick={() => deleteVote(vote.id, votes, setVotes)}>
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {editingVote !== null && (
          <Dialog open={editingVote !== null} onOpenChange={() => setEditingVote(null)}>
            <DialogContent>
              <EditVote id={editingVote} votes={votes} setVotes={setVotes} setEditingVote={setEditingVote} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default function Votes() {
  return (
    <div className="p-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Votes</h1>
          </div>
          <Suspense fallback={<div>Chargement...</div>}>
            <VotesList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
