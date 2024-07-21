'use client';

import { blogFormSchema } from '@/app/lib/type/blogFormSchema';
import { type User, getUserFromCookie } from '@/app/lib/utils';
import BlogForm from '@/app/ui/components/BlogForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar';
import { ScrollArea } from '@ui/components/ui/scroll-area';
import { toast } from '@ui/components/ui/sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export default function Page(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: 'Titre',
      cover_image: undefined,
      content: 'Contenu',
      description: '',
    },
  });

  const { watch } = form;
  const formValues = watch();

  async function submitBlogPost(values: z.infer<typeof blogFormSchema>) {
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

  useEffect(() => {
    async function checkUser() {
      const user = await getUserFromCookie();
      if (user) {
        setUser(user);
      } else {
        router.push('/');
      }
    }
    checkUser();
  }, [router]);

  return (
    <>
      <main className="flex flex-col items-center gap-y-8 py-4">
        <div className="flex items-center justify-between w-full gap-6">
          <BlogForm form={form} submitBlogPost={submitBlogPost} setSelectedImage={setSelectedImage} />
          <ScrollArea className="h-[800px] w-full">
            <section className="flex-col items-center justify-between w-[600px] leading-10">
              <div>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback className="bg-slate-400">{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href="simon"
                      className="font-medium text-accent underline underline-offset-2 max-w-32 truncate"
                    >
                      {user?.username}
                    </Link>
                    , <span>{format(new Date(), 'EEE dd MMMM', { locale: fr })}</span>
                  </div>
                </div>
              </div>
              <h1 className="mt-4">{formValues.title}</h1>
              <div className="w-[600px] h-[232px] mt-6 mb-6">
                {selectedImage ? (
                  <img
                    className="h-full w-full object-cover"
                    src={URL.createObjectURL(selectedImage)}
                    alt="selectionné"
                  />
                ) : (
                  <img className="h-full w-full object-cover" src={'/blog_post_default.jpg'} alt="selectionné" />
                )}
              </div>
              <p className="text-base leading-7 font-medium whitespace-pre-wrap">{formValues.content}</p>
            </section>
          </ScrollArea>
        </div>
      </main>
    </>
  );
}
