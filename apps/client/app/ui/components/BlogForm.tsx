'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import { toast } from '@ui/components/ui/sonner';
import { Textarea } from '@ui/components/ui/textarea';
import { Paperclip } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

function BlogForm() {
  const MAX_FILE_SIZE = 1024 * 1024 * 5;
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();
  const formSchema = z.object({
    title: z
      .string()
      .min(5, { message: 'Le champ est requis et doit faire minimum 5 caracteres' })
      .max(200, { message: 'Maximum 200 caractères' }),
    content: z
      .string()
      .min(10, { message: 'Le champs est requis et doit faire au minimum 10 caractères' })
      .max(5000, { message: 'Maximum 5000 caractères' }),
    description: z.string().optional(),
    cover_image: z
      .any()
      .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
        message: `L'image doit faire moins de ${MAX_FILE_SIZE / 1000000} Mo`,
      })
      .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
        message: "L'image doit être au format jpeg, png ou wepb",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      cover_image: undefined,
      content: '',
      description: '',
    },
  });

  async function submitBlogPost(values: z.infer<typeof formSchema>) {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;

    const formData = new FormData();
    formData.append('title', values.title);
    if (values.description) {
      formData.append('description', values.description);
    }
    if (values.cover_image) {
      formData.append('cover_image', values.cover_image[0]);
    }
    formData.append('content', values.content);

    fetch(`${urlApi}/blog/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    })
      .then(async (response) => {
        if (response.status !== 201) {
          const error = await response.json();
          throw new Error(error.message);
        }
        return response.json();
      })
      .then((data: { id: number }) => {
        router.push(`/blog/posts/${data.id}`);
      })
      .catch((error: Error) => {
        toast.error('Erreur', { duration: 20000, description: error?.message });
      });
  }

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
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">Image</Label>
                  {selectedImage && (
                    <div className="w-[600px] h-[232px]">
                      <img
                        className="h-full w-full object-cover"
                        src={URL.createObjectURL(selectedImage)}
                        alt="selectionné"
                      />
                    </div>
                  )}
                  <FormControl>
                    <div>
                      <Button size="lg" type="button">
                        <input
                          type="file"
                          className="hidden"
                          id="fileInput"
                          accept="image/*"
                          onBlur={field.onBlur}
                          name={field.name}
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            setSelectedImage(e.target.files?.[0] || null);
                          }}
                          ref={field.ref}
                        />
                        <label htmlFor="fileInput" className="inline-flex items-center">
                          <Paperclip />
                          <span className="whitespace-nowrap">Choisir une image</span>
                        </label>
                      </Button>
                    </div>
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

export default BlogForm;
