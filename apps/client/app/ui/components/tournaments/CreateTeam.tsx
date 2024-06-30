import type { Team } from '@/app/lib/type/Tournaments';
import { createTeam } from '@/app/lib/utils/tournament';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { toast } from '@repo/ui/components/ui/sonner';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface CreateTeamProps {
  id_tournament: string;
  setTeams: Dispatch<SetStateAction<Team[]>>;
  setCurrentTeam: Dispatch<SetStateAction<number>>;
}

function CreateTeam(props: CreateTeamProps) {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: 'Le champ est requis' })
      .max(25, { message: 'Le nom ne peut pas dépasser 25 caractères' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const { data, status } = await createTeam({
      id: Number.parseInt(props.id_tournament),
      name: values.name,
    });

    if (status === 201) {
      toast.success("L'équipe a bien été créée", { duration: 2000 });
      props.setTeams((teams: Team[]) => {
        return [...teams, data];
      });
      props.setCurrentTeam(data.id);
      setOpen(false);
      form.reset();
    } else {
      toast.error("Une erreur est survenue lors de la création de l'équipe", { duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Créer une équipe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Création d'une équipe</DialogTitle>
          <DialogDescription className="mx-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)}>
                <div className="grid gap-4">
                  <div className="grid">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-bold">Nom de l'équipe</Label>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button type="submit" className="w-full">
                    Créer
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => setOpen(false)} className="w-full">
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTeam;
