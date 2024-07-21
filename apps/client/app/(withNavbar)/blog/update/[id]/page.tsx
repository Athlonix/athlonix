'use client';

import type { SinglePost } from '@/app/lib/type/SinglePost';
import { blogFormUpdateSchema } from '@/app/lib/type/blogFormSchema';
import { type User, getUserFromCookie } from '@/app/lib/utils';
import BlogFormUpdate from '@/app/ui/components/BlogFormUpdate';
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

function Page({ params }: { params: { id: string } }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const urlApi = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const form = useForm<z.infer<typeof blogFormUpdateSchema>>({
    resolver: zodResolver(blogFormUpdateSchema),
    defaultValues: {
      title: 'Titre',
      content: 'Contenu',
      description: '',
    },
  });

  const { watch, reset } = form;
  const formValues = watch();

  useEffect(() => {
    const fillPostData = async () => {
      const data = await getBlogPost(Number(params.id));
      if (data.cover_image) {
        setCoverImage(data.cover_image);
      }
      reset({
        title: data.title,
        content: data.content,
        description: data.description,
      });
    };

    fillPostData();
  }, [params.id, reset]);

  async function submitBlogPost(values: z.infer<typeof blogFormUpdateSchema>) {
    fetch(`${urlApi}/blog/posts/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        title: formValues.title,
        content: formValues.content,
        description: formValues.description,
      }),
    })
      .then(async (response) => {
        if (response.status !== 200) {
          const error = await response.json();
          throw new Error(error.message);
        }
        return response.json();
      })
      .then((data: { id: number }) => {
        toast.success('Post edité avec succès');
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

  async function getBlogPost(id: number): Promise<SinglePost> {
    const queryPath = `${urlApi}/blog/posts/${id}`;
    const res = await fetch(queryPath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return data;
  }

  return (
    <>
      <main className="flex flex-col items-center gap-y-8 py-4">
        <div className="flex items-center justify-between w-full gap-6">
          <BlogFormUpdate form={form} submitBlogPost={submitBlogPost} />
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
                {coverImage ? (
                  <img
                    className="h-full w-full object-cover"
                    src={`${process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL}/image/blog_posts/${coverImage}`}
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

export default Page;
