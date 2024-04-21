'use client';

import { type Post, dummyPosts } from '@/app/lib/dummy_posts';
import { BlogPost } from '@/app/ui/components/BlogPost';
import { PostFiltering } from '@/app/ui/components/PostFiltering';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { toast } from '@repo/ui/components/ui/sonner';
import { Plus, Search } from 'lucide-react';
import next from 'next';
import { useEffect, useState } from 'react';

export default function Page(): JSX.Element {
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

  const [posts, setPosts] = useState<Post[]>(dummyPosts);

  useEffect(() => {
    const API_URL = 'http://localhost:3101';
    console.log(API_URL);

    fetch(`${API_URL}/blog/posts`)
      .then((r) => {
        console.log('hey');
        return r.json();
      })
      .then((r) => {
        console.log('fin');

        console.log(r);
      });
  }, []);

  const postsElements = posts.map((post) => <BlogPost key={post.id} {...post} handleLikeButton={handleLikeButton} />);

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
            Ecrire un article
          </Button>
        </div>
        <section className="w-full flex flex-col gap-y-6">{postsElements}</section>
      </main>
    </>
  );
}
