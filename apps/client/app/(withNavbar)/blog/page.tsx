'use client';

import type { Post } from '@/app/lib/type/Post';
import { BlogPost } from '@/app/ui/components/BlogPost';
import { PostFiltering } from '@/app/ui/components/PostFiltering';
import { Input } from '@repo/ui/components/ui/input';
import { toast } from '@repo/ui/components/ui/sonner';
import { Button } from '@ui/components/ui/button';
import { ScrollArea } from '@ui/components/ui/scroll-area';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts?skip=0&take=20`)
      .then((r) => {
        return r.json();
      })
      .then((postsData) => {
        if (postsData?.data) {
          const transformedData = postsData.data.map((post: { created_at: string | number | Date }) => ({
            ...post,
            createdAt: new Date(post.created_at),
          }));
          setPosts(transformedData);
        }
      });
  }, []);

  function handleLikeButton(id: number) {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id !== id) {
          return post;
        }

        if (post.userLiked) {
          toast.info('Post retiré des likes', { duration: 2000 });
        } else {
          toast.success('Post ajouté aux likes', { duration: 2000 });
        }

        return {
          ...post,
          userLiked: !post.userLiked,
        };
      }) as Post[];
    });
  }

  function deletePost(id: number) {}

  const postsElements = posts.map((post) => (
    <BlogPost key={post.id} {...post} deletePost={deletePost} isUserPost={false} handleLikeButton={handleLikeButton} />
  ));

  return (
    <>
      <main className="flex flex-col items-center gap-y-8 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="w-full gap-4 flex items-center">
            <PostFiltering />
            <div className="relative md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] border-slate-300 border-2"
                placeholder="article, utilisateur..."
                type="search"
              />
            </div>
          </div>
          <Button
            size="lg"
            variant="default"
            className="bg-transparent text-secondary-foreground border-2 border-primary rounded-3xl hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="mr-2" />
            <Link href="/blog/create">Ecrire un article</Link>
          </Button>
        </div>
        <div>
          <Button
            size="lg"
            variant="default"
            className="bg-transparent text-secondary-foreground border-2 border-primary rounded-xl hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/blog/myposts">Gérer mes posts</Link>
          </Button>
        </div>
        <ScrollArea className="h-[800px] w-full">
          <section className="w-full flex flex-col gap-y-6">{postsElements}</section>
        </ScrollArea>
      </main>
    </>
  );
}
