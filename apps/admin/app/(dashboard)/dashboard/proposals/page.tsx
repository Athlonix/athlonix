'use client';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { toast } from '@ui/components/ui/sonner';
import { useEffect, useState } from 'react';
import { type Proposal, deleteProposal, getAllProposals } from './actions';

export default function AdminIdeasPage() {
  const [ideas, setIdeas] = useState<Proposal[]>([]);

  useEffect(() => {
    async function fetchIdeas() {
      const ideas = await getAllProposals();
      setIdeas(ideas.data);
    }

    fetchIdeas();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteProposal(id);
      setIdeas(ideas.filter((idea) => idea.id !== id));
      toast.success("L'idée a été supprimée avec succès.");
    } catch (_error) {
      toast.error("Une erreur s'est produite lors de la suppression de l'idée.");
    }
  };

  if (ideas.length === 0 || !ideas) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Boite à idées</CardTitle>
            <CardDescription>Gérez les idées soumises par les membres.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Aucune idée n'a été soumise pour le moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Boite à idées</CardTitle>
          <CardDescription>Gérez les idées soumises par les membres.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proposition</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ideas.map((idea) => (
                  <TableRow key={idea.id}>
                    <TableCell className="max-w-md">{idea.proposal}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Voir</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Détails de la proposition</DialogTitle>
                              <DialogDescription>
                                {idea.proposal.length > 50 ? `${idea.proposal.slice(0, 50)}...` : idea.proposal}
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={() => handleDelete(idea.id)} variant="destructive">
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
