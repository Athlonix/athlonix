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
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Round = {
  id: number;
  name: string;
  id_tournament: number;
  order: number;
};

interface EditRoundProps {
  round: Round;
}

function EditRound(props: EditRoundProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    name: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.round.name,
    },
  });

  async function submit(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${urlApi}/tournaments/${props.round.id_tournament}/rounds/${props.round.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        name: values.name,
      }),
    })
      .then((response) => {
        if (response.status === 403) {
          router.push('/');
          return;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    const url = `/dashboard/tournaments/matches?id_tournament=${props.round.id_tournament}&updated=true`;
    window.location.href = url;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Modifier le round</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modification du round</DialogTitle>
          <DialogDescription className="mx-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)}>
                <div className="grid">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="font-bold">Nom du round</Label>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <Button type="submit" className="w-full">
                    Modifier
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

export default EditRound;
