'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/ui/form';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { toast } from '@ui/components/ui/sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { sendProposal } from './action';

const formSchema = z.object({
  proposal: z.string().min(1).max(255),
});

export default function IdeaSubmissionPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposal: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitted(true);
    try {
      await sendProposal(values.proposal);
      toast.success('Votre idée a été soumise avec succès !');
    } catch (error) {
      toast.error("Échec de la soumission de l'idée");
      setIsSubmitted(false);
      return;
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Soumettre une idée</CardTitle>
          <CardDescription> Soumettez votre idée pour améliorer Athlonix !</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="proposal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votre idée</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitted || !form.formState.isValid}>
                Soumettre l'idée
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
