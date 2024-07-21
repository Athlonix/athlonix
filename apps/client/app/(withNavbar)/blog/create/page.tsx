'use client';

import { type User, getUserFromCookie } from '@/app/lib/utils';
import BlogForm from '@/app/ui/components/BlogForm';
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar';
import { ScrollArea } from '@ui/components/ui/scroll-area';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Post = {
  title: string;
  content: string;
  image: string;
};

export default function Page(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [visuPost, setVisuPost] = useState<Post>({
    title: 'Titre',
    content: 'Contenu',
    image: '',
  });
  const router = useRouter();

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
          <BlogForm />
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
              <h1 className="mt-4">{visuPost.title}</h1>
              <div className="w-[600px] h-[232px] mt-6 mb-6">
                <img className="h-full w-full object-cover" src={'/blog_post_default.jpg'} alt="selectionné" />
              </div>
              <p className="text-base leading-7 font-medium">{visuPost.content}</p>
            </section>
          </ScrollArea>
        </div>
      </main>
    </>
  );
}
