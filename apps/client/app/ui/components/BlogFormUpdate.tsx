'use client';

import type { blogFormUpdateSchema } from '@/app/lib/type/blogFormSchema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import { Textarea } from '@ui/components/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

interface BlogFormProps {
  form: UseFormReturn<z.infer<typeof blogFormUpdateSchema>>;
  submitBlogPost: (values: z.infer<typeof blogFormUpdateSchema>) => Promise<void>;
}

function BlogFormUpdate({ form, submitBlogPost }: BlogFormProps) {
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitBlogPost)}>
          <div className="grid">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label className=" text-xl font-bold">Titre</Label>
                  <FormControl>
                    <Input {...field} className="text-xl font-bold" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">Description</Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">Contenu</Label>
                  <FormControl>
                    <Textarea className="resize-none min-h-[400px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full mt-8">
            Créer
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default BlogFormUpdate;
